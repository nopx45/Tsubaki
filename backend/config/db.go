package config

import (
	"fmt"

	"github.com/webapp/entity"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func ConnectionDB() {
	database, err := gorm.Open(sqlite.Open("tsubaki.db?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	fmt.Println("connected database")
	db = database
	SetupDatabase()
	SeedUser()
}

func SetupDatabase() {
	db.AutoMigrate(
		&entity.Users{},
		&entity.Files{},
		&entity.Announcement{},
		&entity.Activity{},
		&entity.Article{},
		&entity.Knowledge{},
		&entity.Link{},
		&entity.Section{},
		&entity.Formgen{},
		&entity.Regulation{},
		&entity.Visit{},
		&entity.VisitPageLog{},
		&entity.Message{},
		&entity.UserSocket{},
	)
}

func SeedUser() {
	hashedPassword, _ := HashPassword("admin123")
	adminUser := entity.Users{
		FirstName: "Admin",
		LastName:  "User",
		Username:  "admin",
		Email:     "admin@example.com",
		Phone:     "1234567890",
		Password:  hashedPassword,
		Role:      "admin",
	}

	var existingUser entity.Users
	result := db.Where("username = ?", "admin").First(&existingUser)
	if result.Error != nil {
		db.Create(&adminUser)
		fmt.Println("Admin user created successfully!")
	} else {
		fmt.Println("Admin user already exists.")
	}
}
