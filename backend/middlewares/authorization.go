package middlewares

import (
	"errors"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/webapp/services"
)

func Authorizes(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		jwtWrapper := services.JwtWrapper{
			SecretKey: "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
			Issuer:    "AuthService",
		}

		cookie, err := c.Request.Cookie("auth_token")
		if err != nil || cookie.Value == "" {
			return
		}

		claims, err := jwtWrapper.ValidateToken(cookie.Value)
		if err != nil || claims == nil {
			var ve *jwt.ValidationError
			if errors.As(err, &ve) {
				if ve.Errors&(jwt.ValidationErrorExpired|jwt.ValidationErrorIssuedAt|jwt.ValidationErrorNotValidYet) != 0 {
					c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "SessionExpired"})
					return
				}
			}

			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "InvalidToken"})
			return
		}

		sessionCookie, err := c.Request.Cookie("session_id")
		if err != nil || sessionCookie.Value == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Missing session ID"})
			return
		}

		userRole := strings.ToLower(strings.TrimSpace(claims.Role))
		userID := claims.UserID
		username := claims.Username
		sessionID := sessionCookie.Value

		c.Set("username", username)
		c.Set("userID", userID)
		c.Set("role", userRole)
		c.Set("session_id", sessionID)

		for _, role := range roles {
			if userRole == strings.ToLower(strings.TrimSpace(role)) {
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

func AuthorizeAdminHR() gin.HandlerFunc {
	return Authorizes("adminhr", "admin")
}

func AuthorizeAdminIT() gin.HandlerFunc {
	return Authorizes("adminit", "admin")
}

func AuthorizeSuperAdmin() gin.HandlerFunc {
	return Authorizes("admin")
}
