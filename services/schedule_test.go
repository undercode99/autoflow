package services
import "testing"


func TestCheckConfigSchedule(t *testing.T){
	err := CheckConfigSchedule("@every 2h1s")
	if err != nil{
		panic(err)
	}
	// test cron
	err = CheckConfigSchedule("5 4 * * *")
	if err != nil{
		panic(err)
	}
}