
package database
// import (
// 	"gorm.io/gorm"
// 	"golang.org/x/crypto/bcrypt"
// )

type UserRepository struct {
	Repository
}

func (j *UserRepository) TakeByUsername(username string) (User, error) {
	j.InitConnection()
	var user User
	err := j.Db.Model(User{}).Where("username = ?", username).Take(&user).Error
	if err != nil{
		return User{},err
	}
	return user, nil
}



func (j *UserRepository) CreateUser(user User) (User,error) {
	j.InitConnection()
	err := j.Db.Create(&user)
	if err.Error != nil{
		return User{}, err.Error
	}
	return user, nil
}




