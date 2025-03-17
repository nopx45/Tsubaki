package entity

import (
	"gorm.io/gorm"
)

type Section struct {
	gorm.Model
	Name     string `json:"name"`
	Namelink string `json:"name_link"`
	LinkUrl  string `json:"link_url"`
}
