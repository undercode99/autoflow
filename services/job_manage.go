package services

import (
	db "app/database"
	log "github.com/sirupsen/logrus"
	"fmt"
	"time"
	"errors"
	"strconv"
	"encoding/json"
	"database/sql"

	
	// "strconv"

)


type OptionsStep struct{
	IfStepError string 
	TotalRetryError int 
	TimeSleep int 
	EnvVariable []string 
	WorkingDir string	
	Commands []string
	Timeout int
	StrictError bool
	SaveOutput bool
}

type OptionsJob struct {
	KeepLogsRunning int 
	UseErrorNotification string 
}


func GetEnvironmentData(userId uint, envType string, envName string) (*db.JobStepEnvs, error) {
	env := db.EnvRepository{}
	result, err := env.FirstByNameAndType(envName, envType)
	if err != nil{
		err = errors.New(fmt.Sprintf("Invalid, env name %s with type %s not found please create env first ",envName, envType ))
		return &db.JobStepEnvs{}, err
	}

	return result, nil

}

func BuildDataJob(name string, description string, category string, active uint,  yamlconfig string) (db.Jobs, error)  {

	// load data yaml
	data, err := LoadConfigYaml(yamlconfig)
	
	// error yaml
	if err != nil{
		return db.Jobs{}, err
	}


	// slice contains / in array
	slice_contains := func(slice []string, str string) bool{
		for _, n := range slice {
			if str == n {
				return true
			}
		}
		return false
	}

	
	// converting string to int
	convertStringToInt := func (value string)( int, error){
		var result_value int
		if value == "" {
			result_value = 0
		}else{
			convert, err := strconv.Atoi(value)
			if err != nil{
				return 0, err
			}
			result_value = convert
		}
		return result_value, nil
	}


	step_type_valid :=  []string{"ssh", "sh", "postgres"}

	var stepData []db.JobSteps
	var numberStep uint

	numberStep = 0

	for _, step := range data.Step {
		numberStep += 1
		optionsStep := &OptionsStep{}
		jobSteps := db.JobSteps{}

		if step.Type == "" {
			step.Type = "sh"
		}

		if slice_contains(step_type_valid, step.Type) == false {
		   err = errors.New(fmt.Sprintf("Invalid step name %s key type %s not support",step.Name, step.Type ))
		   return db.Jobs{}, err
		}

		if step.Type != "" && step.Env == ""{
			err = errors.New(fmt.Sprintf("Invalid step name %s key type %s, must have key env ",step.Name, step.Type ))
			return db.Jobs{}, err
		}

		if step.Type != "" && step.Env != ""{
			resultEnv, err := GetEnvironmentData(1, step.Type, step.Env)
			if err != nil{
				return db.Jobs{}, err
			}
			// jobSteps.JobStepEnvs = resultEnv
			jobSteps.JobStepEnvsId = sql.NullString{String: fmt.Sprintf("%d",resultEnv.ID), Valid: true}
		}

		timeSleep, err := convertStringToInt(step.TimeSleep)
		if err != nil{
			err = errors.New(fmt.Sprintf("Invalid, key time_sleep %s step name %s ",step.TimeSleep, step.Name ))
			return db.Jobs{}, err
		}

		totalRetryError, err := convertStringToInt(step.TotalRetryError)
		if err != nil{
			err = errors.New(fmt.Sprintf("Invalid, key total_retry_error %s step name %s ",step.TotalRetryError, step.Name ))
			return db.Jobs{}, err
		}

		timeOutExecution, err := convertStringToInt(step.Timeout)
		if err != nil{
			err = errors.New(fmt.Sprintf("Invalid, key timeout %s step name %s ",step.Timeout, step.Name ))
			return db.Jobs{}, err
		}


		if step.IfStepError == "" {
			step.IfStepError = "break"
		}


		optionsStep.SaveOutput = true
		if step.SaveOutput == "false"{
			optionsStep.SaveOutput = false
		}

		optionsStep.TimeSleep = timeSleep
		optionsStep.TotalRetryError = totalRetryError
		optionsStep.IfStepError = step.IfStepError
		optionsStep.EnvVariable = step.EnvVariable
		optionsStep.WorkingDir = step.WorkingDir
		optionsStep.Commands = step.Commands
		optionsStep.Timeout = timeOutExecution
		optionsStep.StrictError = step.StrictError

		jsonOptions, err := json.Marshal(optionsStep)
		jobSteps.Type = step.Type
		jobSteps.Name = step.Name
		jobSteps.NumberStep = numberStep
		jobSteps.OptionsStep = string(jsonOptions)


		stepData = append(stepData, jobSteps)

	}

	if err != nil{
		return db.Jobs{}, err
	}

	var jobSchedules []db.JobSchedules
	
	for _, schedule := range data.Schedule{
		err := CheckConfigSchedule(schedule)
		if err != nil{
			return db.Jobs{}, err
		}
		jobSchedules = append(jobSchedules,db.JobSchedules{Schedule: schedule})
	}


	if data.UseErrorNotification != ""{
		env := db.EnvRepository{}
		_, err := env.FirstByNameAndType(data.UseErrorNotification, "notification/telegram")
		if err != nil{
			err = errors.New(fmt.Sprintf("Invalid, notification with name %s not found please create environment notification first ",data.UseErrorNotification))
			return db.Jobs{}, err
		}
	}

	keepLogsRunning, err := convertStringToInt(data.KeepLogsRunning)
	if err != nil{
		err = errors.New(fmt.Sprintf("Invalid, key keep_logs_running with value '%s', value must a number ",data.KeepLogsRunning ))
		return db.Jobs{}, err
	}

	optionsJob := &OptionsJob{
		UseErrorNotification: data.UseErrorNotification,
		KeepLogsRunning: keepLogsRunning,
	}

	jsonOptions, err := json.Marshal(optionsJob)
	if err != nil{
		return db.Jobs{}, err
	}


	job := db.Jobs{
		Name: name,
		Active: active,
		Category: category,
		Description : description,
		JobSteps: stepData,
		Options: string(jsonOptions),
		TmpConfigYaml: yamlconfig,
		JobSchedules: jobSchedules,
	}

	return job, nil

}


