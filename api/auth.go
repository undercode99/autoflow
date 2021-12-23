
package api


import (
	"os"
	"net/http"
	"fmt"
	"errors"
	"github.com/gin-gonic/gin"
	s "app/services"
	"strings"
)

func JwtVerified(c *gin.Context) (uint64, error) {
	reqToken := c.Request.Header.Get("Authorization")
	splitToken := strings.Split(reqToken, "Bearer ")
	if cap(splitToken) < 2 {
		result := gin.H{
			"status": "not authorized",
			"message":   "Need authorized",
		}
		c.JSON(http.StatusUnauthorized, result)
		c.Abort()
		return 0, errors.New("Need authorized")
	}
	
	reqToken = splitToken[1]

	secretKey := os.Getenv("SECRET_KEY")
	jwtToken := s.JwtToken{
		Token: reqToken,
		SecretKey: secretKey,
	}
	
	userId, err := jwtToken.GetDataPayloadUserId()
	if err != nil {
		result := gin.H{
			"status": "not authorized",
			"message":   err.Error(),
		}
		c.JSON(http.StatusUnauthorized, result)
		c.Abort()
		return  0, err
	}

	return userId, nil
}

func Auth(c *gin.Context) {
	userId, err := JwtVerified(c)
	if err != nil{
		return 
	}
	result := gin.H{
		"user_id": userId,
	}
	c.JSON(http.StatusOK, result)
}

type User struct {
	 ID uint64           `json:"id"`
	 Username string `json:"username"`
	 Password string `json:"password"`
}

type UserResults struct {
	Username string `json:"username"`
	ID uint `json:"id"`
	Name string `json:"name"`
	Email string `json:"email"`
	Token string `json:"token"`
}

func AuthLogin(c *gin.Context) {
	var u User
	if err := c.ShouldBindJSON(&u); err != nil {
	   c.JSON(http.StatusUnprocessableEntity, "Invalid json provided")
	   return
	}
	auth := &s.Auth{
		Username: u.Username,
		Password: u.Password,
	}
	if err := auth.CheckUsernamePassword(); err != nil{
		fmt.Println(err)
		result := gin.H{
			"status": "not authorized",
			"message":   err.Error(),
		}
		c.JSON(http.StatusUnauthorized, result)
		c.Abort()
		return 
	}

	user_results := &UserResults{
		ID: auth.ID,
		Username: auth.Username,
		Email: auth.Email,
		Name: auth.Name,
		Token: auth.Token,
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"user":   user_results,
		"token": auth.Token,
	})
  }
