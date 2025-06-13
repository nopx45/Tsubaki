package training

import (
	"net/http"
	"strings"

	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gin-gonic/gin"
	"github.com/webapp/config"
	"github.com/webapp/entity"
)

func Upload(c *gin.Context) {
	title := c.PostForm("title")
	content := c.PostForm("content")
	db := config.DB()

	cld, err := config.CloudinaryInstance()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cloudinary init failed"})
		return
	}

	uploaded := make(map[string]string)
	upload := func(field string) string {
		file, err := c.FormFile(field)
		if err != nil {
			return ""
		}
		f, err := file.Open()
		if err != nil {
			return ""
		}
		defer f.Close()

		uploadResp, err := cld.Upload.Upload(c, f, uploader.UploadParams{Folder: "training"})
		if err != nil {
			return ""
		}
		return uploadResp.SecureURL
	}

	uploaded["thumbnail"] = upload("thumbnail")
	uploaded["image"] = upload("image")
	uploaded["video"] = upload("video")
	uploaded["gif"] = upload("gif")
	uploaded["pdf"] = upload("pdf")

	training := entity.Training{
		Title:     title,
		Content:   content,
		Thumbnail: uploaded["thumbnail"],
		Image:     uploaded["image"],
		Video:     uploaded["video"],
		Gif:       uploaded["gif"],
		Pdf:       uploaded["pdf"],
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

	for i := range trainings {
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

	cld, err := config.CloudinaryInstance()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cloudinary init failed"})
		return
	}

	upload := func(field string) string {
		file, err := c.FormFile(field)
		if err != nil {
			return ""
		}
		f, err := file.Open()
		if err != nil {
			return ""
		}
		defer f.Close()

		uploadResp, err := cld.Upload.Upload(c, f, uploader.UploadParams{Folder: "training"})
		if err != nil {
			return ""
		}
		return uploadResp.SecureURL
	}

	replace := func(field *string, newVal string) {
		if newVal != "" {
			if *field != "" {
				var count int64
				db.Model(&entity.Training{}).
					Where("(thumbnail = ? OR image = ? OR video = ? OR gif = ? OR pdf = ?) AND id != ?", *field, *field, *field, *field, *field, training.ID).
					Count(&count)
				if count == 0 {
					publicID := extractPublicIDFromURL(*field)
					if publicID != "" {
						cld.Upload.Destroy(c, uploader.DestroyParams{PublicID: publicID})
					}
				}
			}
			*field = newVal
		}
	}

	// ตรวจลบ
	if c.PostForm("removeThumbnail") == "true" {
		replace(&training.Thumbnail, "")
	}
	if c.PostForm("removeImage") == "true" {
		replace(&training.Image, "")
	}
	if c.PostForm("removeVideo") == "true" {
		replace(&training.Video, "")
	}
	if c.PostForm("removeGif") == "true" {
		replace(&training.Gif, "")
	}
	if c.PostForm("removePdf") == "true" {
		replace(&training.Pdf, "")
	}

	// อัปโหลดใหม่ถ้ามี
	replace(&training.Thumbnail, upload("thumbnail"))
	replace(&training.Image, upload("image"))
	replace(&training.Video, upload("video"))
	replace(&training.Gif, upload("gif"))
	replace(&training.Pdf, upload("pdf"))

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

	cld, err := config.CloudinaryInstance()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cloudinary init failed"})
		return
	}

	removeIfUnused := func(field string) {
		if field == "" {
			return
		}
		var count int64
		db.Model(&entity.Training{}).
			Where("(thumbnail = ? OR image = ? OR video = ? OR gif = ? OR pdf = ?) AND id != ?", field, field, field, field, field, training.ID).
			Count(&count)
		if count == 0 {
			publicID := extractPublicIDFromURL(field)
			if publicID != "" {
				cld.Upload.Destroy(c, uploader.DestroyParams{PublicID: publicID})
			}
		}
	}

	removeIfUnused(training.Thumbnail)
	removeIfUnused(training.Image)
	removeIfUnused(training.Video)
	removeIfUnused(training.Gif)
	removeIfUnused(training.Pdf)

	if tx := db.Unscoped().Delete(&training); tx.Error != nil || tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Delete failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}

func extractPublicIDFromURL(url string) string {
	parts := strings.Split(url, "/upload/")
	if len(parts) < 2 {
		return ""
	}
	publicPath := strings.SplitN(parts[1], ".", 2)[0]
	return publicPath
}
