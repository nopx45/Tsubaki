package users

import (
	"errors"
	"net/http"

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
		Username  string `json:"username"`
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

	role := "user" // Default เป็น "user"
	if payload.Username == "admin" {
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

	// Save the user to the database
	if err := db.Create(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Sign-up successful", "role": role})
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

	jwtWrapper.GenerateToken(c.Writer, user.Username, user.Role)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Error signing token"})
		return
	}

	// ✅ ตรวจสอบ Role และกำหนด Redirect URL
	var redirectURL string
	if user.Role == "admin" {
		redirectURL = "/admin/file"
	} else {
		redirectURL = "/"
	}

	c.JSON(http.StatusOK, gin.H{
		"token_type":   "Bearer",
		"token":        jwtWrapper,
		"id":           user.ID,
		"role":         user.Role,
		"redirect_url": redirectURL,
	})
}
