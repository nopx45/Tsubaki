package entity

import (
	"time"

	"gorm.io/gorm"
)

type Announcement struct {
	gorm.Model
	CreatedAt time.Time `json:"created_at"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	FileID    uint      `json:"file_id"`
	File      *Files    `gorm:"foreignKey: file_id" json:"file"`
}
