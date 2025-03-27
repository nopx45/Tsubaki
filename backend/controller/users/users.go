package users

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/webapp/config"
	"github.com/webapp/entity"
	"github.com/webapp/services"
	"golang.org/x/crypto/bcrypt"
)

type UpdateUserInput struct {
	FirstName           string `json:"first_name"`
	LastName            string `json:"last_name"`
	Email               string `json:"email"`
	Username            string `json:"username"`
	Role                string `json:"role"`
	Password            string `json:"password"` // optional
	ForcePasswordChange *bool  `json:"force_password_change"`
}

func GetAll(c *gin.Context) {
	var users []entity.Users
	db := config.DB()
	results := db.Find(&users)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, users)
}

func GetNotAll(c *gin.Context) {
	var users []entity.Users
	db := config.DB()
	result := db.Raw("SELECT id,first_name, last_name, email, phone FROM users").Scan(&users)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	if len(users) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "No users found"})
		return
	}
	c.JSON(http.StatusOK, users)
}

func GetID(c *gin.Context) {
	ID := c.Param("id")
	var user entity.Users
	db := config.DB()
	results := db.First(&user, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	if user.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, user)
}

func Update(c *gin.Context) {
	var user entity.Users
	UserID := c.Param("id")
	db := config.DB()

	if err := db.First(&user, UserID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	var input UpdateUserInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	// เตรียม map สำหรับ fields ที่จะอัปเดต
	updates := map[string]interface{}{}

	if input.FirstName != "" {
		updates["first_name"] = input.FirstName
	}
	if input.LastName != "" {
		updates["last_name"] = input.LastName
	}
	if input.Email != "" {
		updates["email"] = input.Email
	}
	if input.Username != "" {
		updates["username"] = input.Username
	}
	if input.Role != "" {
		updates["role"] = input.Role
	}
	if input.ForcePasswordChange != nil {
		updates["force_password_change"] = *input.ForcePasswordChange
	}
	if input.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถเข้ารหัสรหัสผ่านได้"})
			return
		}
		updates["password"] = string(hashedPassword)
	}

	if len(updates) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่มีข้อมูลที่ต้องอัปเดต"})
		return
	}

	if err := db.Model(&user).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถอัปเดตข้อมูลได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

func GetUserProfile(c *gin.Context) {
	tokenString, err := c.Cookie("auth_token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing auth token"})
		return
	}

	jwtWrapper := services.JwtWrapper{
		SecretKey: "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
		Issuer:    "AuthService",
	}
	claims, err := jwtWrapper.ValidateToken(tokenString)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	// ดึง user จาก DB ด้วย claims.UserID
	var user entity.Users
	db := config.DB()
	if err := db.First(&user, "id = ?", claims.UserID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// ตอบกลับข้อมูล user (สามารถ filter field ได้)
	c.JSON(http.StatusOK, gin.H{
		"ID":         user.ID,
		"first_name": user.FirstName,
		"last_name":  user.LastName,
		"username":   user.Username,
		"email":      user.Email,
		"phone":      user.Phone,
		"role":       user.Role,
	})
}

func Delete(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM users WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}
