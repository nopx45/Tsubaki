package entity

import (
	"gorm.io/gorm"
)

type Activity struct {
	gorm.Model
	Title   string `json:"title"`
	Content string `json:"content"`
	Image   string `gorm:"type:longtext"`
}
