package knowledge

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

	uploadDir := "uploads/images/knowledge/"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.Mkdir(uploadDir, os.ModePerm)
	}

	filePath := filepath.Join(uploadDir, file.Filename)

	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save file"})
		return
	}

	db := config.DB()
	knowledge := entity.Knowledge{
		Title:     title,
		Content:   content,
		Image:     filePath,
		CreatedAt: CreatedAt,
	}

	if err := db.Create(&knowledge).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Upload successful",
		"image":   filePath,
	})
}

func GetAll(c *gin.Context) {
	var knowledge []entity.Knowledge
	db := config.DB()

	results := db.Find(&knowledge)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	baseURL := c.Request.Host
	for i := range knowledge {
		knowledge[i].Image = "http://" + baseURL + "/" + knowledge[i].Image
	}

	for i := range knowledge {
		knowledge[i].CreatedAt = knowledge[i].CreatedAt.Local()
	}

	c.JSON(http.StatusOK, knowledge)
}

func GetID(c *gin.Context) {
	ID := c.Param("id")
	var knowledge entity.Knowledge
	db := config.DB()

	results := db.First(&knowledge, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	if knowledge.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}

	knowledge.CreatedAt = knowledge.CreatedAt.Local()
	baseURL := c.Request.Host
	knowledge.Image = "http://" + baseURL + "/" + knowledge.Image

	c.JSON(http.StatusOK, knowledge)
}

func Update(c *gin.Context) {
	KnowledgeID := c.Param("id")
	db := config.DB()
	var knowledge entity.Knowledge

	if err := db.First(&knowledge, KnowledgeID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	title := c.PostForm("title")
	content := c.PostForm("content")
	file, err := c.FormFile("image")

	if err == nil {
		if knowledge.Image != "" {
			os.Remove(knowledge.Image)
		}

		uploadDir := "uploads/images/knowledge"
		filePath := filepath.Join(uploadDir, file.Filename)
		if err := c.SaveUploadedFile(file, filePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save file"})
			return
		}
		knowledge.Image = filePath
	}

	knowledge.Title = title
	knowledge.Content = content

	if err := db.Save(&knowledge).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successfully"})
}

func Delete(c *gin.Context) {

	id := c.Param("id")
	db := config.DB()

	var img entity.Knowledge
	if err := db.First(&img, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Knowledge not found"})
		return
	}
	var count int64
	db.Model(&entity.Knowledge{}).
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
	if tx := db.Exec("DELETE FROM knowledges WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}
