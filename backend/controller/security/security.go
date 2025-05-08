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

	// Upload Directory
	thumbDir := "uploads/images/security/thumbnails/"
	imageDir := "uploads/images/security/"
	videoDir := "uploads/videos/security/"
	gifDir := "uploads/gifs/security/"
	pdfDir := "uploads/pdfs/security/"

	// Create dir if not exist
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
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save thumbnail"})
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

	db := config.DB()
	secure := entity.Security{
		Title:     title,
		Content:   content,
		Thumbnail: thumbPath,
		Image:     imagePath,
		Video:     videoPath,
		Gif:       gifPath,
		Pdf:       pdfPath,
		CreatedAt: CreatedAt,
	}

	if err := db.Create(&secure).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Upload successful",
		"data":    secure,
	})
}

func Update(c *gin.Context) {
	securityID := c.Param("id")
	db := config.DB()
	var security entity.Security

	if err := db.First(&security, securityID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	title := c.PostForm("title")
	content := c.PostForm("content")

	// ======== CHECK REMOVE THUMBNAIL =========
	if c.PostForm("removeThumbnail") == "true" {
		if security.Thumbnail != "" {
			var count int64
			db.Model(&entity.Security{}).Where("thumbnail = ?", security.Thumbnail).Count(&count)
			if count <= 1 {
				os.Remove(security.Thumbnail)
			}
			security.Thumbnail = ""
		}
	}

	// ======== CHECK REMOVE IMAGE =========
	if c.PostForm("removeImage") == "true" {
		if security.Image != "" {
			var count int64
			db.Model(&entity.Security{}).Where("image = ?", security.Image).Count(&count)
			if count <= 1 {
				os.Remove(security.Image)
			}
			security.Image = ""
		}
	}

	// ======== CHECK REMOVE VIDEO =========
	if c.PostForm("removeVideo") == "true" {
		if security.Video != "" {
			var count int64
			db.Model(&entity.Security{}).Where("video = ?", security.Video).Count(&count)
			if count <= 1 {
				os.Remove(security.Video)
			}
			security.Video = ""
		}
	}

	// ======== CHECK REMOVE GIF =========
	if c.PostForm("removeGif") == "true" {
		if security.Gif != "" {
			var count int64
			db.Model(&entity.Security{}).Where("gif = ?", security.Gif).Count(&count)
			if count <= 1 {
				os.Remove(security.Gif)
			}
			security.Gif = ""
		}
	}

	// ======== CHECK REMOVE PDF =========
	if c.PostForm("removePdf") == "true" {
		if security.Pdf != "" {
			var count int64
			db.Model(&entity.Security{}).Where("pdf = ?", security.Pdf).Count(&count)
			if count <= 1 {
				os.Remove(security.Pdf)
			}
			security.Pdf = ""
		}
	}

	// ======== UPLOAD NEW THUMBNAIL =========
	if file, err := c.FormFile("thumbnail"); err == nil {
		if security.Thumbnail != "" {
			var count int64
			db.Model(&entity.Security{}).Where("thumbnail = ?", security.Thumbnail).Count(&count)
			if count <= 1 {
				os.Remove(security.Thumbnail)
			}
		}
		thumbPath := filepath.Join("uploads/images/security/thumbnails/", file.Filename)
		if err := c.SaveUploadedFile(file, thumbPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save thumbnail"})
			return
		}
		security.Thumbnail = thumbPath
	}

	// ======== UPLOAD NEW IMAGE =========
	if file, err := c.FormFile("image"); err == nil {
		if security.Image != "" {
			var count int64
			db.Model(&entity.Security{}).Where("image = ?", security.Image).Count(&count)
			if count <= 1 {
				os.Remove(security.Image)
			}
		}
		imagePath := filepath.Join("uploads/images/security/", file.Filename)
		if err := c.SaveUploadedFile(file, imagePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save image"})
			return
		}
		security.Image = imagePath
	}

	// ======== UPLOAD NEW VIDEO =========
	if file, err := c.FormFile("video"); err == nil {
		if security.Video != "" {
			var count int64
			db.Model(&entity.Security{}).Where("video = ?", security.Video).Count(&count)
			if count <= 1 {
				os.Remove(security.Video)
			}
		}
		videoPath := filepath.Join("uploads/videos/security/", file.Filename)
		if err := c.SaveUploadedFile(file, videoPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save video"})
			return
		}
		security.Video = videoPath
	}

	// ======== UPLOAD NEW GIF =========
	if file, err := c.FormFile("gif"); err == nil {
		if security.Gif != "" {
			var count int64
			db.Model(&entity.Security{}).Where("gif = ?", security.Gif).Count(&count)
			if count <= 1 {
				os.Remove(security.Gif)
			}
		}
		gifPath := filepath.Join("uploads/gifs/security/", file.Filename)
		if err := c.SaveUploadedFile(file, gifPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save gif"})
			return
		}
		security.Gif = gifPath
	}

	// ======== UPLOAD NEW PDF =========
	if file, err := c.FormFile("pdf"); err == nil {
		if security.Pdf != "" {
			var count int64
			db.Model(&entity.Security{}).Where("pdf = ?", security.Pdf).Count(&count)
			if count <= 1 {
				os.Remove(security.Pdf)
			}
		}
		pdfPath := filepath.Join("uploads/pdfs/security/", file.Filename)
		if err := c.SaveUploadedFile(file, pdfPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save pdf"})
			return
		}
		security.Pdf = pdfPath
	}

	// ======== UPDATE TITLE, CONTENT =========
	security.Title = title
	security.Content = content

	if err := db.Save(&security).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successfully"})
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
		if secure[i].Thumbnail != "" {
			secure[i].Thumbnail = "http://" + baseURL + "/" + secure[i].Thumbnail
		}
		if secure[i].Image != "" {
			secure[i].Image = "http://" + baseURL + "/" + secure[i].Image
		}
		if secure[i].Video != "" {
			secure[i].Video = "http://" + baseURL + "/" + secure[i].Video
		}
		if secure[i].Gif != "" {
			secure[i].Gif = "http://" + baseURL + "/" + secure[i].Gif
		}
		if secure[i].Pdf != "" {
			secure[i].Pdf = "http://" + baseURL + "/" + secure[i].Pdf
		}
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

	baseURL := c.Request.Host
	if secure.Thumbnail != "" {
		secure.Thumbnail = "http://" + baseURL + "/" + secure.Thumbnail
	}
	if secure.Image != "" {
		secure.Image = "http://" + baseURL + "/" + secure.Image
	}
	if secure.Video != "" {
		secure.Video = "http://" + baseURL + "/" + secure.Video
	}
	if secure.Gif != "" {
		secure.Gif = "http://" + baseURL + "/" + secure.Gif
	}
	if secure.Pdf != "" {
		secure.Pdf = "http://" + baseURL + "/" + secure.Pdf
	}

	secure.CreatedAt = secure.CreatedAt.Local()

	c.JSON(http.StatusOK, secure)
}

func Delete(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	var sec entity.Security
	if err := db.First(&sec, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Security not found"})
		return
	}

	// delete each file if no other records use them
	var count int64
	db.Model(&entity.Security{}).Where("thumbnail = ? AND id != ?", sec.Thumbnail, id).Count(&count)
	if count == 0 && sec.Thumbnail != "" {
		os.Remove(sec.Thumbnail)
	}
	db.Model(&entity.Security{}).Where("image = ? AND id != ?", sec.Image, id).Count(&count)
	if count == 0 && sec.Image != "" {
		os.Remove(sec.Image)
	}
	db.Model(&entity.Security{}).Where("video = ? AND id != ?", sec.Video, id).Count(&count)
	if count == 0 && sec.Video != "" {
		os.Remove(sec.Video)
	}
	db.Model(&entity.Security{}).Where("gif = ? AND id != ?", sec.Gif, id).Count(&count)
	if count == 0 && sec.Gif != "" {
		os.Remove(sec.Gif)
	}
	db.Model(&entity.Security{}).Where("pdf = ? AND id != ?", sec.Pdf, id).Count(&count)
	if count == 0 && sec.Pdf != "" {
		os.Remove(sec.Pdf)
	}

	if tx := db.Exec("DELETE FROM securities WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}
