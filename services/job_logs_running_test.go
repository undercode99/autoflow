package services

import (
	db "app/database"
	"testing"
)

func TestGetLogsByIdJobs(t *testing.T)  {
	db.InitialDatabase()
	result, err := GetLogsByIdJobs(25)

	if err != nil{
		panic(err)
	}
	t.Log(result)

}


func TestReduceJobRunning(t *testing.T){
	db.InitialDatabase()
	err := ReduceJobRunning(1,10)
	if err != nil{
		panic(err)
	}
}


func TestGetRawsLogsByIdRunning(t *testing.T){
	db.InitialDatabase()
	_, err := GetRawsLogsByIdRunning("6ad3fa34-6e3a-4fc2-91de-81f0c8a92576")
	if err != nil {
		panic(err)
	}
}

func TestGetRawLogsByRunningLogsId(t *testing.T){
	db.InitialDatabase()
	byte_output,err := GetRawLogsByRunningLogsId(13926, 0)
	if err != nil {
		panic(err)
	}
	t.Log(byte_output)
}