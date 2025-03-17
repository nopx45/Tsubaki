package entity

import (
	"time"

	"gorm.io/gorm"
)

type VisitPageLog struct {
	gorm.Model
	Username string    `json:"username"`
	PageName string    `json:"page_name"`
	PagePath string    `json:"page_path"`
	CrateAt  time.Time `json:"create_at"`
}
