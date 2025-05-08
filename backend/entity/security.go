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
	Thumbnail string    `json:"thumbnail" binding:"required"`
	Image     string    `gorm:"type:longtext"`
	Video     string    `json:"video"`
	Gif       string    `json:"gif"`
	Pdf       string    `json:"pdf"`
}
