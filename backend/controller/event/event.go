package event

import (
	"bytes"
	"net/http"
	"os"
	"path/filepath"

	ics "github.com/arran4/golang-ical"
	"github.com/gin-gonic/gin"
	"github.com/webapp/config"
	"github.com/webapp/entity"
)

// getPropValue ใช้ดึงค่าจาก Property ใน .ics
func getPropValue(e *ics.VEvent, key ics.ComponentProperty) string {
	prop := e.GetProperty(key)
	if prop != nil {
		return prop.Value
	}
	return ""
}

func UploadICS(c *gin.Context) {
	// รับไฟล์จากฟอร์ม
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}

	// บันทึกไฟล์ลง temp path
	tempPath := filepath.Join(os.TempDir(), file.Filename)
	if err := c.SaveUploadedFile(file, tempPath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	// อ่านไฟล์ทั้งหมดเป็น string
	data, err := os.ReadFile(tempPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read file"})
		return
	}

	// แปลง .ics
	reader := bytes.NewReader(data)
	cal, err := ics.ParseCalendar(reader)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse .ics file"})
		return
	}

	db := config.DB()
	inserted := 0

	for _, e := range cal.Events() {
		// ตรวจสอบว่า event มีเวลาที่ครบถ้วน
		startTime, errStart := e.GetStartAt()
		endTime, errEnd := e.GetEndAt()

		if errStart != nil || errEnd != nil {
			continue
		}

		event := entity.Event{
			Title:       getPropValue(e, ics.ComponentPropertySummary),
			Start:       startTime,
			End:         endTime,
			Description: getPropValue(e, ics.ComponentPropertyDescription),
			Location:    getPropValue(e, ics.ComponentPropertyLocation),
			Type:        "holiday",
		}
		db.Create(&event)
		inserted++
	}

	c.JSON(http.StatusOK, gin.H{
		"message":         "Upload successful",
		"events_inserted": inserted,
	})

}

func CreateEvent(c *gin.Context) {
	var event entity.Event
	if err := c.ShouldBindJSON(&event); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db := config.DB()
	db.Create(&event)
	c.JSON(http.StatusCreated, event)
}

func GetAllEvents(c *gin.Context) {
	var events []entity.Event
	db := config.DB()
	db.Find(&events)
	c.JSON(http.StatusOK, events)
}

func GetEventByID(c *gin.Context) {
	id := c.Param("id")
	var event entity.Event
	db := config.DB()

	if err := db.First(&event, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Event not found"})
		return
	}
	c.JSON(http.StatusOK, event)
}

func UpdateEvent(c *gin.Context) {
	id := c.Param("id")
	var event entity.Event
	db := config.DB()

	if err := db.First(&event, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Event not found"})
		return
	}

	var input entity.Event
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	event.Title = input.Title
	event.Description = input.Description
	event.Location = input.Location
	event.Type = input.Type
	event.Start = input.Start
	event.End = input.End

	db.Save(&event)
	c.JSON(http.StatusOK, event)
}

func DeleteEvent(c *gin.Context) {
	id := c.Param("id")
	var event entity.Event
	db := config.DB()

	if err := db.First(&event, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Event not found"})
		return
	}

	db.Delete(&event)
	c.JSON(http.StatusOK, gin.H{"message": "Event deleted"})
}
