package logvisitpage

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/webapp/config"
	"github.com/webapp/entity"
)

func RecordlogVisit(c *gin.Context) {
	db := config.DB()
	var requestBody struct {
		PagePath string `json:"pagePath"`
	}

	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	if requestBody.PagePath == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "pagePath is required"})
		return
	}

	// แยกพาธเพื่อดึง PageName
	parts := strings.Split(requestBody.PagePath, "/")
	page := ""
	if len(parts) > 1 {
		page = parts[1]
	}

	// ✅ เฉพาะ PageName ที่อยู่ในลิสต์นี้เท่านั้นที่สามารถบันทึกได้
	validPages := []string{"activity", "announcement", "it-knowledge", "article", "security", "regulation", "training", "calendar"}
	isValid := false
	for _, validPage := range validPages {
		if page == validPage {
			isValid = true
			break
		}
	}

	if !isValid {
		return
	}

	username := c.GetString("username")
	logvisitpage := entity.VisitPageLog{
		Username: username,
		PageName: page,
		PagePath: requestBody.PagePath,
		CrateAt:  time.Now(),
	}

	db.Create(&logvisitpage)
	c.JSON(http.StatusOK, gin.H{"message": "logvisitpage saved"})
}

func GetAllPageVisitors(c *gin.Context) {

	var pagevisitors []entity.VisitPageLog

	db := config.DB()
	results := db.Find(&pagevisitors)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, pagevisitors)

}

func GetTopPages(c *gin.Context) {
	db := config.DB()
	var results []struct {
		PageName string `json:"page_name"`
		Count    int64  `json:"count"`
	}
	monthStr := c.Query("month")
	yearStr := c.Query("year")

	month, err1 := strconv.Atoi(monthStr)
	year, err2 := strconv.Atoi(yearStr)

	if err1 != nil || err2 != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid month or year"})
		return

	}
	db.Model(&entity.VisitPageLog{}).
		Select("page_name AS PageName, COUNT(page_name) AS Count").
		Where("strftime('%m', created_at) = ? AND strftime('%Y', created_at) = ?", fmt.Sprintf("%02d", month), strconv.Itoa(year)).
		Group("page_name").
		Order("Count DESC").
		Scan(&results)

	c.JSON(http.StatusOK, results)
}

func Delete(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM visit_page_logs WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}
