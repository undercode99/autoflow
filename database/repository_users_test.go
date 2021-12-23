package database

import (
	"testing"
)


func TestCreateAssociationUserJobPermission(t *testing.T){
	InitialDatabase()
	
	r := Repository{}
	r.InitConnection()
	err := r.Db.Model(&Jobs{ID:201}).Association("Users").Append([]User{User{ID: 1}})
	if err != nil{
		panic(err)
	}
}


func TestDeleteAssociationUserJobPermission(t *testing.T){
	InitialDatabase()
	
	r := Repository{}
	r.InitConnection()
	err := r.Db.Model(&Jobs{ID:202}).Association("Users").Delete([]User{User{ID: 1}})
	if err != nil{
		panic(err)
	}
}


func TestFindUserJobPermission(t *testing.T){
	InitialDatabase()
	
	r := Repository{}
	r.InitConnection()

	jobs := []Jobs{}
	r.Db.Preload("Users").Find(&jobs, &Jobs{ID: 201}) 
	for _, j := range jobs{
		t.Log(j.Name, j.ID)
	}

}


func  TestCreateUserJobPermission(t *testing.T){
	InitialDatabase()
	
	r := Repository{}
	r.InitConnection()
	r.Db.Create(&UserJobPermission{
		JobsId: 202,
		UserId :1,
		Roles: 1,
	})
}



 /// FOR BETA TESTING KEPERLUAN PROJECT INTERNAL



//  type User struct {
// 	ID uint `gorm:"primaryKey"`
// 	Username string
// 	Email string
// 	Password string
// 	Photos string
// 	UserAuth string  `gorm:"default:local"`
// 	SuperUser bool
// 	Jobs []*Jobs `gorm:"many2many:user_job_permissions;"`
// 	LastLoginAt  sql.NullString
// 	TimeStamps
// }


func  TestCreateUser(t *testing.T){
	InitialDatabase()
	r := UserRepository{}
	r.InitConnection()
	user, err := r.CreateUser(User{
		Name : "Test admin user",
		Username: "admin",
		Password: "nrp_admin123",
		SuperUser: true,
	})

	if err != nil{
		panic(err)
	}
	t.Log(user)
}



func TestTakeByUsername(t *testing.T){
	InitialDatabase()
	r := UserRepository{}
	user, err := r.TakeByUsername("admixn")
	if err != nil{
		panic(err)
	}
	t.Log(user)
}	