package main

import (
	"net/http"
	"strings"

	// "os"
	// "strings"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/webapp/config"
	"github.com/webapp/controller/activity"
	announcetment "github.com/webapp/controller/announcements"
	"github.com/webapp/controller/article"
	"github.com/webapp/controller/chat"
	"github.com/webapp/controller/event"
	"github.com/webapp/controller/files"
	"github.com/webapp/controller/formgen"
	"github.com/webapp/controller/knowledge"
	"github.com/webapp/controller/link"
	"github.com/webapp/controller/logs"
	"github.com/webapp/controller/logvisitpage"
	"github.com/webapp/controller/marquee"
	"github.com/webapp/controller/popup"
	"github.com/webapp/controller/regulation"
	"github.com/webapp/controller/section"
	"github.com/webapp/controller/security"
	"github.com/webapp/controller/training"
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
	r.Static("/uploads/videos", "./uploads/videos")
	r.Static("/uploads/gifs", "./uploads/gifs")
	r.Static("/uploads/pdfs", "./uploads/pdfs")

	r.Use(CORSMiddleware())

	// Auth Route
	r.POST("/signup", users.SignUp)
	r.POST("/signin", users.SignIn)
	r.GET("/auth/token", users.GetAuthToken)
	r.GET("/logout", users.Logout)

	r.POST("/upload-ics", event.UploadICS)
	// Event CRUD
	r.POST("/event", event.CreateEvent)
	r.GET("/events", event.GetAllEvents)
	r.GET("/event/:id", event.GetEventByID)
	r.PUT("/event/:id", event.UpdateEvent)
	r.DELETE("/event/:id", event.DeleteEvent)

	// live chat
	r.GET("/ws", func(c *gin.Context) {
		chatController.HandleWebSocket(c.Writer, c.Request)
	})
	// 📌 Group สำหรับเฉพาะ Admin เท่านั้น
	adminRouter := r.Group("/")
	{
		adminRouter.Use(middlewares.Authorizes("admin"))
		// User Route
		adminRouter.DELETE("/user/:id", users.Delete)
		adminRouter.POST("/userunlock/:username", users.UnlockUser)
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
		adminITRouter.GET("/knowledge/admin", knowledge.GetAdminAccess)

		adminITRouter.POST("/security", security.Upload)
		adminITRouter.PUT("/security/:id", security.Update)
		adminITRouter.DELETE("/security/:id", security.Delete)
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
		// Training Route
		adminHRRouter.POST("/training", training.Upload)
		adminHRRouter.PUT("/training/:id", training.Update)
		adminHRRouter.DELETE("/training/:id", training.Delete)

	}

	allAdminRouter := r.Group("/")
	{
		allAdminRouter.Use(middlewares.Authorizes("admin", "adminhr", "adminit"))
		// File Route
		allAdminRouter.GET("/avg-duration", logs.GetAvgDuration)
		allAdminRouter.GET("/allvisitors", logs.GetAllVisitors)
		allAdminRouter.DELETE("/visit/:id", logs.Delete)
		allAdminRouter.DELETE("/pagevisit/:id", logvisitpage.Delete)
		// user Route
		allAdminRouter.GET("/users", users.GetAll)
		allAdminRouter.GET("/user/:id", users.GetID)
		//marquee
		allAdminRouter.POST("/marquee", marquee.UpdateMarquee)
		//popup
		allAdminRouter.POST("/popup", popup.UploadPopupImage)
		allAdminRouter.POST("/popup/order", popup.SavePopupOrder)
		allAdminRouter.DELETE("/popup", popup.DeletePopupImage)

	}

	userRouter := r.Group("/")
	{
		userRouter.Use(middlewares.Authorizes("user", "adminit", "admin", "adminhr"))

		userRouter.POST("/change-password", users.ChangePassword)
		userRouter.GET("/profile", users.GetUserProfile)
		userRouter.PUT("/user/:id", users.Update)

		userRouter.GET("/downloadfile/:id", files.DownloadFile)
		userRouter.GET("/downloadform/:id", formgen.DownloadFile)
		userRouter.GET("/downloadregulation/:id", regulation.DownloadFile)

		userRouter.POST("/visit", logs.RecordVisit)
		userRouter.POST("/exit", logs.RecordExit)
		userRouter.GET("/topvisitors", logs.GetTopUsernames)

		userRouter.POST("/pagevisitors", logvisitpage.RecordlogVisit)
		userRouter.GET("/pagevisitors", logvisitpage.GetAllPageVisitors)
		userRouter.GET("/toppagevisitors", logvisitpage.GetTopPages)

		userRouter.POST("/messages/delete-many", chat.DeleteMultipleMessages)
		userRouter.GET("/messages/:username", chat.GetMessagesByUsername)

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
	r.GET("/knowledge/user", knowledge.GetUserAccess)
	r.GET("/securities", security.GetAll)
	r.GET("/security/:id", security.GetID)
	r.GET("/links", link.GetAll)
	r.GET("/link/:id", link.GetID)
	r.GET("/sections", section.GetAll)
	r.GET("/section/:id", section.GetID)
	r.GET("/forms", formgen.GetAll)
	r.GET("/form/:id", formgen.GetID)
	r.GET("/regulations", regulation.GetAll)
	r.GET("/regulation/:id", regulation.GetID)
	r.GET("/trainings", training.GetAll)
	r.GET("/training/:id", training.GetID)
	r.GET("/visitors", logs.GetTotalVisitors)
	r.GET("/usersockets", chat.GetAll)
	r.GET("/usersocket/:username", chat.GetUserByUsername)
	r.GET("/marquee", marquee.GetMarquee)
	r.GET("/popup", popup.GetPopupImage)

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API RUNNING...")
	})

	// Run the server
	r.Run("0.0.0.0:8080")
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")

		if origin != "" && isAllowedOrigin(origin) {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
			c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
			c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		}
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func isAllowedOrigin(origin string) bool {
	allowedOrigins := []string{
		"http://tat-webcenter",
		"http://localhost:5173",
	}
	// อนุญาตให้เฉพาะ IP ที่ขึ้นต้นด้วย "http://192.168."
	if strings.HasPrefix(origin, "http://192.168.") {
		return true
	}

	// ตรวจสอบว่า Origin อยู่ในลิสต์ allowedOrigins หรือไม่
	for _, allowed := range allowedOrigins {
		if origin == allowed {
			return true
		}
	}

	return false
}
