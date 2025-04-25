package users

import (
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/webapp/config"
	"github.com/webapp/entity"
	"github.com/webapp/services"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

var loginAttempts = make(map[string]int)
var blockedUntil = make(map[string]time.Time)

const maxLoginAttempts = 5
const blockDuration = 15 * time.Minute

type (
	Authen struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	signUp struct {
		FirstName string `json:"first_name"`
		LastName  string `json:"last_name"`
		Username  string `json:"username" binding:"required,max=20"`
		Email     string `json:"email"`
		Phone     string `json:"phone"`
		Password  string `json:"password"`
		Role      string `json:"role"`
	}
)

func SignUp(c *gin.Context) {
	var payload signUp

	// Bind JSON payload to the struct
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()
	var userCheck entity.Users

	// Check if the user with the provided username already exists
	result := db.Where("username = ?", payload.Username).First(&userCheck)
	if result.Error != nil && !errors.Is(result.Error, gorm.ErrRecordNotFound) {

		// If there's a database error other than "record not found"
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	if userCheck.ID != 0 {

		// If the user with the provided username already exists
		c.JSON(http.StatusConflict, gin.H{"error": "Username is already registered"})
		return
	}

	// Hash the user's password
	hashedPassword, _ := config.HashPassword(payload.Password)

	role := "user"
	if payload.Role == "adminit" {
		adminUsername := "admin"
		var adminUser entity.Users
		db.Where("username = ?", adminUsername).First(&adminUser)
		if adminUser.Role != "admin" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Only admin can assign adminit role"})
			return
		}
		role = "adminit"
	} else if payload.Role == "adminhr" {
		adminUsername := "admin"
		var adminUser entity.Users
		db.Where("username = ?", adminUsername).First(&adminUser)
		if adminUser.Role != "admin" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Only admin can assign adminit role"})
			return
		}
		role = "adminhr"
	} else if payload.Username == "admin" {
		role = "admin"
	}

	// Create a new user
	user := entity.Users{
		FirstName: payload.FirstName,
		LastName:  payload.LastName,
		Username:  payload.Username,
		Email:     payload.Email,
		Phone:     payload.Phone,
		Password:  hashedPassword,
		Role:      role,
	}

	if _, err := govalidator.ValidateStruct(user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// Save the user to the database
	if err := db.Create(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Sign-up successful"})
}

func SignIn(c *gin.Context) {
	var payload Authen
	var user entity.Users

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	username := payload.Username

	// ถ้ามีการบล็อกการเข้าใช้งาน
	if unblockTime, exists := blockedUntil[username]; exists {
		if time.Now().Before(unblockTime) {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error": fmt.Sprintf("Account locked. Try again at %s", unblockTime.Format("15:04:05")),
			})
			return
		}
		// ครบเวลาแล้ว ยกเลิกบล็อก
		delete(blockedUntil, username)
		delete(loginAttempts, username)
	}

	// ดึงข้อมูล user จาก DB
	if err := config.DB().Where("username = ?", username).First(&user).Error; err != nil {
		// เพิ่มการนับจำนวนความพยายาม (เฉพาะถ้ามี user จริง)
		loginAttempts[username]++
		if loginAttempts[username] >= maxLoginAttempts {
			blockedUntil[username] = time.Now().Add(blockDuration)
			c.JSON(http.StatusTooManyRequests, gin.H{"error": "Too many login attempts. Try again later."})
			return
		}
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// ตรวจสอบรหัสผ่าน
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(payload.Password))
	if err != nil {
		loginAttempts[username]++
		if loginAttempts[username] >= maxLoginAttempts {
			blockedUntil[username] = time.Now().Add(blockDuration)
			c.JSON(http.StatusTooManyRequests, gin.H{"error": "Too many login attempts. Try again later."})
			return
		}
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Password is incorrect"})
		return
	}

	// ล้างความพยายามเมื่อเข้าสู่ระบบสำเร็จ
	delete(loginAttempts, username)
	delete(blockedUntil, username)

	// สร้าง Token
	jwtWrapper := services.JwtWrapper{
		SecretKey:       "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
		Issuer:          "AuthService",
		ExpirationHours: 3,
	}

	err = jwtWrapper.GenerateToken(c.Writer, user.ID, user.Username, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error setting token"})
		return
	}

	var redirectURL string
	switch user.Role {
	case "admin":
		redirectURL = "/admin"
	case "adminit":
		redirectURL = "admin/it-knowledge"
	case "adminhr":
		redirectURL = "admin"
	default:
		redirectURL = "/"
	}

	c.JSON(http.StatusOK, gin.H{
		"token_type":            "Bearer",
		"token":                 jwtWrapper,
		"id":                    user.ID,
		"name":                  user.FirstName,
		"role":                  user.Role,
		"redirect_url":          redirectURL,
		"force_password_change": user.ForcePasswordChange,
	})
}

