package activity

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
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid image upload"})
		return
	}

	uploadDir := "uploads/images/activity/"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.Mkdir(uploadDir, os.ModePerm)
	}

	filePath := filepath.Join(uploadDir, file.Filename)

	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save file"})
		return
	}

	db := config.DB()
	activities := entity.Activity{
		Title:     title,
		Content:   content,
		Image:     filePath,
		CreatedAt: CreatedAt,
	}

	if err := db.Create(&activities).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Upload successful",
		"image":   filePath,
	})
}

func GetAll(c *gin.Context) {
	var activity []entity.Activity
	db := config.DB()

	results := db.Find(&activity)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	baseURL := c.Request.Host
	for i := range activity {
		activity[i].Image = "http://" + baseURL + "/" + activity[i].Image
	}

	for i := range activity {
		activity[i].CreatedAt = activity[i].CreatedAt.Local()
	}

	c.JSON(http.StatusOK, activity)
}

func GetID(c *gin.Context) {
	ID := c.Param("id")
	var activity entity.Activity
	db := config.DB()

	results := db.First(&activity, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	if activity.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}

	activity.CreatedAt = activity.CreatedAt.Local()
	baseURL := c.Request.Host
	activity.Image = "http://" + baseURL + "/" + activity.Image

	c.JSON(http.StatusOK, activity)
}

func Update(c *gin.Context) {
	ActivityID := c.Param("id")
	db := config.DB()
	var activity entity.Activity

	if err := db.First(&activity, ActivityID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	title := c.PostForm("title")
	content := c.PostForm("content")
	file, err := c.FormFile("image")

	if err == nil {
		if activity.Image != "" {
			os.Remove(activity.Image)
		}

		uploadDir := "uploads/images/activity"
		filePath := filepath.Join(uploadDir, file.Filename)
		if err := c.SaveUploadedFile(file, filePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save file"})
			return
		}
		activity.Image = filePath
	}

	activity.Title = title
	activity.Content = content

	if err := db.Save(&activity).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successfully"})
}

func Delete(c *gin.Context) {

	id := c.Param("id")
	db := config.DB()

	var img entity.Activity
	if err := db.First(&img, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "file not found"})
		return
	}
	var count int64
	db.Model(&entity.Activity{}).
		Where("image = ? AND id != ?", img.Image, id).
		Count(&count)
	if count == 0 {
		// ไม่มีเรคคอร์ดอื่นใช้ไฟล์นี้ => ปลอดภัยที่จะลบ
		if err := os.Remove(img.Image); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete Image from disk"})
			return
		}
	}
	// ลบเรคคอร์ดในฐานข้อมูล
	if tx := db.Exec("DELETE FROM activities WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}