func CreateNewJobFromYamlConfig(name string, description string, category string, active uint, yamlconfig string) (db.Jobs, error) {

	job, err := BuildDataJob(name, description, category, active,  yamlconfig)
	
	if err != nil{
		return db.Jobs{}, err
	}

	repo := db.JobRepository{}
	err = repo.Create(&job)
	
	if err != nil{
		return db.Jobs{}, err
	}

	log.Info("Updated jobs id:",job.ID)

	err = CreateQueueSchedule(job.ID)
	if err != nil{
		return db.Jobs{}, err
	}

	return job, nil
}

// func DeleteSteps(jobId uint) error{
// 	repo := db.JobRepository{}
// 	repo.InitConnection()
// 	errUpdate := repo.Db.Where("jobs_id = ?", jobId).Delete(&db.JobSteps{})
// 	if errUpdate.Error != nil{
// 		return errUpdate.Error
// 	}
// 	return nil
// }

func UpdateJobFromYamlConfig(id uint, name string, description string, category string, active uint,  yamlconfig string) (db.Jobs, error){

	job, err := BuildDataJob(name, description, category, active,  yamlconfig)
	if err != nil{
		return db.Jobs{}, err
	}

	// job update
	repo := db.JobRepository{}
	repo.UpdateJobById(id, &job)
	if err != nil{
		return db.Jobs{}, err
	}
	log.Infof("Updated jobs id:%d updated id: %d",id,job.ID)

	// update queue
	err = CreateQueueSchedule(id)
	if err != nil{
		return db.Jobs{}, err
	}

	return job, nil

}

func CreateQueueSchedule(jobId uint) error {
	repo := db.JobRepository{}
	err := repo.CreateQueueSchedule(jobId)
	if err != nil{
		return err
	}
	return nil
}

func DeleteJob(jobId uint) error {
	repo := db.JobRepository{}
	err  := repo.DeleteById(&db.Jobs{},jobId)
	if err != nil{
		return err
	}
	
	err = CreateQueueSchedule(jobId)

	if err != nil{
		return err
	}
	return nil

}

// func FetchOneJobById(jobId uint) (db.Jobs, error) {
// 	repo := db.JobRepository{}
// 	job := db.Jobs{}
// 	_, err := repo.First(&job, jobId)
// 	if err != nil{
// 		return db.Jobs{},err
// 	}
// 	return job,nil
// }


// type StepCommand struct {
// 	Name string `json:"name"`
// 	Commands []string `json:"commands"`
// 	BreakError string `json:"break_error"`
// 	WorkingDir string `json:"working_dir"`
// 	TypeCommand string `json:"type"`
// 	SshCredentials SshCredential `json:"ssh_credential"`
// 	TimeSleep time.Duration `json:"time_sleep"`
// }

func FetchGetJobForScheduler() ([]JobParameter, error) {
	jobFetchAll := []db.Jobs{}

	repo := db.JobRepository{}
	repo.InitConnection()
	results := repo.Db.Where("active = ?", "1").Find(&jobFetchAll)

	if results.Error != nil{
		return []JobParameter{},results.Error
	}
	var jobParams []JobParameter

	for _,job := range jobFetchAll{
		jobParam, err := GetJobForScheduler(job.ID)
		if err != nil {
			return []JobParameter{}, err
		}
		jobParams = append(jobParams, jobParam)
	}
	return jobParams, nil
}

