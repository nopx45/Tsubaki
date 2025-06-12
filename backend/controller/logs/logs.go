package logs

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/webapp/config"
	"github.com/webapp/entity"
)

func RecordVisit(c *gin.Context) {
	db := config.DB()
	sessionID := c.GetString("session_id")
	username := c.GetString("username")
	userIP := c.ClientIP()
	visit := entity.Visit{
		Username:  username,
		ID:        uuid.New().String(),
		UserIP:    userIP,
		SessionID: sessionID,
		StartTime: time.Now(),
	}

	db.Create(&visit)
	c.JSON(http.StatusOK, gin.H{"message": "Visit recorded", "session_id": sessionID})
}

// อัปเดตเวลาที่ออกจากเว็บไซต์
func RecordExit(c *gin.Context) {
	db := config.DB()
	sessionID := c.GetString("session_id")

	//ถ้าไม่มี session_id ให้ตอบ OK แล้วไม่ทำอะไร
	if sessionID == "" {
		c.JSON(http.StatusOK, gin.H{"message": "No session ID, skip recording"})
		return
	}

	var visit entity.Visit
	result := db.Where("session_id = ?", sessionID).Order("start_time DESC").First(&visit)
	if result.Error != nil {
		c.JSON(http.StatusOK, gin.H{"message": "No visit found for session, skip recording"})
		return
	}

	visit.EndTime = time.Now()
	visit.Duration = int64(visit.EndTime.Sub(visit.StartTime).Seconds())
	db.Save(&visit)

	c.JSON(http.StatusOK, gin.H{"message": "Exit recorded", "duration": visit.Duration})
}

func GetTotalVisitors(c *gin.Context) {
	db := config.DB()
	var count int64
	db.Model(&entity.Visit{}).Count(&count)
	c.JSON(http.StatusOK, count)
}

func GetAllVisitors(c *gin.Context) {

	var visitors []entity.Visit

	db := config.DB()
	results := db.Find(&visitors)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, visitors)

}

// 10 อันดับผู้ที่ใช้มากที่สุด
func GetTopUsernames(c *gin.Context) {
	db := config.DB()
	var results []struct {
		Username string
		Count    int64
	}

	monthStr := c.Query("month")
	yearStr := c.Query("year")

	month, err1 := strconv.Atoi(monthStr)
	year, err2 := strconv.Atoi(yearStr)

	if err1 != nil || err2 != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid month or year"})
		return
	}

	db.Model(&entity.Visit{}).
		Select("username, COUNT(username) as count").
		Where("strftime('%m', start_time) = ? AND strftime('%Y', start_time) = ?", fmt.Sprintf("%02d", month), strconv.Itoa(year)).
		Group("username").
		Order("count DESC").
		Limit(5).
		Scan(&results)

	c.JSON(http.StatusOK, results)
}

// ดูระยะเวลาเฉลี่ยของผู้เข้าชม
func GetAvgDuration(c *gin.Context) {
	db := config.DB()
	var totalDuration int64
	var count int64
	db.Model(&entity.Visit{}).Select("SUM(duration)").Scan(&totalDuration)
	db.Model(&entity.Visit{}).Count(&count)

	avgDuration := 0.0
	if count > 0 {
		avgDuration = float64(totalDuration) / float64(count)
	}

	c.JSON(http.StatusOK, gin.H{"avg_duration": avgDuration})
}

func Delete(c *gin.Context) {
	db := config.DB()
	id := c.Param("id")

	// ตรวจสอบว่า ID เป็น UUID หรือไม่
	_, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	// ค้นหา Record ก่อนลบ
	var visit entity.Visit
	if err := db.Where("id = ?", id).First(&visit).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ID not found"})
		return
	}

	// ลบข้อมูล
	if err := db.Delete(&visit).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}
