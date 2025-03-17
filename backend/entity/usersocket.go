package entity

type UserSocket struct {
	ID       uint   `gorm:"primaryKey" json:"id"`
	Username string `gorm:"unique" json:"username"`
	Role     string `json:"role"`
	SocketID string `json:"socketId"`
}
