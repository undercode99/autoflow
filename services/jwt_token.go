
package services

import (
	"fmt"
	"time"
	"strconv"
	jwt "github.com/dgrijalva/jwt-go"
)

type JwtToken struct{
	Token string
	SecretKey string
}

func (j *JwtToken) ValidateToken() (*jwt.Token, error){

	token, err := jwt.Parse(j.Token, func(token *jwt.Token) (interface{}, error) {
		if jwt.GetSigningMethod("HS256") != token.Method {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(j.SecretKey), nil
	})

	if err != nil {
		return &jwt.Token{}, err
	}

	if _, ok := token.Claims.(jwt.Claims); !ok && !token.Valid {
		return &jwt.Token{}, err
	 }

	return token, nil
}


func (j *JwtToken)  GetDataPayloadUserId() (uint64, error) {
	token, err := j.ValidateToken()

	if err != nil {
	   return 0, err
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if ok && token.Valid {
	   if !ok {
		  return 0, err
	   }
	   userId, err := strconv.ParseUint(fmt.Sprintf("%.f", claims["user_id"]), 10, 64)
	   if err != nil {
		  return 0, err
	   }
	   return userId, nil
	}
	return 0, err
}


func (j *JwtToken) GenerateToken(userId uint) (error) {
	var err error
	atClaims := jwt.MapClaims{}
	atClaims["authorized"] = true
	atClaims["user_id"] = userId
	atClaims["exp"] = time.Now().Add(time.Hour * 48).Unix()
	at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
	token, err := at.SignedString([]byte(j.SecretKey))
	
	if err != nil {
	   return err
	}

	j.Token = token
	return nil
}
