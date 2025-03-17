package entity

import (
	"gorm.io/gorm"
)

type Link struct {
	gorm.Model
	Name    string `json:"name"`
	LinkUrl string `json:"link_url"`
}
