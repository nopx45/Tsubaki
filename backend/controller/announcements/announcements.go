package announcetment

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/webapp/config"
	"github.com/webapp/entity"
)

type announceUpload struct {
	CreatedAt time.Time `json:"created_at"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	FileID    uint      `json:"file_id"`
}

func AnnounceUpload(c *gin.Context) {
	var payload announceUpload

	// Bind JSON payload to the struct
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()
	announcement := entity.Announcement{
		Title:     payload.Title,
		Content:   payload.Content,
		FileID:    payload.FileID,
		CreatedAt: payload.CreatedAt,
	}

	// Save the announcement to the database
	if err := db.Create(&announcement).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Upload Announcement successful"})
}

func GetAll(c *gin.Context) {

	var announces []entity.Announcement

	db := config.DB()
	results := db.Preload("File").Find(&announces)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	for i := range announces {
		announces[i].CreatedAt = announces[i].CreatedAt.Local()
	}
	c.JSON(http.StatusOK, announces)

}

func Get(c *gin.Context) {

	ID := c.Param("id")
	var announces entity.Announcement

	db := config.DB()
	results := db.Preload("File").First(&announces, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if announces.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	announces.CreatedAt = announces.CreatedAt.Local()
	c.JSON(http.StatusOK, announces)

}

func Update(c *gin.Context) {

	var announces entity.Announcement

	AnnouncementID := c.Param("id")

	db := config.DB()
	result := db.First(&announces, AnnouncementID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&announces); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&announces)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

func Delete(c *gin.Context) {

	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM announcements WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}
