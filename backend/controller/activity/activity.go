package activity

import (
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/webapp/config"
	"github.com/webapp/entity"
)

func Upload(c *gin.Context) {
	title := c.PostForm("title")
	content := c.PostForm("content")
	CreatedAt := time.Now()

	form, err := c.MultipartForm()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid form data"})
		return
	}

	files := form.File["image"]
	if len(files) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No images uploaded"})
		return
	}

	uploadDir := "uploads/images/activity/"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.MkdirAll(uploadDir, os.ModePerm)
	}

	var filePaths []string
	for _, file := range files {
		filePath := filepath.Join(uploadDir, file.Filename)

		if err := c.SaveUploadedFile(file, filePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save file"})
			return
		}
		filePaths = append(filePaths, filePath)
	}

	// แปลง slice เป็น string
	joinedPaths := strings.Join(filePaths, ",")

	db := config.DB()
	activity := entity.Activity{
		Title:     title,
		Content:   content,
		Image:     joinedPaths, // เปลี่ยนตรงนี้
		CreatedAt: CreatedAt,
	}

	if err := db.Create(&activity).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Upload successful",
		"images":  filePaths,
	})
}

func GetAll(c *gin.Context) {
	var activities []entity.Activity
	db := config.DB()

	results := db.Find(&activities)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	baseURL := c.Request.Host
	for i := range activities {
		// แปลง string เป็น slice ก่อน
		if activities[i].Image != "" {
			images := strings.Split(activities[i].Image, ",")
			for j := range images {
				images[j] = "http://" + baseURL + "/" + images[j]
			}
			activities[i].Image = strings.Join(images, ",")
		}
		activities[i].CreatedAt = activities[i].CreatedAt.Local()
	}

	c.JSON(http.StatusOK, activities)
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

	if activity.Image != "" {
		images := strings.Split(activity.Image, ",")
		for i := range images {
			cleanPath := strings.ReplaceAll(images[i], "\\", "/") // convert \ to /
			cleanPath = strings.TrimPrefix(cleanPath, "/")        // remove leading /
			images[i] = "http://" + c.Request.Host + "/" + cleanPath
		}
		activity.Image = strings.Join(images, ",")
	}
	activity.CreatedAt = activity.CreatedAt.Local()

	c.JSON(http.StatusOK, activity)
}

func Update(c *gin.Context) {
	db := config.DB()
	activityID := c.Param("id")
	var activity entity.Activity

	if err := db.First(&activity, activityID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Activity not found"})
		return
	}

	title := c.PostForm("title")
	content := c.PostForm("content")

	// รับ image_url หลายค่า
	imageURLs := c.PostFormArray("image_url")

	// เอาเฉพาะ path (ตัด http://localhost:8080/)
	var cleanPaths []string
	for _, url := range imageURLs {
		clean := strings.TrimPrefix(url, "http://"+c.Request.Host+"/")
		clean = strings.ReplaceAll(clean, "\\", "/")
		cleanPaths = append(cleanPaths, clean)
	}

	// รับไฟล์ใหม่ (ถ้ามี)
	form, err := c.MultipartForm()
	if err == nil && len(form.File["image"]) > 0 {
		for _, file := range form.File["image"] {
			filePath := filepath.Join("uploads/images/activity", file.Filename)
			if err := c.SaveUploadedFile(file, filePath); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
				return
			}
			cleanPaths = append(cleanPaths, "uploads/images/activity/"+file.Filename)
		}
	}

	// อัพเดต database
	activity.Title = title
	activity.Content = content
	activity.Image = strings.Join(cleanPaths, ",")

	if err := db.Save(&activity).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// ลบไฟล์ในโฟลเดอร์ที่ไม่ถูกใช้งาน
	files, err := os.ReadDir("uploads/images/activity")
	if err == nil {
		// ไฟล์ที่ถูกอ้างอิงโดย record ปัจจุบัน
		validFiles := make(map[string]bool)
		for _, path := range cleanPaths {
			validFiles[filepath.Base(path)] = true
		}

		// หาไฟล์ที่ถูกอ้างอิงโดย record อื่น
		var otherActivities []entity.Activity
		if err := db.Where("id != ?", activity.ID).Find(&otherActivities).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
			return
		}

		referencedFiles := make(map[string]bool)
		for _, act := range otherActivities {
			if act.Image != "" {
				imagePaths := strings.Split(act.Image, ",")
				for _, path := range imagePaths {
					referencedFiles[filepath.Base(path)] = true
				}
			}
		}

		// ลบเฉพาะไฟล์ที่ไม่ได้ถูกอ้างอิงที่ไหนเลย
		for _, file := range files {
			if !validFiles[file.Name()] && !referencedFiles[file.Name()] {
				os.Remove(filepath.Join("uploads/images/activity", file.Name()))
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Activity updated successfully"})
}

func Delete(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	var activity entity.Activity
	if err := db.First(&activity, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "file not found"})
		return
	}

	// ลบไฟล์
	if activity.Image != "" {
		images := strings.Split(activity.Image, ",")
		for _, path := range images {
			var count int64
			db.Model(&entity.Activity{}).
				Where("image LIKE ?", "%"+path+"%").
				Where("id != ?", activity.ID).
				Count(&count)
			if count == 0 {
				os.Remove(path)
			}
		}
	}

	if tx := db.Unscoped().Delete(&activity).RowsAffected; tx == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}
