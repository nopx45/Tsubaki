package training

import (
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/webapp/config"
	"github.com/webapp/entity"
)

func Upload(c *gin.Context) {
	title := c.PostForm("title")
	content := c.PostForm("content")

	dirs := map[string]string{
		"thumbnail": "uploads/images/training/thumbnails/",
		"image":     "uploads/images/training/",
		"video":     "uploads/videos/training/",
		"gif":       "uploads/gifs/training/",
		"pdf":       "uploads/pdfs/training/",
	}

	for _, dir := range dirs {
		os.MkdirAll(dir, os.ModePerm)
	}

	var paths = make(map[string]string)
	for key, dir := range dirs {
		if file, err := c.FormFile(key); err == nil {
			path := filepath.Join(dir, file.Filename)
			if err := c.SaveUploadedFile(file, path); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save " + key})
				return
			}
			paths[key] = path
		}
	}

	db := config.DB()
	training := entity.Training{
		Title:     title,
		Content:   content,
		Thumbnail: paths["thumbnail"],
		Image:     paths["image"],
		Video:     paths["video"],
		Gif:       paths["gif"],
		Pdf:       paths["pdf"],
	}

	if err := db.Create(&training).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Upload successful", "data": training})
}

func GetAll(c *gin.Context) {
	db := config.DB()
	var trainings []entity.Training

	if err := db.Find(&trainings).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	baseURL := c.Request.Host
	for i := range trainings {
		if trainings[i].Thumbnail != "" {
			trainings[i].Thumbnail = "http://" + baseURL + "/" + trainings[i].Thumbnail
		}
		if trainings[i].Image != "" {
			trainings[i].Image = "http://" + baseURL + "/" + trainings[i].Image
		}
		if trainings[i].Video != "" {
			trainings[i].Video = "http://" + baseURL + "/" + trainings[i].Video
		}
		if trainings[i].Gif != "" {
			trainings[i].Gif = "http://" + baseURL + "/" + trainings[i].Gif
		}
		if trainings[i].Pdf != "" {
			trainings[i].Pdf = "http://" + baseURL + "/" + trainings[i].Pdf
		}
		trainings[i].CreatedAt = trainings[i].CreatedAt.Local()
	}

	c.JSON(http.StatusOK, trainings)
}

