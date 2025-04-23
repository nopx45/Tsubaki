package chat

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/webapp/config"
	"github.com/webapp/entity"
	"gopkg.in/gomail.v2"
	"gorm.io/gorm"
)

type UserService struct {
	DB *gorm.DB
}

func (s *UserService) CreateUser(user *entity.UserSocket) error {
	return s.DB.Create(user).Error
}

func GetAll(c *gin.Context) {
	var users []entity.UserSocket
	db := config.DB()
	results := db.Find(&users)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, users)
}

func GetUserSocketID(c *gin.Context) {
	ID := c.Param("id")
	var user entity.UserSocket
	db := config.DB()
	results := db.First(&user, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	if user.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, user)
}

func GetUserByUsername(c *gin.Context) {
	username := c.Param("username")
	var user entity.UserSocket
	db := config.DB()

	result := db.Where("username = ?", username).First(&user)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func Delete(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM user_sockets WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}

// // Message /////
func GetMessages(c *gin.Context) {
	var messages []entity.Message
	db := config.DB()
	results := db.Find(&messages)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, messages)
}

func GetMessageByID(c *gin.Context) {
	ID := c.Param("id")
	var message entity.Message
	db := config.DB()
	results := db.First(&message, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	if message.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, message)
}

func DeleteMessage(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM messages WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}

////////////////////////////////

type ChatService struct {
	Users   map[*websocket.Conn]entity.UserSocket
	UsersMu sync.Mutex
}

// ฟังก์ชันส่งอีเมลแจ้งเตือน
func SendEmailNotification(toEmail, subject, body string) error {
	m := gomail.NewMessage()
	m.SetHeader("From", "nopziio02@gmail.com") // เปลี่ยนเป็นอีเมลของคุณ
	m.SetHeader("To", toEmail)
	m.SetHeader("Subject", subject)
	m.SetBody("text/plain", body)

	d := gomail.NewDialer("smtp.gmail.com", 587, "nopziio02@gmail.com", "lcyp rlit ieee miei")

	if err := d.DialAndSend(m); err != nil {
		log.Println("Error sending email:", err)
		return err
	}

	log.Println("Email sent successfully to", toEmail)
	return nil
}

func (s *ChatService) AddUser(conn *websocket.Conn, user entity.UserSocket) {
	s.UsersMu.Lock()
	s.Users[conn] = user
	s.UsersMu.Unlock()
}

func (s *ChatService) RemoveUser(conn *websocket.Conn) {
	s.UsersMu.Lock()
	delete(s.Users, conn)
	s.UsersMu.Unlock()
}

func (s *ChatService) BroadcastUserList() []entity.UserSocket {
	s.UsersMu.Lock()
	defer s.UsersMu.Unlock()

	userList := make([]entity.UserSocket, 0, len(s.Users))
	for _, user := range s.Users {
		userList = append(userList, user)
	}
	return userList
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

type ChatController struct {
	ChatService *ChatService
}

func (c *ChatController) HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WebSocket Upgrade error:", err)
		return
	}
	defer conn.Close()

	var currentUser entity.UserSocket

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Println("Read error:", err)
			c.ChatService.RemoveUser(conn)
			return
		}

		var data map[string]interface{}
		json.Unmarshal(msg, &data)

		switch data["type"] {
		case "join":
			username, ok := data["username"].(string)
			if !ok {
				log.Println("username is missing or not a string")
				return
			}
			role, ok := data["role"].(string)
			if !ok {
				log.Println("role is not assign or not a string")
				return
			}
			currentUser = entity.UserSocket{
				SocketID: conn.RemoteAddr().String(),
				Username: username,
				Role:     role,
			}

			if err := SaveUserSocket(currentUser); err != nil {
				log.Println("Error saving user socket:", err)
			}
			c.ChatService.AddUser(conn, currentUser)
		case "send_message":
			username, ok := data["from"].(string)
			if !ok {
				log.Println("username is missing or not a string")
				return
			}

			var message entity.Message
			json.Unmarshal(msg, &message)
			if err := SaveMessage(message); err != nil {
				log.Println("Error saving message:", err)
			}
			c.handleIncomingMessage(conn, username, string(msg))
		}
	}
}

func SaveUserSocket(user entity.UserSocket) error {
	db := config.DB()
	newUser := entity.UserSocket{
		SocketID: user.SocketID,
		Username: user.Username,
		Role:     user.Role,
	}

	// ใช้ `Create` เพื่อบันทึกข้อมูล
	if err := db.Create(&newUser).Error; err != nil {
		log.Println("Error saving user to DB:", err)
		return err
	}

	log.Println("User saved successfully:", newUser)
	return nil
}

func (c *ChatController) WriteMessageToUser(conn *websocket.Conn, Smessage string) {
	var message entity.Message
	if err := json.Unmarshal([]byte(Smessage), &message); err != nil {
		log.Println("Error parsing message:", err)
		return
	}
	err := conn.WriteMessage(websocket.TextMessage, []byte(message.Content+"-"+message.From+"-"+message.Role))
	if err != nil {
		log.Println("Error writing message:", err)
		conn.Close()
	}
}

func SaveMessage(message entity.Message) error {
	db := config.DB()
	newMessage := entity.Message{
		From:    message.From,
		Role:    message.Role,
		Content: message.Content,
	}

	if err := db.Create(&newMessage).Error; err != nil {
		log.Println("Error saving message to DB:", err)
		return err
	}

	log.Println("Message saved successfully:", newMessage)
	return nil
}

func (c *ChatController) handleIncomingMessage(_ *websocket.Conn, senderUsername string, rawMessage string) {
	c.ChatService.UsersMu.Lock()
	defer c.ChatService.UsersMu.Unlock()

	log.Printf("User %s: %s\n", senderUsername, rawMessage)

	// แปลง JSON ที่ได้รับเป็น struct message
	var message entity.Message
	if err := json.Unmarshal([]byte(rawMessage), &message); err != nil {
		log.Println("Error parsing message:", err)
		return
	}

	// ตรวจสอบว่ามี admin ออนไลน์อยู่หรือไม่
	adminOnline := false
	for _, user := range c.ChatService.Users {
		if user.Role == "admin" {
			adminOnline = true
			break
		}
	}

	// ส่งข้อความให้ผู้ส่ง (sender) และ admin (แต่ไม่ให้ส่งซ้ำ)
	for wsConn, user := range c.ChatService.Users {
		if user.Username == senderUsername || (user.Role == "admin" && user.Username != senderUsername) {
			err := wsConn.WriteMessage(websocket.TextMessage, []byte(message.Content+"-"+message.From+"-"+message.Role))
			if err != nil {
				log.Println("Error sending message to", user.Username, err)
			}
		}
	}

	// หากไม่มี admin ออนไลน์ ส่งอีเมลแจ้งเตือน
	if !adminOnline {
		emailBody := "New message received from " + senderUsername + ":\n\n" + message.Content
		err := SendEmailNotification("nopziio01@gmail.com", "New Chat Message !!", emailBody)
		if err != nil {
			log.Println("Failed to send email notification:", err)
		}
	}
}