func GetAuthToken(c *gin.Context) {
	cookie, err := c.Request.Cookie("auth_token")
	if err != nil || cookie.Value == "" {
		return
	}

	jwtWrapper := services.JwtWrapper{
		SecretKey: "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
		Issuer:    "AuthService",
	}

	_, err = jwtWrapper.ValidateToken(cookie.Value)
	if err != nil {
		var ve *jwt.ValidationError
		if errors.As(err, &ve) && ve.Errors&(jwt.ValidationErrorExpired) != 0 {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "SessionExpired"})
			return
		}
		c.JSON(http.StatusUnauthorized, gin.H{"error": "InvalidToken"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": cookie.Value})
}

func Logout(c *gin.Context) {
	// Secure = true ใน production (HTTPS) / false ใน localhost
	secureFlag := false
	if c.Request.TLS != nil { // ใช้ HTTPS เท่านั้น
		secureFlag = true
	}

	// ลบ auth_token และ session_id
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "auth_token",
		Value:    "",
		Path:     "/",
		Domain:   "http://tat-webcenter",
		MaxAge:   -1,
		Secure:   secureFlag,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode, // http = Lax , https = None
	})
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "session_id",
		Value:    "",
		Path:     "/",
		Domain:   "http://tat-webcenter",
		MaxAge:   -1,
		Secure:   secureFlag,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode, // http = Lax , https = None
	})

	c.JSON(http.StatusOK, gin.H{"message": "Logout successful"})
}

func ChangePassword(c *gin.Context) {
	jwtWrapper := services.JwtWrapper{
		SecretKey: "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx", // ให้ตรงกับตอน generate
		Issuer:    "AuthService",
	}
	// ดึง JWT token จาก cookie
	cookie, err := c.Request.Cookie("auth_token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	claims, err := jwtWrapper.ValidateToken(cookie.Value)
	if err != nil {
		// ตรวจสอบ token ผิดพลาด เช่น หมดอายุ หรือไม่ถูกต้อง
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	// ดึง user ID จาก claims
	userID := claims.UserID

	// Bind body
	var req struct {
		CurrentPassword string `json:"current_password"`
		NewPassword     string `json:"new_password"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// ดึงข้อมูลผู้ใช้
	var user entity.Users
	db := config.DB()
	if err := db.First(&user, "id = ?", userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// ตรวจสอบรหัสผ่านเดิม
	if !user.ForcePasswordChange {
		if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.CurrentPassword)); err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Current password is incorrect"})
			return
		}
	}

	// ตรวจสอบรหัสผ่านใหม่
	if len(req.NewPassword) < 6 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "New password must be at least 6 characters long"})
		return
	}

	// Hash password ใหม่
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// อัปเดตฐานข้อมูล
	if err := db.Model(&user).Updates(map[string]interface{}{
		"password":              string(hashedPassword),
		"force_password_change": false,
	}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":      "Password changed successfully",
		"redirect_url": "/",
	})
}
