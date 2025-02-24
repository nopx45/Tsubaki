package article

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/webapp/config"
	"github.com/webapp/entity"
)

type artiCle struct {
	Title   string `json:"title"`
	Content string `json:"content"`
	Image   string `gorm:"type:longtext"`
}

func Upload(c *gin.Context) {
	var payload artiCle

	// Bind JSON payload to the struct
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()
	article := entity.Article{
		Title:   payload.Title,
		Content: payload.Content,
		Image:   payload.Image,
	}

	// Save the article to the database
	if err := db.Create(&article).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Upload Article successful"})
}

func GetAll(c *gin.Context) {

	var article []entity.Article

	db := config.DB()
	results := db.Find(&article)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, article)

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
	c.JSON(http.StatusOK, article)

}

func Update(c *gin.Context) {

	var article entity.Article

	ArticleID := c.Param("id")

	db := config.DB()
	result := db.First(&article, ArticleID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&article); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&article)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

func Delete(c *gin.Context) {

	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM articles WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}
