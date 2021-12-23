package services
import (
	db "app/database"
	// "time"
	"bytes"
	"math"
	"fmt"
)


type LogsRunning struct {
	ID uint `json:"id"`
	Status uint `json:"status"`
	RunningAt string `json:"running_at"`
	ElapsedTime string `json:"elapsed_time"`
	RunningId string `json:"running_id"`
	Sort int
}

func Round(x, unit float64) float64 {
    return math.Round(x/unit) * unit
}

func GetLogsByIdJobs(jobsid uint) ([]LogsRunning, error)  {
	r := db.Repository{}
	r.InitConnection()

	job_logs := []db.JobLogsRunning{}

	running_logs := []LogsRunning{}

	err := r.Db.Order("time_job_start desc").Where(db.JobLogsRunning{ JobsId: jobsid}).Find(&job_logs).Error
	if err != nil{
		return  []LogsRunning{}, err
	}

	runner_id := map[string]LogsRunning{}
	no := 0
	for _, logs := range job_logs {
		t := logs.TimeJobStart.Time
		running_at  := t.Format("2 Jan 2006 15:04:05")
		
		diff := logs.TimeJobFinish.Time.Sub(logs.TimeJobStart.Time)

		ep := fmt.Sprintf("%.2fs",diff.Seconds())
		if diff.Seconds() <= -1{
			ep = "-"
		}
		no = no + 1

		running_log := LogsRunning{
			ID: jobsid,
			RunningId: logs.RunningId,
			RunningAt: running_at,
			ElapsedTime: ep,
			Sort: no,
		}

		if runner_id[logs.RunningId].Status == 8 {
			running_log.Status = 8
		}else if runner_id[logs.RunningId].Status == 1 && logs.Status == 2{
			running_log.Status= 2
		}else{
			running_log.Status= logs.Status
		}

		runner_id[logs.RunningId] = running_log
	}

	for _, logs2 := range runner_id{
		running_logs = append(running_logs, logs2)
	}

	return running_logs, nil
}



func ReduceJobRunning(jobsid uint, max_total int) (error)  {
	r := db.Repository{}
	r.InitConnection()

	job_logs := []db.JobLogsRunning{}
	err := r.Db.Select("running_id, max(time_job_start) as time_job_start").Order("time_job_start desc").Group("running_id").Where(db.JobLogsRunning{ JobsId: jobsid}).Find(&job_logs).Error
	if err != nil{
		return err
	}
	no := 1
	for _, logs := range job_logs {
		no = no + 1
		if no > max_total{
			r.Db.Where("running_id = ?", logs.RunningId).Delete(&db.JobLogsRunning{})
		}
	}
	return nil
}



type RawLogsRunning struct {
	ID uint `json:"id"`
	Status uint `json:"status"`
	RunningAt string `json:"running_at"`
	ElapsedTime string `json:"elapsed_time"`
	RunningId string `json:"running_id"`
	JobStepName string `json:"job_step_name"`
	JobRawsLog []db.JobRawsLog
	Sort int
}


func GetRawsLogsByIdRunning(running_id string) ([]RawLogsRunning, error){
	r := db.Repository{}
	r.InitConnection()

	job_logs := []db.JobLogsRunning{}
	err := r.Db.Order("id asc").Where(db.JobLogsRunning{ RunningId: running_id}).Find(&job_logs).Error
	if err != nil{
		return []RawLogsRunning{}, err
	}
	new_job_logs := []RawLogsRunning{}
	for _, log := range job_logs{

		result := []db.JobRawsLog{}
		r.Db.Raw("SELECT * FROM (SELECT * FROM job_raws_logs WHERE job_logs_running_id = ? order by id desc limit 100) x order by id asc", log.ID).Scan(&result)
		log.JobRawsLog = result

		t := log.TimeJobStart.Time
		running_at  := t.Format("2 Jan 2006 15:04:05")

		diff := log.TimeStepFinish.Time.Sub(log.TimeStepStart.Time)

		ep := fmt.Sprintf("%.2fs",diff.Seconds())
		if diff.Seconds() <= -1{
			ep = "-"
		}

		new_job_log := RawLogsRunning{
			ID: log.ID,
			JobStepName: log.JobStepName,
			RunningAt : running_at,
			Status : log.Status,
			RunningId: log.RunningId,
			ElapsedTime: ep,
			JobRawsLog: result,
		}

		new_job_logs = append(new_job_logs, new_job_log)
	}

	return new_job_logs, nil
}


func GetRawLogsByRunningLogsId(id uint, status int) ([]byte,error) {
	r := db.Repository{}
	r.InitConnection()
	result := []db.JobRawsLog{}
	
	var err error

	// error
	if status == 8 {
		err = r.Db.Raw("SELECT * FROM job_raws_logs WHERE job_logs_running_id = ? and status=8 order by id asc", id).Scan(&result).Error

	// output
	}else if status == 1{
		err = r.Db.Raw("SELECT * FROM job_raws_logs WHERE job_logs_running_id = ? and status=1 order by id asc", id).Scan(&result).Error
	
	// all
	}else{
		err = r.Db.Raw("SELECT * FROM job_raws_logs WHERE job_logs_running_id = ? order by id asc", id).Scan(&result).Error
	}

	if err != nil{
		return []byte{},err
	}

	var buffer bytes.Buffer

	for _,item := range result{
		fmt.Println(item.Status, item.Timestamps, item.RawLog)
		tm := item.Timestamps.Format("2 Jan 2006 15:04:05")
		status := "OUTPUT"
		if item.Status == 8{
			status = "ERROR"
		}
		buffer.WriteString("["+tm+"] {"+status+"} "+item.RawLog+"\n")
	}
	return buffer.Bytes(), nil
}