package entity

import (
	"gorm.io/gorm"
)

type Training struct {
	gorm.Model
	Title     string `json:"title"`
	Content   string `json:"content"`
	Thumbnail string `json:"thumbnail" binding:"required"`
	Image     string `json:"image"`
	Video     string `json:"video"`
	Gif       string `json:"gif"`
	Pdf       string `json:"pdf"`
}
