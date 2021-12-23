package services

import (
	db "app/database"
	"github.com/robfig/cron/v3"
	// log "github.com/sirupsen/logrus"
	// "fmt"
	// "time"
	// "errors"
	// "strconv"
	"encoding/json"
	

)


func SaveNewRunnerId(jobId uint, listRunnerId []cron.EntryID) error{
	repo := db.Repository{}
	data, err := json.Marshal(listRunnerId)
	if err != nil{
		return err
	}
	err = repo.Create(&db.JobLockTmpSchedule{LockJobsId: jobId, ScheduleRunningId:string(data)})
	if err != nil{
		return err
	}
	return nil
}

func RemoveOldRunnerId(jobId uint) ([]cron.EntryID,error){

	
	jobLock := db.JobLockTmpSchedule{LockJobsId: jobId}
	repo := db.Repository{}
	var tmpLock []db.JobLockTmpSchedule
	_ ,err := repo.WhereFind(&jobLock, &tmpLock)
	if err != nil{
		return []cron.EntryID{}, err
	}
	var alllistRunnerId []cron.EntryID
	for _, lock := range tmpLock {
		var listRunnerId []cron.EntryID
		err = json.Unmarshal([]byte(lock.ScheduleRunningId),&listRunnerId)
		if err != nil{
			return listRunnerId, err
		}
		for _,sid := range listRunnerId{
			alllistRunnerId = append(alllistRunnerId, sid)
		}
	}
	err = repo.Db.Where("lock_jobs_id = ?",jobId).Delete(&jobLock).Error
	if err != nil{
		return  []cron.EntryID{}, err
	}
	return alllistRunnerId, nil
}



