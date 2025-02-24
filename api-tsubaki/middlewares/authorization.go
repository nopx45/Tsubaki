package middlewares

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/webapp/services"
)

func Authorizes(role string) gin.HandlerFunc {
	return func(c *gin.Context) {
		jwtWrapper := services.JwtWrapper{
			SecretKey: "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
			Issuer:    "AuthService",
		}

		cookie, err := c.Request.Cookie("auth_token")
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Missing auth token"})
			return
		}

		claims, err := jwtWrapper.ValidateToken(cookie.Value)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}

		userRole := claims.Role
		if userRole != role {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Access Denied"})
			return
		}

		c.Next()
	}
}

func AuthorizeUser() gin.HandlerFunc {
	return Authorizes("user")
}

func AuthorizeAdmin() gin.HandlerFunc {
	return Authorizes("admin")
}
