package article

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

	uploadDir := "uploads/images/article/"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.Mkdir(uploadDir, os.ModePerm)
	}

	filePath := filepath.Join(uploadDir, file.Filename)

	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save file"})
		return
	}

	db := config.DB()
	articles := entity.Article{
		Title:     title,
		Content:   content,
		Image:     filePath,
		CreatedAt: CreatedAt,
	}

	if err := db.Create(&articles).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Upload successful",
		"image":   filePath,
	})
}

func GetAll(c *gin.Context) {
	var articles []entity.Article
	db := config.DB()

	results := db.Find(&articles)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	baseURL := c.Request.Host
	for i := range articles {
		articles[i].Image = "http://" + baseURL + "/" + articles[i].Image
	}

	for i := range articles {
		articles[i].CreatedAt = articles[i].CreatedAt.Local()
	}

	c.JSON(http.StatusOK, articles)
}

func GetID(c *gin.Context) {
	ID := c.Param("id")
	var article entity.Article
	db := config.DB()

	results := db.First(&article, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	if article.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}

	article.CreatedAt = article.CreatedAt.Local()
	baseURL := c.Request.Host
	article.Image = "http://" + baseURL + "/" + article.Image

	c.JSON(http.StatusOK, article)
}

func Update(c *gin.Context) {
	ArticleID := c.Param("id")
	db := config.DB()
	var article entity.Article

	if err := db.First(&article, ArticleID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	title := c.PostForm("title")
	content := c.PostForm("content")
	file, err := c.FormFile("image")

	if err == nil {
		if article.Image != "" {
			os.Remove(article.Image)
		}

		uploadDir := "uploads/images/article"
		filePath := filepath.Join(uploadDir, file.Filename)
		if err := c.SaveUploadedFile(file, filePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save file"})
			return
		}
		article.Image = filePath
	}

	article.Title = title
	article.Content = content

	if err := db.Save(&article).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successfully"})
}

func Delete(c *gin.Context) {

	id := c.Param("id")
	db := config.DB()

	var img entity.Article
	if err := db.First(&img, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "image not found"})
		return
	}
	var count int64
	db.Model(&entity.Article{}).
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
	if tx := db.Exec("DELETE FROM articles WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}
