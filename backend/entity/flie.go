package entity

import (
	"gorm.io/gorm"
)

type Files struct {
	gorm.Model
	Filename string `json:"file_name"`
	Filepath string `json:"file_path"`
	Filetype string `json:"file_type"`
}
