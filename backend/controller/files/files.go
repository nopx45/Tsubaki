package files

import (
	"net/http"
	"strings"

	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gin-gonic/gin"
	"github.com/webapp/config"
	"github.com/webapp/entity"
)

func UploadFile(c *gin.Context) {
	db := config.DB()

	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to upload file"})
		return
	}

	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to open file"})
		return
	}
	defer src.Close()

	cld, err := config.CloudinaryInstance()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cloudinary init failed"})
		return
	}

	uploadResp, err := cld.Upload.Upload(c, src, uploader.UploadParams{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload to Cloudinary"})
		return
	}

	newFile := entity.Files{
		Filename: file.Filename,
		Filepath: uploadResp.SecureURL,
		Filetype: file.Header.Get("Content-Type"),
	}

	if err := db.Create(&newFile).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "File uploaded successfully", "file": newFile})
}

func DownloadFile(c *gin.Context) {
	db := config.DB()
	id := c.Param("id")
	var file entity.Files

	if err := db.First(&file, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "File not found"})
		return
	}

	// ส่ง redirect ให้โหลดจาก Cloudinary โดยตรง
	c.Redirect(http.StatusFound, file.Filepath)
}

func GetAll(c *gin.Context) {
	var files []entity.Files
	db := config.DB()
	results := db.Find(&files)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, files)
}

func GetID(c *gin.Context) {
	ID := c.Param("id")
	var file entity.Files
	db := config.DB()
	results := db.First(&file, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	if file.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, file)
}

func Update(c *gin.Context) {
	var file entity.Files
	FileID := c.Param("id")
	db := config.DB()

	result := db.First(&file, FileID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&file); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&file)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Update failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successfully"})
}

func Delete(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	var file entity.Files
	if err := db.First(&file, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "file not found"})
		return
	}

	var count int64
	db.Model(&entity.Files{}).
		Where("filepath = ? AND id != ?", file.Filepath, id).
		Count(&count)

	if count == 0 && file.Filepath != "" {
		publicID := extractPublicIDFromURL(file.Filepath)
		if publicID != "" {
			cld, err := config.CloudinaryInstance()
			if err == nil {
				_, _ = cld.Upload.Destroy(c, uploader.DestroyParams{PublicID: publicID})
			}
		}
	}

	if tx := db.Unscoped().Delete(&file); tx.Error != nil || tx.RowsAffected == 0 {
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
	publicPath = strings.SplitN(publicPath, ".", 2)[0]
	return publicPath
}
