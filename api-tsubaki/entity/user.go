package entity

import (
	"gorm.io/gorm"
)

type Users struct {
	gorm.Model
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Username  string `json:"username"`
	Email     string `json:"email"`
	Phone     string `json:"phone"`
	Password  string `json:"-"`
	Role      string `json:"role"`
}
