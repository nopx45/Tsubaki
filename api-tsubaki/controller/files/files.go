package files

import (
	"net/http"

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

	filepath := "./uploads/" + file.Filename
	if err := c.SaveUploadedFile(file, filepath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	// บันทึกข้อมูลไฟล์ในฐานข้อมูล
	newFile := entity.Files{Filename: file.Filename, Filepath: filepath, Filetype: file.Header.Get("Content-Type")}
	db.Create(&newFile)

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

    c.File(file.Filepath)  // ส่งไฟล์กลับไปให้ผู้ใช้ดาวน์โหลด
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
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

func Delete(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM files WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}
