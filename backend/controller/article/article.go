package article

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

	uploadFile := func(field string) string {
		file, err := c.FormFile(field)
		if err != nil {
			return ""
		}
		f, err := file.Open()
		if err != nil {
			return ""
		}
		defer f.Close()

		resp, err := cld.Upload.Upload(c, f, uploader.UploadParams{})
		if err != nil {
			return ""
		}
		return resp.SecureURL
	}

	// Upload แต่ละไฟล์ไปยัง Cloudinary
	thumbURL := uploadFile("thumbnail")
	imageURL := uploadFile("image")
	videoURL := uploadFile("video")
	gifURL := uploadFile("gif")
	pdfURL := uploadFile("pdf")

	db := config.DB()
	article := entity.Article{
		Title:     title,
		Content:   content,
		Thumbnail: thumbURL,
		Image:     imageURL,
		Video:     videoURL,
		Gif:       gifURL,
		Pdf:       pdfURL,
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
	var articles []entity.Article
	db := config.DB()

	results := db.Find(&articles)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
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

	cld, err := config.CloudinaryInstance()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cloudinary init failed"})
		return
	}

	// helper
	uploadFile := func(field string) string {
		file, err := c.FormFile(field)
		if err != nil {
			return ""
		}
		f, err := file.Open()
		if err != nil {
			return ""
		}
		defer f.Close()

		resp, err := cld.Upload.Upload(c, f, uploader.UploadParams{})
		if err != nil {
			return ""
		}
		return resp.SecureURL
	}

	// ===== Remove old if requested =====
	removeField := func(field string, value *string) {
		if c.PostForm(field) == "true" && *value != "" {
			var count int64
			db.Model(&entity.Article{}).Where(field+" = ?", *value).Where("id != ?", article.ID).Count(&count)
			if count == 0 {
				publicID := extractPublicIDFromURL(*value)
				if publicID != "" {
					_, _ = cld.Upload.Destroy(c, uploader.DestroyParams{PublicID: publicID})
				}
			}
			*value = ""
		}
	}

	removeField("removeThumbnail", &article.Thumbnail)
	removeField("removeImage", &article.Image)
	removeField("removeVideo", &article.Video)
	removeField("removeGif", &article.Gif)
	removeField("removePdf", &article.Pdf)

	// ===== Upload new if exists =====
	newThumb := uploadFile("thumbnail")
	if newThumb != "" {
		removeField("Thumbnail", &article.Thumbnail)
		article.Thumbnail = newThumb
	}
	newImage := uploadFile("image")
	if newImage != "" {
		removeField("Image", &article.Image)
		article.Image = newImage
	}
	newVideo := uploadFile("video")
	if newVideo != "" {
		removeField("Video", &article.Video)
		article.Video = newVideo
	}
	newGif := uploadFile("gif")
	if newGif != "" {
		removeField("Gif", &article.Gif)
		article.Gif = newGif
	}
	newPdf := uploadFile("pdf")
	if newPdf != "" {
		removeField("Pdf", &article.Pdf)
		article.Pdf = newPdf
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

	var article entity.Article
	if err := db.First(&article, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
		return
	}

	cld, err := config.CloudinaryInstance()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cloudinary init failed"})
		return
	}

	// ลบไฟล์จาก Cloudinary ถ้าไม่มีการอ้างอิงที่อื่น
	removeIfNotUsed := func(fieldVal string) {
		if fieldVal == "" {
			return
		}
		var count int64
		db.Model(&entity.Article{}).Where("id != ? AND (thumbnail = ? OR image = ? OR video = ? OR gif = ? OR pdf = ?)", article.ID, fieldVal, fieldVal, fieldVal, fieldVal, fieldVal).Count(&count)
		if count == 0 {
			publicID := extractPublicIDFromURL(fieldVal)
			if publicID != "" {
				_, _ = cld.Upload.Destroy(c, uploader.DestroyParams{PublicID: publicID})
			}
		}
	}

	removeIfNotUsed(article.Thumbnail)
	removeIfNotUsed(article.Image)
	removeIfNotUsed(article.Video)
	removeIfNotUsed(article.Gif)
	removeIfNotUsed(article.Pdf)

	if tx := db.Unscoped().Delete(&article); tx.Error != nil || tx.RowsAffected == 0 {
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
	publicPath := parts[1]
	publicPath = strings.SplitN(publicPath, ".", 2)[0] // remove extension
	return publicPath
}
