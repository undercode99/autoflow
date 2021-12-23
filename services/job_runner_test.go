package services

import (
	"testing"
	"time"
	d "app/database"
)


func TestNewStartRunning(t *testing.T){
	d.InitialDatabase()
	run := RunningStepManager{
		JobsId: 1,
		JobStepsId: 1,
		JobStepName: "Test Step Job",
	}
	err := run.NewStartStepRunning(time.Now())
	if err != nil{
		panic(err)
	}
}

func TestStopRunning(t *testing.T){
	d.InitialDatabase()
	run := RunningStepManager{
		JobsId: 1,
		JobStepsId: 1,
		RunningId: 2,
	}
	err := run.StopStepRunning(IS_SUCCESS)
	if err != nil{
		panic(err)
	}
}