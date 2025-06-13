package knowledge

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
	roleaccess := c.PostForm("roleaccess")
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

		uploadResp, err := cld.Upload.Upload(c, f, uploader.UploadParams{})
		if err != nil {
			return ""
		}
		return uploadResp.SecureURL
	}

	knowledge := entity.Knowledge{
		RoleAccess: roleaccess,
		Title:      title,
		Content:    content,
		Thumbnail:  upload("thumbnail"),
		Image:      upload("image"),
		Video:      upload("video"),
		Gif:        upload("gif"),
		Pdf:        upload("pdf"),
		CreatedAt:  CreatedAt,
	}

	db := config.DB()
	if err := db.Create(&knowledge).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Upload successful", "data": knowledge})
}

func GetAll(c *gin.Context) {
	var knowledge []entity.Knowledge
	db := config.DB()

	results := db.Find(&knowledge)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
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

	c.JSON(http.StatusOK, knowledge)
}

func GetUserAccess(c *gin.Context) {
	var knowledge []entity.Knowledge
	db := config.DB()

	results := db.Where("role_access = ?", "user").Find(&knowledge)
	if results.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
		return
	}

	for i := range knowledge {
		knowledge[i].CreatedAt = knowledge[i].CreatedAt.Local()
	}

	c.JSON(http.StatusOK, knowledge)
}

func GetAdminAccess(c *gin.Context) {
	// ดึง role จาก middleware
	role, exists := c.Get("role")
	if !exists || (role != "admin" && role != "adminit") {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Access denied"})
		return
	}

	var knowledge []entity.Knowledge
	db := config.DB()

	results := db.Find(&knowledge)
	if results.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
		return
	}

	for i := range knowledge {
		// ไม่ต้องแปลง URL หากเป็น Cloudinary
		knowledge[i].CreatedAt = knowledge[i].CreatedAt.Local()
	}

	c.JSON(http.StatusOK, knowledge)
}

func Update(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	var k entity.Knowledge

	if err := db.First(&k, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

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

		uploadResp, err := cld.Upload.Upload(c, f, uploader.UploadParams{})
		if err != nil {
			return ""
		}
		return uploadResp.SecureURL
	}

	title := c.PostForm("title")
	content := c.PostForm("content")
	roleaccess := c.PostForm("roleaccess")

	replace := func(field *string, newVal string) {
		if newVal != "" {
			if *field != "" {
				var count int64
				db.Model(&entity.Knowledge{}).Where("(thumbnail = ? OR image = ? OR video = ? OR gif = ? OR pdf = ?) AND id != ?", *field, *field, *field, *field, *field, k.ID).Count(&count)
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

	replace(&k.Thumbnail, upload("thumbnail"))
	replace(&k.Image, upload("image"))
	replace(&k.Video, upload("video"))
	replace(&k.Gif, upload("gif"))
	replace(&k.Pdf, upload("pdf"))

	k.Title = title
	k.Content = content
	k.RoleAccess = roleaccess

	if err := db.Save(&k).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successfully"})
}

func Delete(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	var k entity.Knowledge

	if err := db.First(&k, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Knowledge not found"})
		return
	}

	cld, err := config.CloudinaryInstance()
	if err == nil {
		removeIfUnused := func(url string) {
			if url == "" {
				return
			}
			var count int64
			db.Model(&entity.Knowledge{}).Where("(thumbnail = ? OR image = ? OR video = ? OR gif = ? OR pdf = ?) AND id != ?", url, url, url, url, url, k.ID).Count(&count)
			if count == 0 {
				publicID := extractPublicIDFromURL(url)
				if publicID != "" {
					cld.Upload.Destroy(c, uploader.DestroyParams{PublicID: publicID})
				}
			}
		}
		removeIfUnused(k.Thumbnail)
		removeIfUnused(k.Image)
		removeIfUnused(k.Video)
		removeIfUnused(k.Gif)
		removeIfUnused(k.Pdf)
	}

	if tx := db.Unscoped().Delete(&k); tx.Error != nil || tx.RowsAffected == 0 {
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
