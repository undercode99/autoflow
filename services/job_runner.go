package services

import (
	"time"
	"fmt"
	"database/sql"
	"encoding/json"
	db "app/database"
	log "github.com/sirupsen/logrus"
	"github.com/satori/go.uuid"
)

// 
const (
	IS_IDLE = 4
	IS_WAITING = 3
	IS_RUNNING = 2
	IS_SUCCESS = 1
	IS_OUTPUT = 1
	IS_ERROR = 8
	
)

type StepCommand struct {
	StepId uint
	Name string
	Commands []string
	WorkingDir string
	TypeCommand string
	SshCredentials SshCredential
	Env string
	EnvVariable []string
	IfStepError string
	TotalRetryError int
	StrictError bool
	SaveOutput bool
	Timeout int
	TimeSleep time.Duration
	JobStepEnvsId sql.NullString
}

type JobParameter struct{
	JobId string
	JobIdUint uint
	JobName string 
	Description string
	Schedule []string
	StepCommands []StepCommand
	OptionsJob OptionsJob
	Active uint
	
}

func (job *JobParameter) StartJobRunning(){

	log.Infof("%s Starting ...\n", job.JobName)
	uuid := uuid.NewV4().String()

	if job.OptionsJob.KeepLogsRunning <= 0{
		job.OptionsJob.KeepLogsRunning = 10
	}

	defer ReduceJobRunning(job.JobIdUint, job.OptionsJob.KeepLogsRunning)

	var statusRunning uint 
	statusRunning = IS_SUCCESS

	jobStartTime := time.Now()
	jobManager := &RunningJobManager{JobsId: job.JobIdUint}
	jobManager.SetRunning()
	

	for _,step := range job.StepCommands{
		var statusStepJobRunning uint
		statusStepJobRunning = IS_SUCCESS
		step := &step
		runningManager := &RunningStepManager{
			JobsId: job.JobIdUint,
			JobStepsId: step.StepId,
			JobStepName: step.Name,
			RunnerId: uuid,
			JobName: job.JobName,
			UseErrorNotification: job.OptionsJob.UseErrorNotification,
		}

		runningManager.NewStartStepRunning(jobStartTime)


		log.Infof("%s Starting step job: %s, Type: %s\n", job.JobName,step.Name, step.TypeCommand)

		var err error

		
		runningManager.SaveLogRaw(IS_OUTPUT, "Running ID "+uuid)

		if step.TypeCommand == "sh"{
			err = step.RunLocalCommand(runningManager, job); 
			if err != nil && step.IfStepError == "break" {
				log.Infof("%s Process stopedd ...", job.JobName)
				// save log
				runningManager.SaveLogRaw(IS_OUTPUT, "Process stopedd ...")
				
				runningManager.StopStepRunning(IS_ERROR)
				statusRunning = IS_ERROR
				statusStepJobRunning =  IS_ERROR
				break
			}

		}else if step.TypeCommand == "ssh"{
			v, _ := step.JobStepEnvsId.Value()
			
			var envValue string
			envValue, err = GetOptionsEnvById(fmt.Sprint(v))
			if err != nil && step.IfStepError == "break"{
				runningManager.SaveLogRaw(IS_ERROR, "Env Error:  "+err.Error())
				runningManager.SaveLogRaw(IS_OUTPUT, "Step process stopedd ...")
				runningManager.StopStepRunning(IS_ERROR)
				statusRunning = IS_ERROR
				statusStepJobRunning =  IS_ERROR
				break
			}

			step.Env = envValue
			err = step.SshCommands(runningManager, job)
			if err != nil && step.IfStepError == "break" {
				log.Infof("%s Step process stopedd ...", job.JobName)
				// save log
				runningManager.SaveLogRaw(IS_OUTPUT, "Step process stopedd ...")
				runningManager.StopStepRunning(IS_ERROR)
				statusRunning = IS_ERROR
				statusStepJobRunning =  IS_ERROR
				break
			}
		}

		
		if err != nil{
			log.Errorf("%s Step job: %s is error continue next step",job.JobName, step.Name)
			// save log
			runningManager.SaveLogRaw(IS_ERROR, "Step error but process is continue...")
			
			statusRunning = IS_ERROR
			statusStepJobRunning =  IS_ERROR
		}else{
			message := "Step process done & success ..."
			
			// save log
			runningManager.SaveLogRaw(IS_SUCCESS, message)

			log.Info(job.JobName, message)
		}

		runningManager.StopStepRunning(statusStepJobRunning)

		if step.TimeSleep != 0 {
			log.Infof("%s Waiting.. %ds for next step job",job.JobName, step.TimeSleep)
			time.Sleep(200 * time.Millisecond)
			// save log
			runningManager.SaveLogRaw(IS_OUTPUT, fmt.Sprintf("Waiting.. %ds for next step job",step.TimeSleep))
			time.Sleep(step.TimeSleep * time.Second)
		}

	}

	jobManager.SetFinish(statusRunning)
	
}

