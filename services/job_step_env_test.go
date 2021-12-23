package services

import (
	db "app/database"
	"testing"
)



func TestCreateNewStepJobEnv(t *testing.T){
	db.InitialDatabase()
	err := CreateNewStepJobEnv("server-1", "Server one","ssh", "{}")
	if err != nil{
		panic(err)
	}
}

func TestUpdateStepJobEnv(t *testing.T){
	db.InitialDatabase()
	err := UpdateStepJobEnv(3,"dsdsad", "{}")
	if err != nil{
		panic(err)
	}
}


func TestFirstJobStepEnvById(t *testing.T){
	db.InitialDatabase()
	data, err := FirstJobStepEnvById(3)
	if err != nil{
		panic(err)
	}
	t.Log(data)
}



func TestGetAllJobStepEnv(t *testing.T){
	db.InitialDatabase()
	data, err := GetAllJobStepEnv()
	if err != nil{
		panic(err)
	}
	t.Log(data)
}
