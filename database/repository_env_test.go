package database


import (
	"testing"
)


func TestFirstByNameEnv(t *testing.T){

	InitialDatabase()
	
	env := EnvRepository{}
	results, err:= env.FirstByNameAndType("test_name", "ssh")
	if err != nil{
		panic(err)
	}
	t.Log(results.ID)
}


func TestCreateEnv(t *testing.T){

	InitialDatabase()
	
	env := EnvRepository{}
	err := env.Create(&JobStepEnvs{
		Name: "ssh-local",
		Label: "SSH Local",
		Type: "ssh",
		Options: `{
			"host" : "localhost",
			"username": "xxx",
			"password": "U5m@n4521",
			"port": "22"
}`,
	})
	
	if err != nil{
		panic(err)
	}
}

func TestDeleteEnv(t *testing.T){
	InitialDatabase()
	
	env := EnvRepository{}
	
	err := env.DeleteById(&JobStepEnvs{}, 4)
	if err != nil{
		panic(err)
	}
}
