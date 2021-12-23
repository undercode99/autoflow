package services
import (
	"testing" 
	d "app/database"
)




func TestCreateNewUser(t *testing.T){
	d.InitialDatabase()
	auth := Auth{
		Username: "admin_nrp",
		Email: "admin@gmail.com",
		Password: "admin_nrp_1234",
		Name : "Admin NRP",
	}
	err := auth.CreateNewUser()
	if err != nil{
		panic(err)
	}

	t.Log(auth)
}


func TestCheckUsernamePassword(t *testing.T){
	d.InitialDatabase()
	auth := &Auth{
		Username: "admin_nrp",
		Password: "admin_nrp_1234",
	}
	if err := auth.CheckUsernamePassword(); err != nil{
		panic(err)
	}
	t.Log(auth)
}


func TestCheckFailedUsernamePassword(t *testing.T){
	d.InitialDatabase()
	auth := &Auth{
		Username: "admin_nrp",
		Password: "admin_nrp_1234",
	}
	if err := auth.CheckUsernamePassword(); err == nil{
		panic("Username  & Password valid")
	}
}
