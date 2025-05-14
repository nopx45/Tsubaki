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

	// Upload Directory
	thumbDir := "uploads/images/article/thumbnails/"
	imageDir := "uploads/images/article/"
	videoDir := "uploads/videos/article/"
	gifDir := "uploads/gifs/article/"
	pdfDir := "uploads/pdfs/article/"

	// Create directory if not exists
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
	article := entity.Article{
		Title:     title,
		Content:   content,
		Image:     imagePath,
		Thumbnail: thumbPath,
		Video:     videoPath,
		Gif:       gifPath,
		Pdf:       pdfPath,
		CreatedAt: CreatedAt,
	}

	if err := db.Create(&article).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Upload successful",
		"data":    article,
	})
}

func GetAll(c *gin.Context) {
	var article []entity.Article
	db := config.DB()

	results := db.Find(&article)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	baseURL := c.Request.Host
	for i := range article {
		if article[i].Thumbnail != "" {
			article[i].Thumbnail = "http://" + baseURL + "/" + article[i].Thumbnail
		}
		if article[i].Image != "" {
			article[i].Image = "http://" + baseURL + "/" + article[i].Image
		}
		if article[i].Video != "" {
			article[i].Video = "http://" + baseURL + "/" + article[i].Video
		}
		if article[i].Gif != "" {
			article[i].Gif = "http://" + baseURL + "/" + article[i].Gif
		}
		if article[i].Pdf != "" {
			article[i].Pdf = "http://" + baseURL + "/" + article[i].Pdf
		}
		article[i].CreatedAt = article[i].CreatedAt.Local()
	}

	c.JSON(http.StatusOK, article)
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

	baseURL := c.Request.Host
	if article.Thumbnail != "" {
		article.Thumbnail = "http://" + baseURL + "/" + article.Thumbnail
	}
	if article.Image != "" {
		article.Image = "http://" + baseURL + "/" + article.Image
	}
	if article.Video != "" {
		article.Video = "http://" + baseURL + "/" + article.Video
	}
	if article.Gif != "" {
		article.Gif = "http://" + baseURL + "/" + article.Gif
	}
	if article.Pdf != "" {
		article.Pdf = "http://" + baseURL + "/" + article.Pdf
	}

	article.CreatedAt = article.CreatedAt.Local()

	c.JSON(http.StatusOK, article)
}

