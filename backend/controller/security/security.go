package security

import (
	"net/http"
	"strings"
	"time"

	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gin-gonic/gin"
	"github.com/webapp/config"
	"github.com/webapp/entity"
)

func Upload(c *gin.Context) {
	title := c.PostForm("title")
	content := c.PostForm("content")
	CreatedAt := time.Now()

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

		resp, err := cld.Upload.Upload(c, f, uploader.UploadParams{
			Folder: "security",
		})
		if err != nil {
			return ""
		}
		return resp.SecureURL
	}

	thumbURL := upload("thumbnail")
	imageURL := upload("image")
	videoURL := upload("video")
	gifURL := upload("gif")
	pdfURL := upload("pdf")

	db := config.DB()
	secure := entity.Security{
		Title:     title,
		Content:   content,
		Thumbnail: thumbURL,
		Image:     imageURL,
		Video:     videoURL,
		Gif:       gifURL,
		Pdf:       pdfURL,
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

		uploadResp, err := cld.Upload.Upload(c, f, uploader.UploadParams{Folder: "security"})
		if err != nil {
			return ""
		}
		return uploadResp.SecureURL
	}

	replace := func(field *string, newVal string) {
		if newVal != "" {
			if *field != "" {
				var count int64
				db.Model(&entity.Security{}).Where("(thumbnail = ? OR image = ? OR video = ? OR gif = ? OR pdf = ?) AND id != ?", *field, *field, *field, *field, *field, security.ID).Count(&count)
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
		replace(&security.Thumbnail, "")
	}
	if c.PostForm("removeImage") == "true" {
		replace(&security.Image, "")
	}
	if c.PostForm("removeVideo") == "true" {
		replace(&security.Video, "")
	}
	if c.PostForm("removeGif") == "true" {
		replace(&security.Gif, "")
	}
	if c.PostForm("removePdf") == "true" {
		replace(&security.Pdf, "")
	}

	// อัปโหลดใหม่ถ้ามี
	replace(&security.Thumbnail, upload("thumbnail"))
	replace(&security.Image, upload("image"))
	replace(&security.Video, upload("video"))
	replace(&security.Gif, upload("gif"))
	replace(&security.Pdf, upload("pdf"))

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
		db.Model(&entity.Security{}).Where("(thumbnail = ? OR image = ? OR video = ? OR gif = ? OR pdf = ?) AND id != ?", field, field, field, field, field, sec.ID).Count(&count)
		if count == 0 {
			publicID := extractPublicIDFromURL(field)
			if publicID != "" {
				cld.Upload.Destroy(c, uploader.DestroyParams{PublicID: publicID})
			}
		}
	}

	removeIfUnused(sec.Thumbnail)
	removeIfUnused(sec.Image)
	removeIfUnused(sec.Video)
	removeIfUnused(sec.Gif)
	removeIfUnused(sec.Pdf)

	if tx := db.Unscoped().Delete(&sec); tx.Error != nil || tx.RowsAffected == 0 {
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
