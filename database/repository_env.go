package database

type EnvRepository struct {
	Repository
}

func (env *EnvRepository) FirstByNameAndType(name string, type_command string) (*JobStepEnvs, error){
	env.InitConnection()
	result := JobStepEnvs{}
	err := env.Db.Where(&JobStepEnvs{Name: name, Type: type_command}).First(&result)
	if err.Error != nil{
		return &JobStepEnvs{}, err.Error
	}
	return &result, nil
}



func (env *EnvRepository) All() ([]JobStepEnvs, error) {
	envjob := []JobStepEnvs{}
	env.InitConnection()
	if err := env.Db.Order("id desc").Find(&envjob).Error; err != nil {
		return []JobStepEnvs{}, err
	}
	return envjob, nil
}