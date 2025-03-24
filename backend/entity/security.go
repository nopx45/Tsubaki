package entity

import (
	"time"

	"gorm.io/gorm"
)

type Security struct {
	gorm.Model
	CreatedAt time.Time `json:"created_at"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	Image     string    `gorm:"type:longtext"`
}