func GetJobForScheduler(jobId uint) (JobParameter, error) {

	repo := db.JobRepository{}
	jobFetch := db.Jobs{}

	_, err := repo.WhereFind(jobId, &jobFetch)
	if err != nil{
		return JobParameter{},err
	}

	if err != nil{
		return JobParameter{},err
	}

	var fetchJobStep []db.JobSteps
	_, err = repo.FindBy(&db.JobSteps{JobsId: jobId}, &fetchJobStep)
	if err != nil{
		return JobParameter{},err
	}

	var jobSteps []StepCommand
	for _, step := range fetchJobStep{
		
		var optionsStep OptionsStep
		err := json.Unmarshal([]byte(step.OptionsStep), &optionsStep)
		if err != nil{
			return JobParameter{},err
		}

		dataEnv := "{}"

		if step.JobStepEnvsId.Valid {
			v, _ := step.JobStepEnvsId.Value() 
			envId := fmt.Sprint(v)
			u64, err := strconv.ParseUint(envId,10, 32)
			if err != nil{
				return JobParameter{},err
			}
			_, err = repo.First(&step.JobStepEnvs,uint(u64))
			if err != nil{
				return JobParameter{},err
			}
			dataEnv = step.JobStepEnvs.Options
		}

		jobStep := StepCommand{
			StepId: step.ID,
			Name: step.Name,
			TypeCommand: step.Type,
			WorkingDir: optionsStep.WorkingDir,
			TimeSleep: time.Duration(optionsStep.TimeSleep),
			Env: dataEnv,
			Commands: optionsStep.Commands,
			EnvVariable: optionsStep.EnvVariable,
			IfStepError: optionsStep.IfStepError,
			TotalRetryError: optionsStep.TotalRetryError,
			StrictError: optionsStep.StrictError,
			SaveOutput: optionsStep.SaveOutput,
			JobStepEnvsId: step.JobStepEnvsId,
		}

		jobSteps = append(jobSteps, jobStep)
	}

	var schedules []string
	_, err = repo.FindBy(&db.JobSchedules{JobsId: jobId}, &jobFetch.JobSchedules)
	if err != nil{
		return JobParameter{}, err
	}
	for _,jobSchedule := range jobFetch.JobSchedules {
		schedule := jobSchedule.Schedule
		schedules = append(schedules,schedule)
	}

	var opj OptionsJob

	json.Unmarshal([]byte(jobFetch.Options), &opj)

	job := JobParameter{
		JobId: fmt.Sprint(jobId),
		JobIdUint: jobId,
		Active: jobFetch.Active,
		JobName: jobFetch.Name,
		Description: jobFetch.Description,
		OptionsJob: opj,
		StepCommands: jobSteps,
		Schedule:schedules,
	}
	return job, nil
}



func GetAllJob(limit int, offset int, sort string, nameLike string, running_status string) ([]db.Jobs,int64, error){
	r := db.JobRepository{}
	r.InitConnection()
	var jobs []db.Jobs

	results := r.Db.Limit(limit).Offset(offset).Order(sort).Model(&db.Jobs{}).Where("name LIKE ?", "%"+nameLike+"%")

	if running_status == "error"{
		results = results.Where("status_last_running", 8)
	}else if running_status == "success"{
		results = results.Where("status_last_running", 1)
	}
	results = results.Find(&jobs)

	if results.Error != nil{
		return []db.Jobs{},0, results.Error
	}
	var count int64
	r.Db.Model(&db.Jobs{}).Where("name LIKE ?", "%"+nameLike+"%").Count(&count)
	
	return jobs,count, nil
}



func GetJobById(id uint)(db.Jobs, error){
	r := db.Repository{}
	job := db.Jobs{}
	_, err := r.First(&job, id)
	if err != nil{
		return db.Jobs{}, err
	}
	return job, nil

}


func GetOptionsEnvById( id string ) (string,error){
	repo := db.Repository{}
	envId := fmt.Sprint(id)
	u64, err := strconv.ParseUint(envId,10, 32)
	if err != nil{
		return "{}",err
	}
	var env db.JobStepEnvs
	_, err = repo.First(&env,uint(u64))
	if err != nil{
		return "{}",err
	}
	return env.Options, nil
}




func GetOptionsEnvByName( name string ) (string,error){
	repo := db.Repository{}
	repo.InitConnection()
	var env db.JobStepEnvs
	err := repo.Db.Where("name = ?", name).First(&env).Error
	if err != nil{
		return "{}",err
	}
	return env.Options, nil
}