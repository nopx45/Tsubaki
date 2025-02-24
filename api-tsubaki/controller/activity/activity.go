package activity

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/webapp/config"
	"github.com/webapp/entity"
)

type activiTy struct {
	Title   string `json:"title"`
	Content string `json:"content"`
	Image   string `gorm:"type:longtext"`
}

func Upload(c *gin.Context) {
	var payload activiTy

	// Bind JSON payload to the struct
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()
	activity := entity.Activity{
		Title:   payload.Title,
		Content: payload.Content,
		Image:   payload.Image,
	}

	// Save the announcement to the database
	if err := db.Create(&activity).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Upload Activity successful"})
}

func GetAll(c *gin.Context) {

	var activity []entity.Activity

	db := config.DB()
	results := db.Find(&activity)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, activity)

}

func GetID(c *gin.Context) {

	ID := c.Param("id")
	var activity entity.Activity

	db := config.DB()
	results := db.First(&activity, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if activity.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, activity)

}

func Update(c *gin.Context) {

	var activity entity.Activity

	ActivityID := c.Param("id")

	db := config.DB()
	result := db.First(&activity, ActivityID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&activity); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&activity)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

func Delete(c *gin.Context) {

	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM activities WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}
