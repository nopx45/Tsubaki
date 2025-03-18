package users

import (
	"errors"
	"net/http"
	"os"

	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"github.com/webapp/config"
	"github.com/webapp/entity"
	"github.com/webapp/services"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

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

	// ค้นหา user ด้วย Username ที่ผู้ใช้กรอกเข้ามา

	if err := config.DB().Raw("SELECT * FROM users WHERE username = ?", payload.Username).Scan(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ตรวจสอบรหัสผ่าน
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(payload.Password))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "password is incerrect"})
		return
	}

	jwtWrapper := services.JwtWrapper{
		SecretKey:       "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
		Issuer:          "AuthService",
		ExpirationHours: 24,
	}

	err = jwtWrapper.GenerateToken(c.Writer, user.Username, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error setting token"})
		return
	}

	var redirectURL string
	if user.Role == "admin" {
		redirectURL = "/admin"
	} else if user.Role == "adminit" {
		redirectURL = "admin/it-knowledge"
	} else if user.Role == "adminhr" {
		redirectURL = "admin"
	} else {
		redirectURL = "/"
	}

	c.JSON(http.StatusOK, gin.H{
		"token_type":   "Bearer",
		"token":        jwtWrapper,
		"id":           user.ID,
		"name":         user.FirstName,
		"role":         user.Role,
		"redirect_url": redirectURL,
	})
}

func AutoLogin(c *gin.Context) {
	systemUsername := os.Getenv("USERNAME") // Windows
	if systemUsername == "" {
		systemUsername = os.Getenv("USER") // Linux/macOS
	}

	var users entity.Users
	if err := config.DB().Raw("SELECT * FROM users WHERE username = ?", systemUsername).Scan(&users).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	jwtWrapper := services.JwtWrapper{
		SecretKey:       "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
		Issuer:          "AuthService",
		ExpirationHours: 24,
	}

	err := jwtWrapper.GenerateToken(c.Writer, users.Username, users.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error setting token"})
		return
	}

	var redirectURL string
	if users.Role == "admin" {
		redirectURL = "/admin"
	} else if users.Role == "adminit" {
		redirectURL = "admin/it-knowledge"
	} else if users.Role == "adminhr" {
		redirectURL = "admin"
	} else {
		redirectURL = "/"
	}

	c.JSON(http.StatusOK, gin.H{
		"token_type":   "Bearer",
		"token":        jwtWrapper,
		"id":           users.ID,
		"username":     users.Username,
		"role":         users.Role,
		"redirect_url": redirectURL,
	})
}

func GetAuthToken(c *gin.Context) {
	cookie, err := c.Request.Cookie("auth_token")
	if err != nil {
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
		Domain:   "192.168.0.85",
		MaxAge:   -1,
		Secure:   secureFlag,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode, // http = Lax , https = None
	})
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "session_id",
		Value:    "",
		Path:     "/",
		Domain:   "192.168.0.85",
		MaxAge:   -1,
		Secure:   secureFlag,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode, // http = Lax , https = None
	})

	c.JSON(http.StatusOK, gin.H{"message": "Logout successful"})
}