func Update(c *gin.Context) {
	articleID := c.Param("id")
	db := config.DB()
	var article entity.Article

	if err := db.First(&article, articleID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	title := c.PostForm("title")
	content := c.PostForm("content")

	// Directories
	thumbDir := "uploads/images/article/thumbnails"
	imageDir := "uploads/images/article/"
	videoDir := "uploads/videos/article/"
	gifDir := "uploads/gifs/article/"
	pdfDir := "uploads/pdfs/article/"

	// ======== CHECK REMOVE THUMBNAIL =========
	if c.PostForm("removeThumbnail") == "true" {
		if article.Thumbnail != "" {
			var count int64
			db.Model(&entity.Article{}).Where("thumbnail = ?", article.Thumbnail).Count(&count)
			if count <= 1 {
				os.Remove(article.Thumbnail)
			}
			article.Thumbnail = ""
		}
	}

	// ======== CHECK REMOVE IMAGE =========
	if c.PostForm("removeImage") == "true" {
		if article.Image != "" {
			var count int64
			db.Model(&entity.Article{}).Where("image = ?", article.Image).Count(&count)
			if count <= 1 {
				os.Remove(article.Image)
			}
			article.Image = ""
		}
	}

	// ======== CHECK REMOVE VIDEO =========
	if c.PostForm("removeVideo") == "true" {
		if article.Video != "" {
			var count int64
			db.Model(&entity.Article{}).Where("video = ?", article.Video).Count(&count)
			if count <= 1 {
				os.Remove(article.Video)
			}
			article.Video = ""
		}
	}

	// ======== CHECK REMOVE GIF =========
	if c.PostForm("removeGif") == "true" {
		if article.Gif != "" {
			var count int64
			db.Model(&entity.Article{}).Where("gif = ?", article.Gif).Count(&count)
			if count <= 1 {
				os.Remove(article.Gif)
			}
			article.Gif = ""
		}
	}

	// ======== CHECK REMOVE PDF =========
	if c.PostForm("removePdf") == "true" {
		if article.Pdf != "" {
			var count int64
			db.Model(&entity.Article{}).Where("pdf = ?", article.Pdf).Count(&count)
			if count <= 1 {
				os.Remove(article.Pdf)
			}
			article.Pdf = ""
		}
	}

	// ======== UPLOAD NEW THUMBNAIL =========
	if file, err := c.FormFile("thumbnail"); err == nil {
		if article.Thumbnail != "" {
			var count int64
			db.Model(&entity.Article{}).Where("thumbnail = ?", article.Thumbnail).Count(&count)
			if count <= 1 {
				os.Remove(article.Thumbnail)
			}
		}
		thumbPath := filepath.Join(thumbDir, file.Filename)
		if err := c.SaveUploadedFile(file, thumbPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save thumbnail"})
			return
		}
		article.Thumbnail = thumbPath
	}

	// ======== UPLOAD NEW IMAGE =========
	if file, err := c.FormFile("image"); err == nil {
		if article.Image != "" {
			var count int64
			db.Model(&entity.Article{}).Where("image = ?", article.Image).Count(&count)
			if count <= 1 {
				os.Remove(article.Image)
			}
		}
		imagePath := filepath.Join(imageDir, file.Filename)
		if err := c.SaveUploadedFile(file, imagePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save image"})
			return
		}
		article.Image = imagePath
	}

	// ======== UPLOAD NEW VIDEO =========
	if file, err := c.FormFile("video"); err == nil {
		if article.Video != "" {
			var count int64
			db.Model(&entity.Article{}).Where("video = ?", article.Video).Count(&count)
			if count <= 1 {
				os.Remove(article.Video)
			}
		}
		videoPath := filepath.Join(videoDir, file.Filename)
		if err := c.SaveUploadedFile(file, videoPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save video"})
			return
		}
		article.Video = videoPath
	}

	// ======== UPLOAD NEW GIF =========
	if file, err := c.FormFile("gif"); err == nil {
		if article.Gif != "" {
			var count int64
			db.Model(&entity.Article{}).Where("gif = ?", article.Gif).Count(&count)
			if count <= 1 {
				os.Remove(article.Gif)
			}
		}
		gifPath := filepath.Join(gifDir, file.Filename)
		if err := c.SaveUploadedFile(file, gifPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save gif"})
			return
		}
		article.Gif = gifPath
	}

	// ======== UPLOAD NEW PDF =========
	if file, err := c.FormFile("pdf"); err == nil {
		if article.Pdf != "" {
			var count int64
			db.Model(&entity.Article{}).Where("pdf = ?", article.Pdf).Count(&count)
			if count <= 1 {
				os.Remove(article.Pdf)
			}
		}
		pdfPath := filepath.Join(pdfDir, file.Filename)
		if err := c.SaveUploadedFile(file, pdfPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save pdf"})
			return
		}
		article.Pdf = pdfPath
	}

	// ======== UPDATE TITLE & CONTENT =========
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

	var article entity.Article
	if err := db.First(&article, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
		return
	}

	// delete each file if no other records use them
	var count int64
	db.Model(&entity.Article{}).Where("thumbnail = ? AND id != ?", article.Thumbnail, id).Count(&count)
	if count == 0 && article.Thumbnail != "" {
		os.Remove(article.Thumbnail)
	}
	db.Model(&entity.Article{}).Where("image = ? AND id != ?", article.Image, id).Count(&count)
	if count == 0 && article.Image != "" {
		os.Remove(article.Image)
	}
	db.Model(&entity.Article{}).Where("video = ? AND id != ?", article.Video, id).Count(&count)
	if count == 0 && article.Video != "" {
		os.Remove(article.Video)
	}
	db.Model(&entity.Article{}).Where("gif = ? AND id != ?", article.Gif, id).Count(&count)
	if count == 0 && article.Gif != "" {
		os.Remove(article.Gif)
	}
	db.Model(&entity.Article{}).Where("pdf = ? AND id != ?", article.Pdf, id).Count(&count)
	if count == 0 && article.Pdf != "" {
		os.Remove(article.Pdf)
	}

	if tx := db.Exec("DELETE FROM articles WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}
