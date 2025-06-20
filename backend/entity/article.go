package entity

import (
	"time"

	"gorm.io/gorm"
)

type Article struct {
	gorm.Model
	CreatedAt time.Time `json:"created_at"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	Image     string    `gorm:"type:text"`
	Thumbnail string    `json:"thumbnail"`
	Video     string    `json:"video"`
	Gif       string    `json:"gif"`
	Pdf       string    `json:"pdf"`
}
