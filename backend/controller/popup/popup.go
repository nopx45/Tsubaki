package popup

import (
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
)

type PopupImage struct {
	Image string `json:"image"`
}

func GetPopupImage(c *gin.Context) {
	data, err := os.ReadFile("popup.json")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถอ่าน popup image"})
		return
	}

	var popup PopupImage
	if err := json.Unmarshal(data, &popup); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ข้อมูลผิดรูปแบบ"})
		return
	}

	c.JSON(http.StatusOK, popup)
}

func UploadPopupImage(c *gin.Context) {
	role := c.GetString("role")
	if role != "admin" && role != "adminit" && role != "adminhr" {
		c.JSON(http.StatusForbidden, gin.H{"error": "ไม่มีสิทธิ์อัปโหลดรูป"})
		return
	}

	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบไฟล์"})
		return
	}

	// สร้างชื่อไฟล์ใหม่กันซ้ำ
	filename := "popup_" + time.Now().Format("20060102150405") + filepath.Ext(file.Filename)
	savePath := filepath.Join("uploads/images/popup", filename)

	if err := c.SaveUploadedFile(file, savePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "อัปโหลดไม่สำเร็จ"})
		return
	}

	// เขียน path ไว้ใน popup.json
	popup := map[string]string{"image": "/uploads/images/popup/" + filename}
	data, _ := json.MarshalIndent(popup, "", "  ")
	_ = os.WriteFile("popup.json", data, 0644)

	c.JSON(http.StatusOK, gin.H{"message": "อัปโหลดสำเร็จ", "path": "/uploads/images/popup/" + filename})
}
