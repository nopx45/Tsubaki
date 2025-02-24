package knowledge

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/webapp/config"
	"github.com/webapp/entity"
)

type knowLedge struct {
	Title   string `json:"title"`
	Content string `json:"content"`
	Image   string `gorm:"type:longtext"`
}

func Upload(c *gin.Context) {
	var payload knowLedge

	// Bind JSON payload to the struct
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()
	knowledge := entity.Knowledge{
		Title:   payload.Title,
		Content: payload.Content,
		Image:   payload.Image,
	}

	// Save the Knowledge to the database
	if err := db.Create(&knowledge).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Upload Knowledge successful"})
}

func GetAll(c *gin.Context) {

	var knowledge []entity.Knowledge

	db := config.DB()
	results := db.Find(&knowledge)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
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
	c.JSON(http.StatusOK, knowledge)

}

func Update(c *gin.Context) {

	var knowledge entity.Knowledge

	KnowledgeID := c.Param("id")

	db := config.DB()
	result := db.First(&knowledge, KnowledgeID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&knowledge); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&knowledge)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

func Delete(c *gin.Context) {

	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM knowledges WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}