type RunningJobManager struct {
	JobsId uint
	
}

func (j *RunningJobManager) SetRunning(){
	repo := db.Repository{}
	err := repo.Update(&db.Jobs{ID: j.JobsId},&db.Jobs{
		LastRunning: db.SqlNullTime(time.Now()),
		StatusRunning: IS_RUNNING,
	})
	if err != nil{
		log.Error(err)
	}
}

func (j *RunningJobManager) SetFinish(status uint){
	repo := db.Repository{}
	err := repo.Update(&db.Jobs{ID: j.JobsId},&db.Jobs{
		StatusLastRunning: status,
		StatusRunning: IS_IDLE,
	})
	if err != nil{
		log.Error(err)
	}
}


type RunningStepManager struct {
	JobsId uint
	JobName string
	JobStepsId uint
	RunningId uint
	JobStepName string
	RunnerId string
	UseErrorNotification string
	ErrorNotificationTelegram ErrorNotificationTelegram
}

type ErrorNotificationTelegram struct{
	Token string `json:"token"`
	TelegramIds []int64 `json:"telegram_ids"`
}

func (l *RunningStepManager) InitUseNotification() error {
	if l.UseErrorNotification !=  ""{
		results,err := GetOptionsEnvByName(l.UseErrorNotification)
		if err != nil{
			return err
		}
		err = json.Unmarshal([]byte(results), &l.ErrorNotificationTelegram)
	}
	return nil
}

func (l *RunningStepManager) SendErrorNotificationTelegram(message string){
	if l.ErrorNotificationTelegram.Token != ""{
		message = fmt.Sprintf("[%s][%s] %s",l.JobName, l.JobStepName, message)
		TelegramSendMessage(message, l.ErrorNotificationTelegram.Token, l.ErrorNotificationTelegram.TelegramIds)
	}
}

func (l *RunningStepManager ) NewStartStepRunning(startJobRunning time.Time) error {

	err := l.InitUseNotification()
	if err != nil{
		return err
	}

	data := db.JobLogsRunning{
		JobsId : l.JobsId,
		JobStepsId: l.JobStepsId,
		JobStepName: l.JobStepName,
		RunningId:  l.RunnerId,
		TimeStepStart: db.SqlNullTime(time.Now()),
		TimeJobStart:  db.SqlNullTime(startJobRunning),
		Status: IS_RUNNING,
	}
	repo := db.Repository{}
	err = repo.Create(&data)
	if err != nil{
		return err
	}
	l.RunningId = data.ID
	return nil
}



func (l *RunningStepManager ) StopStepRunning(status uint) error {
	repo := db.Repository{}
	now := db.SqlNullTime(time.Now())
	err := repo.Update(&db.JobLogsRunning{ID: l.RunningId},&db.JobLogsRunning{
		Status: status,
		TimeStepFinish: now,
		TimeJobFinish: now,
	})
	if err != nil{
		return err
	}

	repo.InitConnection()
	err = repo.Db.Model(&db.JobLogsRunning{}).Where("running_id = ?", l.RunnerId).Update("time_job_finish", now).Error
	if err != nil{
		return err
	}

	return nil
}

func (l *RunningStepManager ) SaveLogRaw(status uint, logMessage string) error {
	repo := db.Repository{}

	if status == IS_ERROR {
		go l.SendErrorNotificationTelegram(logMessage)
	}
	
	go repo.Create(&db.JobRawsLog{
		JobLogsRunningId : l.RunningId,
		Status: status,
		RawLog: logMessage,
		Timestamps: time.Now(),
	})
	return nil
}