func GetID(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	var training entity.Training

	if err := db.First(&training, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	baseURL := c.Request.Host
	if training.Thumbnail != "" {
		training.Thumbnail = "http://" + baseURL + "/" + training.Thumbnail
	}
	if training.Image != "" {
		training.Image = "http://" + baseURL + "/" + training.Image
	}
	if training.Video != "" {
		training.Video = "http://" + baseURL + "/" + training.Video
	}
	if training.Gif != "" {
		training.Gif = "http://" + baseURL + "/" + training.Gif
	}
	if training.Pdf != "" {
		training.Pdf = "http://" + baseURL + "/" + training.Pdf
	}
	training.CreatedAt = training.CreatedAt.Local()

	c.JSON(http.StatusOK, training)
}

func Update(c *gin.Context) {
	TrainingID := c.Param("id")
	db := config.DB()
	var training entity.Training

	if err := db.First(&training, TrainingID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	title := c.PostForm("title")
	content := c.PostForm("content")

	// ======== CHECK REMOVE THUMBNAIL =========
	if c.PostForm("removeThumbnail") == "true" {
		if training.Thumbnail != "" {
			var count int64
			db.Model(&entity.Training{}).Where("thumbnail = ?", training.Thumbnail).Count(&count)
			if count <= 1 {
				os.Remove(training.Thumbnail)
			}
			training.Thumbnail = ""
		}
	}

	// ======== CHECK REMOVE IMAGE =========
	if c.PostForm("removeImage") == "true" {
		if training.Image != "" {
			var count int64
			db.Model(&entity.Training{}).Where("image = ?", training.Image).Count(&count)
			if count <= 1 {
				os.Remove(training.Image)
			}
			training.Image = ""
		}
	}

	// ======== CHECK REMOVE VIDEO =========
	if c.PostForm("removeVideo") == "true" {
		if training.Video != "" {
			var count int64
			db.Model(&entity.Training{}).Where("video = ?", training.Video).Count(&count)
			if count <= 1 {
				os.Remove(training.Video)
			}
			training.Video = ""
		}
	}

	// ======== CHECK REMOVE GIF =========
	if c.PostForm("removeGif") == "true" {
		if training.Gif != "" {
			var count int64
			db.Model(&entity.Training{}).Where("gif = ?", training.Gif).Count(&count)
			if count <= 1 {
				os.Remove(training.Gif)
			}
			training.Gif = ""
		}
	}

	// ======== CHECK REMOVE PDF =========
	if c.PostForm("removePdf") == "true" {
		if training.Pdf != "" {
			var count int64
			db.Model(&entity.Training{}).Where("pdf = ?", training.Pdf).Count(&count)
			if count <= 1 {
				os.Remove(training.Pdf)
			}
			training.Pdf = ""
		}
	}

	// ======== UPLOAD NEW THUMBNAIL =========
	if file, err := c.FormFile("thumbnail"); err == nil {
		if training.Thumbnail != "" {
			var count int64
			db.Model(&entity.Training{}).Where("thumbnail = ?", training.Thumbnail).Count(&count)
			if count <= 1 {
				os.Remove(training.Thumbnail)
			}
		}
		thumbPath := filepath.Join("uploads/images/training/thumbnails/", file.Filename)
		if err := c.SaveUploadedFile(file, thumbPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save thumbnail"})
			return
		}
		training.Thumbnail = thumbPath
	}

	// ======== UPLOAD NEW IMAGE =========
	if file, err := c.FormFile("image"); err == nil {
		if training.Image != "" {
			var count int64
			db.Model(&entity.Training{}).Where("image = ?", training.Image).Count(&count)
			if count <= 1 {
				os.Remove(training.Image)
			}
		}
		imagePath := filepath.Join("uploads/images/training/", file.Filename)
		if err := c.SaveUploadedFile(file, imagePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save image"})
			return
		}
		training.Image = imagePath
	}

	// ======== UPLOAD NEW VIDEO =========
	if file, err := c.FormFile("video"); err == nil {
		if training.Video != "" {
			var count int64
			db.Model(&entity.Training{}).Where("video = ?", training.Video).Count(&count)
			if count <= 1 {
				os.Remove(training.Video)
			}
		}
		videoPath := filepath.Join("uploads/videos/training/", file.Filename)
		if err := c.SaveUploadedFile(file, videoPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save video"})
			return
		}
		training.Video = videoPath
	}

	// ======== UPLOAD NEW GIF =========
	if file, err := c.FormFile("gif"); err == nil {
		if training.Gif != "" {
			var count int64
			db.Model(&entity.Training{}).Where("gif = ?", training.Gif).Count(&count)
			if count <= 1 {
				os.Remove(training.Gif)
			}
		}
		gifPath := filepath.Join("uploads/gifs/training/", file.Filename)
		if err := c.SaveUploadedFile(file, gifPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save gif"})
			return
		}
		training.Gif = gifPath
	}

	// ======== UPLOAD NEW PDF =========
	if file, err := c.FormFile("pdf"); err == nil {
		if training.Pdf != "" {
			var count int64
			db.Model(&entity.Training{}).Where("pdf = ?", training.Pdf).Count(&count)
			if count <= 1 {
				os.Remove(training.Pdf)
			}
		}
		pdfPath := filepath.Join("uploads/pdfs/training/", file.Filename)
		if err := c.SaveUploadedFile(file, pdfPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save pdf"})
			return
		}
		training.Pdf = pdfPath
	}

	// ======== UPDATE TITLE, CONTENT =========
	training.Title = title
	training.Content = content

	if err := db.Save(&training).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successfully"})
}

func Delete(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	var training entity.Training

	if err := db.First(&training, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Training not found"})
		return
	}

	fields := []string{"Thumbnail", "Image", "Video", "Gif", "Pdf"}
	for _, field := range fields {
		val := trainingFieldValue(&training, field)
		if val != "" {
			var count int64
			db.Model(&entity.Training{}).Where(field+" = ? AND id != ?", val, id).Count(&count)
			if count == 0 {
				os.Remove(val)
			}
		}
	}

	if tx := db.Delete(&training); tx.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Delete failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}

func trainingFieldValue(t *entity.Training, field string) string {
	switch field {
	case "Thumbnail":
		return t.Thumbnail
	case "Image":
		return t.Image
	case "Video":
		return t.Video
	case "Gif":
		return t.Gif
	case "Pdf":
		return t.Pdf
	default:
		return ""
	}
}
