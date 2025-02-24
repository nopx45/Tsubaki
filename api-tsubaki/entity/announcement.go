package entity

import (
	"gorm.io/gorm"
)

type Announcement struct {
	gorm.Model
	Title    string `json:"title"`
	Content  string `json:"content"`
	FileID   uint   `json:"file_id"`
	File     *Files `gorm:"foreignKey: file_id" json:"file"`
}
