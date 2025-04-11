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
	Images []string `json:"images"`
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

	form, err := c.MultipartForm()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบข้อมูลไฟล์"})
		return
	}

	files := form.File["images"]
	if len(files) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "กรุณาเลือกไฟล์อย่างน้อย 1 ไฟล์"})
		return
	}

	// ✅ อ่าน popup.json เดิมเพื่อรวมรูปเก่า
	var oldImages []string
	oldData, err := os.ReadFile("popup.json")
	if err == nil {
		var old PopupImage
		if json.Unmarshal(oldData, &old) == nil {
			oldImages = old.Images
		}
	}

	// ✅ อัปโหลดไฟล์ใหม่ทั้งหมด
	var newPaths []string
	for _, file := range files {
		filename := "popup_" + time.Now().Format("20060102150405") + "_" + file.Filename
		savePath := filepath.Join("uploads/images/popup", filename)

		if err := c.SaveUploadedFile(file, savePath); err != nil {
			continue
		}

		newPaths = append(newPaths, "/uploads/images/popup/"+filename)
	}

	// ✅ รวมรูปทั้งหมด (ของเก่า + ใหม่)
	allImages := append(oldImages, newPaths...)

	// ✅ เขียน popup.json ใหม่
	popup := PopupImage{Images: allImages}
	data, _ := json.MarshalIndent(popup, "", "  ")
	_ = os.WriteFile("popup.json", data, 0644)

	c.JSON(http.StatusOK, gin.H{
		"message": "อัปโหลดสำเร็จ",
		"paths":   newPaths,
	})
}

func DeletePopupImage(c *gin.Context) {
	role := c.GetString("role")
	if role != "admin" && role != "adminit" && role != "adminhr" {
		c.JSON(http.StatusForbidden, gin.H{"error": "ไม่มีสิทธิ์ลบรูป"})
		return
	}

	var req struct {
		Image string `json:"image"` // เช่น "/uploads/images/popup/popup_xxx.jpg"
	}
	if err := c.ShouldBindJSON(&req); err != nil || req.Image == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ข้อมูลไม่ถูกต้อง"})
		return
	}

	// อ่าน popup.json เดิม
	data, err := os.ReadFile("popup.json")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถอ่าน popup.json"})
		return
	}

	var popup PopupImage
	if err := json.Unmarshal(data, &popup); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ข้อมูลผิดรูปแบบ"})
		return
	}

	// ลบ path ออกจาก array
	newImages := []string{}
	found := false
	for _, img := range popup.Images {
		if img == req.Image {
			found = true
			// ลบไฟล์จาก disk ด้วย
			_ = os.Remove("." + img) // "./uploads/images/popup/xxx.jpg"
		} else {
			newImages = append(newImages, img)
		}
	}

	if !found {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบรูปภาพในระบบ"})
		return
	}

	// เขียน popup.json ใหม่
	popup.Images = newImages
	newData, _ := json.MarshalIndent(popup, "", "  ")
	_ = os.WriteFile("popup.json", newData, 0644)

	c.JSON(http.StatusOK, gin.H{"message": "ลบรูปสำเร็จ", "image": req.Image})
}

