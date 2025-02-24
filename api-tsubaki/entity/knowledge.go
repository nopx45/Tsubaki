package entity

import (
	"gorm.io/gorm"
)

type Knowledge struct {
	gorm.Model
	Title   string `json:"title"`
	Content string `json:"content"`
	Image   string `gorm:"type:longtext"`
}
