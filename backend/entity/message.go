package entity

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Message struct {
	gorm.Model
	From    string `json:"from"`
	Role    string `json:"role"`
	Content string `json:"content"`
}

func (m Message) JSON(k int, h gin.H) {
	panic("unimplemented")
}
