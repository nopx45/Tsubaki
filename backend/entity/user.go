package entity

import (
	"gorm.io/gorm"
)

type Users struct {
	gorm.Model
	FirstName           string `json:"first_name"`
	LastName            string `json:"last_name"`
	Username            string `json:"username" valid:"maxstringlength(20)~ชื่อผู้ใช้ความยาวต้องไม่เกิน 20 อักษร"`
	Email               string `json:"email"`
	Phone               string `json:"phone"`
	Password            string `json:"-" valid:"minstringlength(8)~รหัสผ่านต้องมากกว่า 8 อักษร"`
	Role                string `json:"role"`
	ForcePasswordChange bool   `json:"force_password_change" gorm:"default:false"`
	Locked              bool   `json:"locked" gorm:"default:false"`
}
