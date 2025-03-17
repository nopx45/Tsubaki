package section

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/webapp/config"
	"github.com/webapp/entity"
)

type secTion struct {
	Name     string `json:"name"`
	Namelink string `json:"name_link"`
	LinkUrl  string `json:"link_url"`
}

func Upload(c *gin.Context) {
	var payload secTion

	// Bind JSON payload to the struct
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()
	section := entity.Section{
		Name:     payload.Name,
		Namelink: payload.Namelink,
		LinkUrl:  payload.LinkUrl,
	}

	// Save the section to the database
	if err := db.Create(&section).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Upload Section successful"})
}

func GetAll(c *gin.Context) {

	var section []entity.Section

	db := config.DB()
	results := db.Find(&section)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, section)

}

func GetID(c *gin.Context) {

	ID := c.Param("id")
	var section entity.Section

	db := config.DB()
	results := db.First(&section, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if section.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, section)

}

func Update(c *gin.Context) {

	var section entity.Section

	SectionID := c.Param("id")

	db := config.DB()
	result := db.First(&section, SectionID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&section); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&section)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

func Delete(c *gin.Context) {

	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM sections WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}
