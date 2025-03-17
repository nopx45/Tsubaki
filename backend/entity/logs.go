package entity

import (
	"time"
)

type Visit struct {
	Username  string    `json:"username"`
	ID        string    `gorm:"primaryKey" json:"id"`
	UserIP    string    `json:"user_ip"`
	SessionID string    `json:"session_id"`
	StartTime time.Time `json:"start_time"`
	EndTime   time.Time `json:"end_time"`
	Duration  int64     `json:"duration"`
}
