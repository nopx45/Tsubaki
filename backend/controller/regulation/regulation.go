package regulation

import (
	"net/http"
	"strings"

	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gin-gonic/gin"
	"github.com/webapp/config"
	"github.com/webapp/entity"
)

func UploadRegulation(c *gin.Context) {
	db := config.DB()
	name := c.PostForm("name")

	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to upload file"})
		return
	}

	// เปิดไฟล์สำหรับอัปโหลด
	f, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open file"})
		return
	}
	defer f.Close()

	// เรียก Cloudinary
	cld, err := config.CloudinaryInstance()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cloudinary init failed"})
		return
	}

	// อัปโหลดไฟล์ไปยัง Cloudinary (folder: regulation)
	uploadResp, err := cld.Upload.Upload(c, f, uploader.UploadParams{
		Folder: "regulation",
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload to Cloudinary"})
		return
	}

	// บันทึกลงฐานข้อมูล
	newForm := entity.Regulation{
		Name:     name,
		Filename: file.Filename,
		Filepath: uploadResp.SecureURL, // URL ของไฟล์ที่อัปโหลด
		Filetype: file.Header.Get("Content-Type"),
	}

	if err := db.Create(&newForm).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Regulation created successfully", "file": newForm})
}

func DownloadFile(c *gin.Context) {
	db := config.DB()
	id := c.Param("id")

	var file entity.Regulation
	if err := db.First(&file, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "File not found"})
		return
	}

	if file.Filepath == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "File path is empty"})
		return
	}

	// ส่ง redirect ไปยังลิงก์ของ Cloudinary
	c.Redirect(http.StatusFound, file.Filepath)
}

func GetAll(c *gin.Context) {
	var forms []entity.Regulation
	db := config.DB()
	results := db.Find(&forms)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, forms)
}

func GetID(c *gin.Context) {
	ID := c.Param("id")
	var reg entity.Regulation
	db := config.DB()
	results := db.First(&reg, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	if reg.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, reg)
}

func Update(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	var regulation entity.Regulation
	if err := db.First(&regulation, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ID not found"})
		return
	}

	name := c.PostForm("name")
	if name != "" {
		regulation.Name = name
	}

	file, err := c.FormFile("file")
	if err == nil {
		src, err := file.Open()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open file"})
			return
		}
		defer src.Close()

		cld, err := config.CloudinaryInstance()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Cloudinary init failed"})
			return
		}

		uploadResp, err := cld.Upload.Upload(c, src, uploader.UploadParams{
			Folder: "regulation",
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload to Cloudinary"})
			return
		}

		// ลบไฟล์เก่า ถ้าไม่มี record อื่นใช้
		var count int64
		db.Model(&entity.Regulation{}).
			Where("filepath = ? AND id != ?", regulation.Filepath, regulation.ID).
			Count(&count)
		if count == 0 && regulation.Filepath != "" {
			publicID := extractPublicIDFromURL(regulation.Filepath)
			if publicID != "" {
				_, _ = cld.Upload.Destroy(c, uploader.DestroyParams{PublicID: publicID})
			}
		}

		regulation.Filename = file.Filename
		regulation.Filetype = file.Header.Get("Content-Type")
		regulation.Filepath = uploadResp.SecureURL
	}

	if err := db.Save(&regulation).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update record"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successfully"})
}

func Delete(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	var file entity.Regulation
	if err := db.First(&file, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "file not found"})
		return
	}

	var count int64
	db.Model(&entity.Regulation{}).
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
	publicPath := strings.SplitN(parts[1], ".", 2)[0]
	return publicPath
}
