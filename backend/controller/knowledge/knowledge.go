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

	// Upload Directory
	thumbDir := "uploads/images/knowledge/thumbnails/"
	imageDir := "uploads/images/knowledge/"
	videoDir := "uploads/videos/knowledge/"
	gifDir := "uploads/gifs/knowledge/"
	pdfDir := "uploads/pdfs/knowledge/"

	// สร้าง dir ถ้าไม่มี
	os.MkdirAll(thumbDir, os.ModePerm)
	os.MkdirAll(imageDir, os.ModePerm)
	os.MkdirAll(videoDir, os.ModePerm)
	os.MkdirAll(gifDir, os.ModePerm)
	os.MkdirAll(pdfDir, os.ModePerm)

	var thumbPath, imagePath, videoPath, gifPath, pdfPath string

	// Thumbnail
	if file, err := c.FormFile("thumbnail"); err == nil {
		thumbPath = filepath.Join(thumbDir, file.Filename)
		if err := c.SaveUploadedFile(file, thumbPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save Thumbnail"})
			return
		}
	}

	// Image
	if file, err := c.FormFile("image"); err == nil {
		imagePath = filepath.Join(imageDir, file.Filename)
		if err := c.SaveUploadedFile(file, imagePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save image"})
			return
		}
	}

	// Video
	if file, err := c.FormFile("video"); err == nil {
		videoPath = filepath.Join(videoDir, file.Filename)
		if err := c.SaveUploadedFile(file, videoPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save video"})
			return
		}
	}

	// GIF
	if file, err := c.FormFile("gif"); err == nil {
		gifPath = filepath.Join(gifDir, file.Filename)
		if err := c.SaveUploadedFile(file, gifPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save gif"})
			return
		}
	}

	// PDF
	if file, err := c.FormFile("pdf"); err == nil {
		pdfPath = filepath.Join(pdfDir, file.Filename)
		if err := c.SaveUploadedFile(file, pdfPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save pdf"})
			return
		}
	}

	// Save DB
	db := config.DB()
	knowledge := entity.Knowledge{
		Title:     title,
		Content:   content,
		Thumbnail: thumbPath,
		Image:     imagePath,
		Video:     videoPath,
		Gif:       gifPath,
		Pdf:       pdfPath,
		CreatedAt: CreatedAt,
	}

	if err := db.Create(&knowledge).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Upload successful",
		"data":    knowledge,
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
		if knowledge[i].Thumbnail != "" {
			knowledge[i].Thumbnail = "http://" + baseURL + "/" + knowledge[i].Thumbnail
		}
		if knowledge[i].Image != "" {
			knowledge[i].Image = "http://" + baseURL + "/" + knowledge[i].Image
		}
		if knowledge[i].Video != "" {
			knowledge[i].Video = "http://" + baseURL + "/" + knowledge[i].Video
		}
		if knowledge[i].Gif != "" {
			knowledge[i].Gif = "http://" + baseURL + "/" + knowledge[i].Gif
		}
		if knowledge[i].Pdf != "" {
			knowledge[i].Pdf = "http://" + baseURL + "/" + knowledge[i].Pdf
		}
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

	baseURL := c.Request.Host
	if knowledge.Thumbnail != "" {
		knowledge.Thumbnail = "http://" + baseURL + "/" + knowledge.Thumbnail
	}
	if knowledge.Image != "" {
		knowledge.Image = "http://" + baseURL + "/" + knowledge.Image
	}
	if knowledge.Video != "" {
		knowledge.Video = "http://" + baseURL + "/" + knowledge.Video
	}
	if knowledge.Gif != "" {
		knowledge.Gif = "http://" + baseURL + "/" + knowledge.Gif
	}
	if knowledge.Pdf != "" {
		knowledge.Pdf = "http://" + baseURL + "/" + knowledge.Pdf
	}

	knowledge.CreatedAt = knowledge.CreatedAt.Local()

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

	// ======== CHECK REMOVE THUMBNAIL =========
	if c.PostForm("removeThumbnail") == "true" {
		if knowledge.Thumbnail != "" {
			var count int64
			db.Model(&entity.Knowledge{}).Where("thumbnail = ?", knowledge.Thumbnail).Count(&count)
			if count <= 1 {
				os.Remove(knowledge.Thumbnail)
			}
			knowledge.Thumbnail = ""
		}
	}

	// ======== CHECK REMOVE IMAGE =========
	if c.PostForm("removeImage") == "true" {
		if knowledge.Image != "" {
			var count int64
			db.Model(&entity.Knowledge{}).Where("image = ?", knowledge.Image).Count(&count)
			if count <= 1 {
				os.Remove(knowledge.Image)
			}
			knowledge.Image = ""
		}
	}

	// ======== CHECK REMOVE VIDEO =========
	if c.PostForm("removeVideo") == "true" {
		if knowledge.Video != "" {
			var count int64
			db.Model(&entity.Knowledge{}).Where("video = ?", knowledge.Video).Count(&count)
			if count <= 1 {
				os.Remove(knowledge.Video)
			}
			knowledge.Video = ""
		}
	}

	// ======== CHECK REMOVE GIF =========
	if c.PostForm("removeGif") == "true" {
		if knowledge.Gif != "" {
			var count int64
			db.Model(&entity.Knowledge{}).Where("gif = ?", knowledge.Gif).Count(&count)
			if count <= 1 {
				os.Remove(knowledge.Gif)
			}
			knowledge.Gif = ""
		}
	}

	// ======== CHECK REMOVE PDF =========
	if c.PostForm("removePdf") == "true" {
		if knowledge.Pdf != "" {
			var count int64
			db.Model(&entity.Knowledge{}).Where("pdf = ?", knowledge.Pdf).Count(&count)
			if count <= 1 {
				os.Remove(knowledge.Pdf)
			}
			knowledge.Pdf = ""
		}
	}

	// ======== UPLOAD NEW THUMBNAIL =========
	if file, err := c.FormFile("thumbnail"); err == nil {
		if knowledge.Thumbnail != "" {
			var count int64
			db.Model(&entity.Knowledge{}).Where("thumbnail = ?", knowledge.Thumbnail).Count(&count)
			if count <= 1 {
				os.Remove(knowledge.Thumbnail)
			}
		}
		thumbPath := filepath.Join("uploads/images/knowledge/thumbnails/", file.Filename)
		if err := c.SaveUploadedFile(file, thumbPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save thumbnail"})
			return
		}
		knowledge.Thumbnail = thumbPath
	}

	// ======== UPLOAD NEW IMAGE =========
	if file, err := c.FormFile("image"); err == nil {
		if knowledge.Image != "" {
			var count int64
			db.Model(&entity.Knowledge{}).Where("image = ?", knowledge.Image).Count(&count)
			if count <= 1 {
				os.Remove(knowledge.Image)
			}
		}
		imagePath := filepath.Join("uploads/images/knowledge/", file.Filename)
		if err := c.SaveUploadedFile(file, imagePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save image"})
			return
		}
		knowledge.Image = imagePath
	}

	// ======== UPLOAD NEW VIDEO =========
	if file, err := c.FormFile("video"); err == nil {
		if knowledge.Video != "" {
			var count int64
			db.Model(&entity.Knowledge{}).Where("video = ?", knowledge.Video).Count(&count)
			if count <= 1 {
				os.Remove(knowledge.Video)
			}
		}
		videoPath := filepath.Join("uploads/videos/knowledge/", file.Filename)
		if err := c.SaveUploadedFile(file, videoPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save video"})
			return
		}
		knowledge.Video = videoPath
	}

	// ======== UPLOAD NEW GIF =========
	if file, err := c.FormFile("gif"); err == nil {
		if knowledge.Gif != "" {
			var count int64
			db.Model(&entity.Knowledge{}).Where("gif = ?", knowledge.Gif).Count(&count)
			if count <= 1 {
				os.Remove(knowledge.Gif)
			}
		}
		gifPath := filepath.Join("uploads/gifs/knowledge/", file.Filename)
		if err := c.SaveUploadedFile(file, gifPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save gif"})
			return
		}
		knowledge.Gif = gifPath
	}

	// ======== UPLOAD NEW PDF =========
	if file, err := c.FormFile("pdf"); err == nil {
		if knowledge.Pdf != "" {
			var count int64
			db.Model(&entity.Knowledge{}).Where("pdf = ?", knowledge.Pdf).Count(&count)
			if count <= 1 {
				os.Remove(knowledge.Pdf)
			}
		}
		pdfPath := filepath.Join("uploads/pdfs/knowledge/", file.Filename)
		if err := c.SaveUploadedFile(file, pdfPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save pdf"})
			return
		}
		knowledge.Pdf = pdfPath
	}

	// ======== UPDATE TITLE, CONTENT =========
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
	// THUMBNAIL
	db.Model(&entity.Knowledge{}).Where("thumbnail = ? AND id != ?", img.Thumbnail, id).Count(&count)
	if count == 0 && img.Thumbnail != "" {
		os.Remove(img.Thumbnail)
	}
	// IMAGE
	db.Model(&entity.Knowledge{}).Where("image = ? AND id != ?", img.Image, id).Count(&count)
	if count == 0 && img.Image != "" {
		os.Remove(img.Image)
	}
	// VIDEO
	db.Model(&entity.Knowledge{}).Where("video = ? AND id != ?", img.Video, id).Count(&count)
	if count == 0 && img.Video != "" {
		os.Remove(img.Video)
	}
	// GIF
	db.Model(&entity.Knowledge{}).Where("gif = ? AND id != ?", img.Gif, id).Count(&count)
	if count == 0 && img.Gif != "" {
		os.Remove(img.Gif)
	}
	// PDF
	db.Model(&entity.Knowledge{}).Where("pdf = ? AND id != ?", img.Pdf, id).Count(&count)
	if count == 0 && img.Pdf != "" {
		os.Remove(img.Pdf)
	}
	// ลบเรคคอร์ดในฐานข้อมูล
	if tx := db.Exec("DELETE FROM knowledges WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}
