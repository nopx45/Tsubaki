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
	)
}
