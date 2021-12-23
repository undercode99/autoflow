package services
import db "app/database"

func CreateNewStepJobEnv(name string, label string, envtype string, options string) error {
	env := db.EnvRepository{}
	err := env.Create(&db.JobStepEnvs{
		Name: name,
		Label: label,
		Type: envtype,
		Options: options,
	})

	if err != nil{
		return err
	}

	return nil
}


func UpdateStepJobEnv(id uint, label string, options string) error {
	env := db.EnvRepository{}
	env.InitConnection()

	err := env.Update(&db.JobStepEnvs{ID:id}, &db.JobStepEnvs{
		Label: label,
		Options: options,
	})
	if err != nil{
		return err
	}
	return nil
}

func FirstJobStepEnvById(id uint) (db.JobStepEnvs, error){
	env := db.EnvRepository{}
	resultEnv := db.JobStepEnvs{}
	_, err := env.FindBy(db.JobStepEnvs{ID:id} ,&resultEnv)
	if err != nil{
		return db.JobStepEnvs{},err
	}
	return resultEnv, nil
}

func GetAllJobStepEnv()  ([]db.JobStepEnvs, error) {
	r := db.EnvRepository{}
	env,err := r.All()
	if err != nil{
		return []db.JobStepEnvs{}, err
	}
	return env, nil
}


func DeleteEnvById(id uint) error {
	r := db.EnvRepository{}
	
	err := r.DeleteById(&db.JobStepEnvs{}, id)
	if err != nil{
		return err
	}
	
	return nil
}