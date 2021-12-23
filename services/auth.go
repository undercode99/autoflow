package services
import (
	d "app/database"
	"os"
	"errors"
	"golang.org/x/crypto/bcrypt"
)

type Auth struct {
	ID uint
	Name string
	Email string
	Username string
	Password string
	Token string
}


func (a *Auth) CheckUsernamePassword() error {
	r := d.UserRepository{}
	user, err := r.TakeByUsername(a.Username)
	if err != nil{
		return errors.New("Invalid login credentials. Please try again")
	}

	errf := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(a.Password))
	if errf != nil && errf == bcrypt.ErrMismatchedHashAndPassword { //Password does not match!
		return errors.New("Invalid login credentials. Please try again")
	}

	j := JwtToken{SecretKey: os.Getenv("SECRET_KEY")}
	j.GenerateToken(user.ID)
	a.ID = user.ID
	a.Name = user.Name
	a.Username = user.Username
	a.Email = user.Email
	a.Token = j.Token
	return nil
}

func (a *Auth) CreateNewUser() error {
	
	r := d.UserRepository{}

	password, err := a.GenerateFromPassword()
	if err != nil{
		return err
	}
	user, err := r.CreateUser(d.User{
		Name : a.Name,
		Email: a.Email,
		Username: a.Username,
		Password: password,
		SuperUser: true,
	})

	if err != nil {
		return errors.New("Failed create new users")
	}
	a.ID = user.ID
	a.Name = user.Name
	a.Email = user.Email
	a.Username = user.Username
	
	return nil
}


func (a *Auth) GenerateFromPassword() (string, error) {
	pass, err := bcrypt.GenerateFromPassword([]byte(a.Password), bcrypt.DefaultCost)
	if err != nil{
		return "", errors.New("Password Encryption  failed")
	}
	return string(pass), nil
}