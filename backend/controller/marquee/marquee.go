package marquee

import (
	"encoding/json"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

type Marquee struct {
	Message string `json:"message"`
}

func GetMarquee(c *gin.Context) {
	data, err := os.ReadFile("marquee.json")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "อ่านไฟล์ไม่สำเร็จ"})
		return
	}

	var marquee Marquee
	if err := json.Unmarshal(data, &marquee); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไฟล์ JSON ไม่ถูกต้อง"})
		return
	}

	c.JSON(http.StatusOK, marquee)
}

func UpdateMarquee(c *gin.Context) {
	role := c.GetString("role")
	if role != "admin" && role != "adminhr" && role != "adminit" {
		c.JSON(http.StatusForbidden, gin.H{"error": "คุณไม่มีสิทธิ์ในการแก้ไขข้อความ"})
		return
	}

	var newData Marquee
	if err := c.ShouldBindJSON(&newData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ข้อมูลไม่ถูกต้อง"})
		return
	}

	// เขียนลงไฟล์
	data, _ := json.MarshalIndent(newData, "", "  ")
	if err := os.WriteFile("marquee.json", data, 0644); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "บันทึกไฟล์ไม่สำเร็จ"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "อัปเดตข้อความเรียบร้อยแล้ว"})
}
