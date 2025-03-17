package main

import (
	"net/http"

	// "os"
	// "strings"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/webapp/config"
	"github.com/webapp/controller/activity"
	announcetment "github.com/webapp/controller/announcements"
	"github.com/webapp/controller/article"
	"github.com/webapp/controller/chat"
	"github.com/webapp/controller/files"
	"github.com/webapp/controller/formgen"
	"github.com/webapp/controller/knowledge"
	"github.com/webapp/controller/link"
	"github.com/webapp/controller/logs"
	"github.com/webapp/controller/logvisitpage"
	"github.com/webapp/controller/regulation"
	"github.com/webapp/controller/section"
	"github.com/webapp/controller/users"
	"github.com/webapp/entity"
	"github.com/webapp/middlewares"
)

// const PORT = "8000"

func main() {
	// Open connection to database
	config.ConnectionDB()
	config.SetupDatabase()

	chatService := &chat.ChatService{Users: make(map[*websocket.Conn]entity.UserSocket)}

	chatController := &chat.ChatController{ChatService: chatService}

	r := gin.Default()
	r.Static("/uploads/images", "./uploads/images")
	r.Use(CORSMiddleware())

	// Auth Route
	r.POST("/signup", users.SignUp)
	r.POST("/signin", users.SignIn)
	r.POST("/auto/login", users.AutoLogin)
	r.GET("/auth/token", users.GetAuthToken)
	r.GET("/logout", users.Logout)

	// live chat
	r.GET("/ws", func(c *gin.Context) {
		chatController.HandleWebSocket(c.Writer, c.Request)
	})
	// 📌 Group สำหรับเฉพาะ Admin เท่านั้น
	adminRouter := r.Group("/")
	{
		adminRouter.Use(middlewares.Authorizes("admin"))

		adminRouter.GET("/avg-duration", logs.GetAvgDuration)
		adminRouter.GET("/allvisitors", logs.GetAllVisitors)
		adminRouter.DELETE("/visit/:id", logs.Delete)
		adminRouter.DELETE("/pagevisit/:id", logvisitpage.Delete)

		// User Route
		adminRouter.PUT("/user/:id", users.Update)
		adminRouter.GET("/users", users.GetAll)
		adminRouter.GET("/user/:id", users.GetID)
		adminRouter.DELETE("/user/:id", users.Delete)
		// Link Route
		adminRouter.POST("/link", link.Upload)
		adminRouter.PUT("/link/:id", link.Update)
		adminRouter.DELETE("/link/:id", link.Delete)
		// Section Route
		adminRouter.POST("/section", section.Upload)
		adminRouter.PUT("/section/:id", section.Update)
		adminRouter.DELETE("/section/:id", section.Delete)
		// Form General Route
		adminRouter.POST("/form", formgen.UploadForm)
		adminRouter.PUT("/form/:id", formgen.Update)
		adminRouter.DELETE("/form/:id", formgen.Delete)

		// User Socket
		adminRouter.GET("/usersocket", chat.GetUserSocketID)
		adminRouter.DELETE("/usersocket/:id", chat.Delete)

		// User Socket
		adminRouter.GET("/messages", chat.GetMessages)
		adminRouter.GET("/message", chat.GetMessageByID)
		adminRouter.DELETE("/message/:id", chat.DeleteMessage)
	}

	adminITRouter := r.Group("/")
	{
		adminITRouter.Use(middlewares.Authorizes("admin", "adminit"))
		adminITRouter.POST("/knowledge", knowledge.Upload)
		adminITRouter.PUT("/knowledge/:id", knowledge.Update)
		adminITRouter.DELETE("/knowledge/:id", knowledge.Delete)
	}

	adminHRRouter := r.Group("/")
	{
		adminHRRouter.Use(middlewares.Authorizes("admin", "adminhr"))
		// File Route
		adminHRRouter.POST("/upload", files.UploadFile)
		adminHRRouter.DELETE("/file/:id", files.Delete)
		// Announcement Route
		adminHRRouter.POST("/announcement", announcetment.AnnounceUpload)
		adminHRRouter.PUT("/announcement/:id", announcetment.Update)
		adminHRRouter.DELETE("/announcement/:id", announcetment.Delete)
		// Activity Route
		adminHRRouter.POST("/activity", activity.Upload)
		adminHRRouter.PUT("/activity/:id", activity.Update)
		adminHRRouter.DELETE("/activity/:id", activity.Delete)
		// Article Route
		adminHRRouter.POST("/article", article.Upload)
		adminHRRouter.PUT("/article/:id", article.Update)
		adminHRRouter.DELETE("/article/:id", article.Delete)
		// Regulation Route
		adminHRRouter.POST("/regulation", regulation.UploadRegulation)
		adminHRRouter.PUT("/regulation/:id", regulation.Update)
		adminHRRouter.DELETE("/regulation/:id", regulation.Delete)
	}

	userRouter := r.Group("/")
	{
		userRouter.Use(middlewares.Authorizes("user", "adminit", "admin", "adminhr"))
		userRouter.GET("/downloadfile/:id", files.DownloadFile)
		userRouter.GET("/downloadform/:id", formgen.DownloadFile)
		userRouter.GET("/downloadregulation/:id", regulation.DownloadFile)

		userRouter.POST("/visit", logs.RecordVisit)
		userRouter.POST("/exit", logs.RecordExit)
		userRouter.GET("/topvisitors", logs.GetTopUsernames)

		userRouter.POST("/pagevisitors", logvisitpage.RecordlogVisit)
		userRouter.GET("/pagevisitors", logvisitpage.GetAllPageVisitors)
		userRouter.GET("/toppagevisitors", logvisitpage.GetTopPages)
	}

	// 📌 Route สำหรับ GET (ไม่ต้องใช้สิทธิ์พิเศษ)
	r.GET("/nusers", users.GetNotAll)
	r.GET("/files", files.GetAll)
	r.GET("/file/:id", files.GetID)
	r.GET("/announcements", announcetment.GetAll)
	r.GET("/announcement/:id", announcetment.Get)
	r.GET("/activities", activity.GetAll)
	r.GET("/activity/:id", activity.GetID)
	r.GET("/articles", article.GetAll)
	r.GET("/article/:id", article.GetID)
	r.GET("/knowledges", knowledge.GetAll)
	r.GET("/knowledge/:id", knowledge.GetID)
	r.GET("/links", link.GetAll)
	r.GET("/link/:id", link.GetID)
	r.GET("/sections", section.GetAll)
	r.GET("/section/:id", section.GetID)
	r.GET("/forms", formgen.GetAll)
	r.GET("/form/:id", formgen.GetID)
	r.GET("/regulations", regulation.GetAll)
	r.GET("/regulation/:id", regulation.GetID)
	r.GET("/visitors", logs.GetTotalVisitors)
	r.GET("/usersockets", chat.GetAll)
	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API RUNNING...")
	})

	// Run the server
	r.Run()
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// frontendDomain := os.Getenv("FRONTEND_URL")

		// //ถ้าไม่มีค่า ให้ใช้ Wildcard เฉพาะ Netlify
		// if frontendDomain == "" {
		// 	frontendDomain = "https://*.netlify.app"
		// }

		// // ตรวจสอบ Origin ที่เข้ามา
		// origin := c.Request.Header.Get("Origin")
		// if strings.HasSuffix(origin, ".netlify.app") {
		// 	frontendDomain = origin
		// }

		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
