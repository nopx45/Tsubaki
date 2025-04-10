package entity

import (
	"time"

	"gorm.io/gorm"
)

type Event struct {
	gorm.Model
	Title       string
	Start       time.Time
	End         time.Time
	Description string
	Location    string
	Type        string // เช่น "holiday", "meeting", etc.
}
