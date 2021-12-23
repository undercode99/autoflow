package database

import (
	"os"
	"fmt"
	"gorm.io/gorm"
	"gorm.io/driver/postgres"
)

var DB *gorm.DB

func Migration(db *gorm.DB)  {
	db.AutoMigrate(&User{})
	db.AutoMigrate(&Jobs{})
	db.AutoMigrate(&JobSchedules{})
	db.AutoMigrate(&JobQueuesSchedule{})
	db.AutoMigrate(&JobSteps{})
	db.AutoMigrate(&JobRawsLog{})
	db.AutoMigrate(&JobLogsRunning{})
	db.AutoMigrate(&JobLockTmpSchedule{})
	db.AutoMigrate(&UserJobPermission{})
}

func InitialDatabase(){
	dsn := os.Getenv("PG_DSN")
	if dsn == "" {
		dsn = "host=localhost user=postgres password=postgres dbname=kyaa_flow port=5432 sslmode=disable"
	}
	fmt.Println("Fuck", dsn)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	Migration(db)
	DB = db
}

func GetConnection() *gorm.DB {
	return DB
}

