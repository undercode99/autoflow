package services
import (
	d "app/database"
	"testing"
)


func TestBuildDataJob(t *testing.T){
	d.InitialDatabase()
	_,err := BuildDataJob("Name Job", "Category Job", "Description", 1, SampleYamlConfig())
	if err != nil{
		panic(err)
	}
}


func TestCreateNewJobFromYamlConfig(t *testing.T){
	d.InitialDatabase()
	_,err := CreateNewJobFromYamlConfig("Update Testing New Job", "Category Job", "Description", 1, SampleYamlConfig())
	if err != nil{
		panic(err)
	}
}

func TestCreateQueueSchedule(t *testing.T){
	d.InitialDatabase()
	err := CreateQueueSchedule(1)
	if err != nil{
		panic(err)
	}
}


func TestUpdateJobFromYamlConfig(t *testing.T){
	d.InitialDatabase()
	_,err := UpdateJobFromYamlConfig(202,"Testing Create Job plane", "Category Job update", "Description",1,  SampleYamlConfig())
	if err != nil{
		panic(err)
	}
}

func TestDeleteJob(t *testing.T){
	d.InitialDatabase()
	var i uint
	for i = 10; i <= 1000; i++ {
	err := DeleteJob(i)
	if err != nil{
		panic(err)
	}
}
}

func TestGetJobForScheduler(t  *testing.T){
	d.InitialDatabase()
	job, err := GetJobForScheduler(7)
	if err != nil{
		panic(err)
	}
	t.Log(job.StepCommands)
}

func TestFetchGetJobForScheduler(t *testing.T){
	d.InitialDatabase()
	fetch , err := FetchGetJobForScheduler()
	if err != nil{
		panic(err)
	}
	for _, job := range fetch{
		t.Log(job.Schedule)
	}
	// t.Log(fetch)

}