package services
import "testing"


func TestGenerateToken(t *testing.T)  {
	jwtToken := &JwtToken{
		SecretKey: "example-secret-key",
	}
	if err := jwtToken.GenerateToken(10); err != nil{
		panic(err)
	}
	t.Log(jwtToken.Token)
}

func TestValidateToken(t *testing.T)  {
	JwtToken := &JwtToken{
		SecretKey: "example-secret-key",
		Token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JpemVkIjp0cnVlLCJleHAiOjE2MTgxNDgwMjQsInVzZXJfaWQiOjEwfQ.Rs7hsaSeIB4wG0SjFBhae4IhXECnLjBx1zq1lGIvDvU",
	}
	_, err := JwtToken.ValidateToken()
	if err != nil{
		panic(err)
	}
}

func TestErrorValidateToken(t *testing.T){
	JwtToken := &JwtToken{
		SecretKey: "example-secret-key-wrong",
		Token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JpemVkIjp0cnVlLCJleHAiOjE2MTgxNDgwMjQsInVzZXJfaWQiOjEwfQ.Rs7hsaSeIB4wG0SjFBhae4IhXECnLjBx1zq1lGIvDvU",
	}
	_, err := JwtToken.ValidateToken()
	if err == nil{
		panic("Not error")
	}
}

func TestGetDataPayloadUserId(t *testing.T)  {
	JwtToken := &JwtToken{
		SecretKey: "example-secret-key",
		Token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JpemVkIjp0cnVlLCJleHAiOjE2MTgxNDgwMjQsInVzZXJfaWQiOjEwfQ.Rs7hsaSeIB4wG0SjFBhae4IhXECnLjBx1zq1lGIvDvU",
	}
	id, err := JwtToken.GetDataPayloadUserId()
	if err != nil{
		panic(err)
	}

	t.Log("User ID", id)
}