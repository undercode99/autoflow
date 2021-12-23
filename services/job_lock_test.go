package services

import (
	"testing"
	db "app/database"
	"github.com/robfig/cron/v3"
)


func TestSaveNewRunnerId(t *testing.T){
	db.InitialDatabase()
	s := []cron.EntryID{1,2,3,4}
	err := SaveNewRunnerId(7, s)
	if err != nil{
		panic(err)
	}
}


func TestRemoveOldRunnerId(t *testing.T){
	db.InitialDatabase()
	listRunning,err := RemoveOldRunnerId(7)
	if err != nil{
		panic(err)
	}
	t.Log(listRunning)
}