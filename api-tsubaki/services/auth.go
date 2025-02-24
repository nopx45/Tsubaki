package services

import (
	"errors"
	"net/http"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
)

// JwtWrapper wraps the signing key and the issuer
type JwtWrapper struct {
	SecretKey       string
	Issuer          string
	ExpirationHours int64
}

// JwtClaim adds email as a claim to the token
type JwtClaim struct {
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.StandardClaims
}

// ✅ ส่ง JWT ผ่าน HttpOnly Secure Cookie
func (j *JwtWrapper) GenerateToken(w http.ResponseWriter, Username string, role string) error {
	claims := &JwtClaim{
		Username: Username,
		Role:     role,
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

	// ✅ ตั้งค่า HttpOnly Secure Cookie
	http.SetCookie(w, &http.Cookie{
		Name:     "auth_token",
		Value:    signedToken,
		HttpOnly: true,
		Secure:   false, // ใช้ HTTPS เท่านั้น
		SameSite: http.SameSiteStrictMode,
		Path:     "/",
		Expires:  time.Now().Add(time.Hour * time.Duration(j.ExpirationHours)),
	})

	return nil
}

// ✅ แก้ไขให้รับ `tokenString` เป็น `string` แทน `*http.Request`
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
		return nil, errors.New("invalid JWT token")
	}

	// ✅ ตรวจสอบ JWT หมดอายุหรือยัง
	if claims.ExpiresAt < time.Now().Unix() {
		return nil, errors.New("JWT is expired")
	}

	return claims, nil
}
