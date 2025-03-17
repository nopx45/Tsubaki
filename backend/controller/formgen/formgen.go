package formgen

import (
	"net/http"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/webapp/config"
	"github.com/webapp/entity"
)

func UploadForm(c *gin.Context) {
	db := config.DB()
	name := c.PostForm("name")
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to upload file"})
		return
	}

	filepath := "./uploads/form/general/" + file.Filename
	if err := c.SaveUploadedFile(file, filepath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	newForm := entity.Formgen{
		Name:     name,
		Filename: file.Filename,
		Filepath: filepath,
		Filetype: file.Header.Get("Content-Type")}
	db.Create(&newForm)

	c.JSON(http.StatusOK, gin.H{"message": "FormGen uploaded successfully"})
}

func DownloadFile(c *gin.Context) {
	db := config.DB()
	id := c.Param("id")
	var file entity.Formgen
	if err := db.First(&file, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "File not found"})
		return
	}

	c.File(file.Filepath) // ส่งไฟล์กลับไปให้ผู้ใช้ดาวน์โหลด
}

func GetAll(c *gin.Context) {
	var forms []entity.Formgen
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
	var forms entity.Formgen
	db := config.DB()
	results := db.First(&forms, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	if forms.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, forms)
}

func Update(c *gin.Context) {
	FormID := c.Param("id")
	db := config.DB()

	var form entity.Formgen
	if err := db.First(&form, FormID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ID not found"})
		return
	}
	name := c.PostForm("name")

	file, err := c.FormFile("file")
	if err == nil {
		newFilePath := filepath.Join("./uploads/form/general/", file.Filename)
		if err := c.SaveUploadedFile(file, newFilePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
			return
		}
		form.Filename = file.Filename
		form.Filepath = newFilePath
		form.Filetype = file.Header.Get("Content-Type")
	}
	if name != "" {
		form.Name = name
	}
	if err := db.Save(&form).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update record"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Updated successfully"})
}
func Delete(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM formgens WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}
