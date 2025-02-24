package main

import (
	"net/http"

	// "os"
	// "strings"

	"github.com/gin-gonic/gin"
	"github.com/webapp/config"
	"github.com/webapp/controller/activity"
	announcetment "github.com/webapp/controller/announcements"
	"github.com/webapp/controller/article"
	"github.com/webapp/controller/files"
	"github.com/webapp/controller/formgen"
	"github.com/webapp/controller/knowledge"
	"github.com/webapp/controller/link"
	"github.com/webapp/controller/section"
	"github.com/webapp/controller/users"
	"github.com/webapp/middlewares"
)

// const PORT = "8000"

func main() {
	// open connection database
	config.ConnectionDB()

	// Generate databases
	config.SetupDatabase()
	r := gin.Default()
	r.Use(CORSMiddleware())

	// Auth Route
	r.POST("/signup", users.SignUp)
	r.POST("/signin", users.SignIn)
	router := r.Group("/")
	{
		router.Use(middlewares.Authorizes("admin"))
		// User Route
		router.PUT("/user/:id", users.Update)
		r.GET("/users", users.GetAll)
		router.GET("/user/:id", users.GetID)
		router.DELETE("/user/:id", users.Delete)
		// File Route
		router.POST("/upload", files.UploadFile)
		router.DELETE("/file/:id", files.Delete)
		// Announcement Route
		router.POST("/announcement", announcetment.AnnounceUpload)
		router.PUT("/announcement/:id", announcetment.Update)
		router.DELETE("/announcement/:id", announcetment.Delete)
		// Activity Route
		router.POST("/activity", activity.Upload)
		router.PUT("/activity/:id", activity.Update)
		router.DELETE("/activity/:id", activity.Delete)
		// Article Route
		router.POST("/article", article.Upload)
		router.PUT("/article/:id", article.Update)
		router.DELETE("/article/:id", article.Delete)
		// Knowledge Route
		router.POST("/knowledge", knowledge.Upload)
		router.PUT("/knowledge/:id", knowledge.Update)
		router.DELETE("/knowledge/:id", knowledge.Delete)
		// Link Route
		router.POST("/link", link.Upload)
		router.PUT("/link/:id", link.Update)
		router.DELETE("/link/:id", link.Delete)
		// Section Route
		router.POST("/section", section.Upload)
		router.PUT("/section/:id", section.Update)
		router.DELETE("/section/:id", section.Delete)
		// Form General Route
		router.POST("/form", formgen.UploadForm)
		router.PUT("/form/:id", formgen.Update)
		router.DELETE("/form/:id", formgen.Delete)
	}
	fileRouter := r.Group("/")
	{
		fileRouter.Use(middlewares.Authorizes("user"))
	}

	// User Route
	r.GET("/nusers", users.GetNotAll)
	// File Route
	r.GET("/download/:id", files.DownloadFile)
	r.GET("/files", files.GetAll)
	r.GET("/file/:id", files.GetID)
	// Announce Route
	r.GET("/announcements", announcetment.GetAll)
	r.GET("/announcement/:id", announcetment.Get)
	// Activity Route
	r.GET("/activities", activity.GetAll)
	r.GET("/activity/:id", activity.GetID)
	// Article Route
	r.GET("/articles", article.GetAll)
	r.GET("/article/:id", article.GetID)
	// Knowledge Route
	r.GET("/knowledges", knowledge.GetAll)
	r.GET("/knowledge/:id", knowledge.GetID)
	// Link Route
	r.GET("/links", link.GetAll)
	r.GET("/link/:id", link.GetID)
	// Section Route
	r.GET("/sections", section.GetAll)
	r.GET("/section/:id", section.GetID)
	// Form General Route
	r.GET("/forms", formgen.GetAll)
	r.GET("/form/:id", formgen.GetID)

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API RUNNING...")
	})

	// Run the server
	r.Run()
}
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// frontendDomain := os.Getenv("FRONTEND_URL")

		// ถ้าไม่มีค่า ให้ใช้ Wildcard เฉพาะ Netlify
		// if frontendDomain == "" {
		// 	frontendDomain = "https://*.netlify.app"
		// }

		// // ตรวจสอบ Origin ที่เข้ามา
		// origin := c.Request.Header.Get("Origin")
		// if strings.HasSuffix(origin, ".netlify.app") {
		// 	frontendDomain = origin
		// }

		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
