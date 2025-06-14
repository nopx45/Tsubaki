// ใช้ Cloudinary แทน local storage สำหรับ popup images
package popup

import (
	"encoding/json"
	"net/http"
	"os"
	"strings"

	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gin-gonic/gin"
	"github.com/webapp/config"
)

type PopupImage struct {
	Images []string `json:"images"`
}

func GetPopupImage(c *gin.Context) {
	data, err := os.ReadFile("popup.json")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถอ่าน popup image"})
		return
	}

	var popup PopupImage
	if err := json.Unmarshal(data, &popup); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ข้อมูลผิดรูปแบบ"})
		return
	}

	c.JSON(http.StatusOK, popup)
}

func UploadPopupImage(c *gin.Context) {
	role := c.GetString("role")
	if role != "admin" && role != "adminit" && role != "adminhr" {
		c.JSON(http.StatusForbidden, gin.H{"error": "ไม่มีสิทธิ์อัปโหลดรูป"})
		return
	}

	form, err := c.MultipartForm()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบข้อมูลไฟล์"})
		return
	}

	files := form.File["images"]
	if len(files) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "กรุณาเลือกไฟล์อย่างน้อย 1 ไฟล์"})
		return
	}

	cld, err := config.CloudinaryInstance()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cloudinary init failed"})
		return
	}

	// อ่าน popup.json เดิมเพื่อรวมรูปเก่า
	var oldImages []string
	oldData, err := os.ReadFile("popup.json")
	if err == nil {
		var old PopupImage
		if json.Unmarshal(oldData, &old) == nil {
			oldImages = old.Images
		}
	}

	// อัปโหลดไฟล์ใหม่ทั้งหมด
	var newPaths []string
	for _, file := range files {
		f, err := file.Open()
		if err != nil {
			continue
		}
		defer f.Close()

		uploadResp, err := cld.Upload.Upload(c, f, uploader.UploadParams{
			Folder: "popup",
		})
		if err != nil {
			continue
		}
		newPaths = append(newPaths, uploadResp.SecureURL)
	}

	// รวมรูปทั้งหมด (ของเก่า + ใหม่)
	allImages := append(oldImages, newPaths...)

	// เขียน popup.json ใหม่
	popup := PopupImage{Images: allImages}
	data, _ := json.MarshalIndent(popup, "", "  ")
	_ = os.WriteFile("popup.json", data, 0644)

	c.JSON(http.StatusOK, gin.H{
		"message": "อัปโหลดสำเร็จ",
		"paths":   newPaths,
	})
}

func DeletePopupImage(c *gin.Context) {
	role := c.GetString("role")
	if role != "admin" && role != "adminit" && role != "adminhr" {
		c.JSON(http.StatusForbidden, gin.H{"error": "ไม่มีสิทธิ์ลบรูป"})
		return
	}

	var req struct {
		Image string `json:"image"`
	}
	if err := c.ShouldBindJSON(&req); err != nil || req.Image == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ข้อมูลไม่ถูกต้อง"})
		return
	}

	data, err := os.ReadFile("popup.json")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถอ่าน popup.json"})
		return
	}

	var popup PopupImage
	if err := json.Unmarshal(data, &popup); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ข้อมูลผิดรูปแบบ"})
		return
	}

	newImages := []string{}
	found := false

	cld, _ := config.CloudinaryInstance()

	for _, img := range popup.Images {
		if img == req.Image {
			found = true
			publicID := extractPublicIDFromURL(img)
			if publicID != "" {
				cld.Upload.Destroy(c, uploader.DestroyParams{PublicID: publicID})
			}
		} else {
			newImages = append(newImages, img)
		}
	}

	if !found {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบรูปภาพในระบบ"})
		return
	}

	popup.Images = newImages
	newData, _ := json.MarshalIndent(popup, "", "  ")
	_ = os.WriteFile("popup.json", newData, 0644)

	c.JSON(http.StatusOK, gin.H{"message": "ลบรูปสำเร็จ", "image": req.Image})
}

func SavePopupOrder(c *gin.Context) {
	role := c.GetString("role")
	if role != "admin" && role != "adminit" && role != "adminhr" {
		c.JSON(http.StatusForbidden, gin.H{"error": "ไม่มีสิทธิ์บันทึกลำดับรูป"})
		return
	}

	var req PopupImage
	if err := c.ShouldBindJSON(&req); err != nil || len(req.Images) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "รูปแบบข้อมูลไม่ถูกต้อง หรือไม่มีข้อมูลรูปภาพ"})
		return
	}

	data, err := json.MarshalIndent(req, "", "  ")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถจัดรูปแบบข้อมูลได้"})
		return
	}

	if err := os.WriteFile("popup.json", data, 0644); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถเขียนไฟล์ popup.json ได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "บันทึกลำดับรูปภาพเรียบร้อยแล้ว"})
}

func extractPublicIDFromURL(url string) string {
	parts := strings.Split(url, "/upload/")
	if len(parts) < 2 {
		return ""
	}
	publicPath := strings.SplitN(parts[1], ".", 2)[0]
	return publicPath
}
