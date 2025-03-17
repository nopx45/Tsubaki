package middlewares

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/webapp/services"
)

func Authorizes(roles ...string) gin.HandlerFunc {
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

		sessionCookie, err := c.Request.Cookie("session_id")
		if err != nil || sessionCookie.Value == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Missing session ID"})
			return
		}

		userRole := claims.Role
		username := claims.Username
		sessionID := sessionCookie.Value

		c.Set("username", username)
		c.Set("role", userRole)
		c.Set("session_id", sessionID)

		for _, role := range roles {
			if userRole == role {
				c.Next()
				return
			}
		}

		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Access Denied"})
	}
}

func AuthorizeUser() gin.HandlerFunc {
	return Authorizes("user", "admin")
}

func AuthorizeSuperUser() gin.HandlerFunc {
	return Authorizes("superuser", "admin")
}

func AuthorizeAdmin() gin.HandlerFunc {
	return Authorizes("admin")
}
