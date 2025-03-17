package entity

import (
	"gorm.io/gorm"
)

type Formgen struct {
	gorm.Model
	Name     string `json:"name"`
	Filename string `json:"file_name"`
	Filepath string `json:"file_path"`
	Filetype string `json:"file_type"`
}
