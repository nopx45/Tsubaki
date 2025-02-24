package middlewares

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/webapp/services"
)

// Authorization เป็นฟังก์ชันตรวจสอบ JWT และ Role
func Authorizes(role string) gin.HandlerFunc {
	return func(c *gin.Context) {
		clientToken := c.Request.Header.Get("Authorization")
		if clientToken == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "No Authorization header provided"})
			return
		}

		// ตรวจสอบรูปแบบ Bearer Token
		extractedToken := strings.Split(clientToken, "Bearer ")
		if len(extractedToken) != 2 {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Incorrect Format of Authorization Token"})
			return
		}
		clientToken = strings.TrimSpace(extractedToken[1])

		// ตรวจสอบ JWT
		jwtWrapper := services.JwtWrapper{
			SecretKey: "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
			Issuer:    "AuthService",
		}

		claims, err := jwtWrapper.ValidateToken(clientToken)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}

		// ดึง Role จาก Claims
		userRole := claims.Role

		// ตรวจสอบสิทธิ์ของผู้ใช้
		if userRole != role {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Access Denied"})
			return
		}

		// ผ่านการตรวจสอบ
		c.Next()
	}
}

// ใช้งาน Middleware แยกกัน
func AuthorizeUser() gin.HandlerFunc {
	return Authorizes("user")
}

func AuthorizeAdmin() gin.HandlerFunc {
	return Authorizes("admin")
}
