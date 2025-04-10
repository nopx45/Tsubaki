package services

import (
	"net/http"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
	"github.com/webapp/config"
	"github.com/webapp/entity"
)

// JwtWrapper wraps the signing key and the issuer
type JwtWrapper struct {
	SecretKey         string
	Issuer            string
	ExpirationHours int64
}

// JwtClaim adds user info as claims to the token
type JwtClaim struct {
	UserID   uint   `json:"user_id"`
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.StandardClaims
}

// GenerateToken creates and sets a signed JWT token and session ID in cookies
func (j *JwtWrapper) GenerateToken(w http.ResponseWriter, userID uint, username string, role string) error {
	claims := &JwtClaim{
		Username: username,
		Role:     role,
		UserID:   userID,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * time.Duration(j.ExpirationHours)).Unix(),
			Issuer:    j.Issuer,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString([]byte(j.SecretKey))
	if err != nil {
		return err
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "auth_token",
		Value:    signedToken,
		HttpOnly: true,
		Secure:   false,
		SameSite: http.SameSiteLaxMode,
		// Expires:  time.Now().Add(time.Hour * time.Duration(j.ExpirationHours)),
	})

	sessionID := uuid.New().String()
	http.SetCookie(w, &http.Cookie{
		Name:     "session_id",
		Value:    sessionID,
		HttpOnly: true,
		Secure:   false,
		SameSite: http.SameSiteLaxMode,
		// Expires:  time.Now().Add(24 * time.Hour),
	})

	return nil
}

// ValidateToken parses and validates the JWT token
func (j *JwtWrapper) ValidateToken(tokenString string) (*JwtClaim, error) {
	token, err := jwt.ParseWithClaims(
		tokenString,
		&JwtClaim{},
		func(token *jwt.Token) (interface{}, error) {
			return []byte(j.SecretKey), nil
		},
	)
	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*JwtClaim)
	if !ok || !token.Valid {
		return nil, err
	}

	return claims, nil
}

type UserService struct{}

func (s *UserService) GetUserByID(id uint) (*entity.Users, error) {
	db := config.DB()
	var user entity.Users
	if err := db.First(&user, id).Error; err != nil {
		return nil, err
	}
	return &user, nil
}
