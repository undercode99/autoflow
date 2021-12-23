package services
import (
	d "app/database"
	"testing"
)


func TestFetchJobScheduleQueue(t *testing.T){
	d.InitialDatabase()
	queues, err := FetchJobScheduleQueue()
	for _,queue := range queues{
		t.Logf("Job ID: %d",queue.JobId)
		t.Logf("Scheduler : %s",queue.Schedules)
	}
	if err != nil{
		panic(err)
	}
}

func TestRemoveAllJobScheduleQueue(t *testing.T){
	d.InitialDatabase()
	err := RemoveAllJobScheduleQueue()
	if err != nil{
		panic(err)
	}
}
