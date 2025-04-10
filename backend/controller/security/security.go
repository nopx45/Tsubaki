package security

import (
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/webapp/config"
	"github.com/webapp/entity"
)

func Upload(c *gin.Context) {
	title := c.PostForm("title")
	content := c.PostForm("content")
	CreatedAt := time.Now()
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file upload"})
		return
	}

	uploadDir := "uploads/images/security/"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.Mkdir(uploadDir, os.ModePerm)
	}

	filePath := filepath.Join(uploadDir, file.Filename)

	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save file"})
		return
	}

	db := config.DB()
	secure := entity.Security{
		Title:     title,
		Content:   content,
		Image:     filePath,
		CreatedAt: CreatedAt,
	}

	if err := db.Create(&secure).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Upload successful",
		"image":   filePath,
	})
}

func GetAll(c *gin.Context) {
	var secure []entity.Security
	db := config.DB()

	results := db.Find(&secure)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	baseURL := c.Request.Host
	for i := range secure {
		secure[i].Image = "http://" + baseURL + "/" + secure[i].Image
	}

	for i := range secure {
		secure[i].CreatedAt = secure[i].CreatedAt.Local()
	}

	c.JSON(http.StatusOK, secure)
}

func GetID(c *gin.Context) {
	ID := c.Param("id")
	var secure entity.Security
	db := config.DB()

	results := db.First(&secure, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	if secure.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}

	secure.CreatedAt = secure.CreatedAt.Local()
	baseURL := c.Request.Host
	secure.Image = "http://" + baseURL + "/" + secure.Image

	c.JSON(http.StatusOK, secure)
}

func Update(c *gin.Context) {
	secureID := c.Param("id")
	db := config.DB()
	var secure entity.Security

	if err := db.First(&secure, secureID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	title := c.PostForm("title")
	content := c.PostForm("content")
	file, err := c.FormFile("image")

	if err == nil {
		if secure.Image != "" {
			os.Remove(secure.Image)
		}

		uploadDir := "uploads/images/security"
		filePath := filepath.Join(uploadDir, file.Filename)
		if err := c.SaveUploadedFile(file, filePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save file"})
			return
		}
		secure.Image = filePath
	}

	secure.Title = title
	secure.Content = content

	if err := db.Save(&secure).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successfully"})
}

func Delete(c *gin.Context) {

	id := c.Param("id")
	db := config.DB()

	var img entity.Security
	if err := db.First(&img, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Security not found"})
		return
	}
	var count int64
	db.Model(&entity.Security{}).
		Where("image = ? AND id != ?", img.Image, id).
		Count(&count)
	if count == 0 {
		// ไม่มีเรคคอร์ดอื่นใช้ไฟล์นี้ => ปลอดภัยที่จะลบ
		if err := os.Remove(img.Image); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete image from disk"})
			return
		}
	}
	// ลบเรคคอร์ดในฐานข้อมูล
	if tx := db.Exec("DELETE FROM securities WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}
