package services

import (
	// "os"
	// "fmt"
	"sync"
	// "io/ioutil"
	"time"
	// "path/filepath"
	// "encoding/json"
	"github.com/robfig/cron/v3"
	log "github.com/sirupsen/logrus"
)



type SchedulerManager struct{
	activate map[string]bool
	mutex sync.RWMutex

}

func (s *SchedulerManager) SetRunning(JobId string){
	s.mutex.Lock()
	s.activate[JobId] = true
	s.mutex.Unlock()	
}


func (s *SchedulerManager) IsRunning(JobId string) bool{
	s.mutex.RLock()
	activate := s.activate[JobId]
	s.mutex.RUnlock()
	return activate
}

func (s *SchedulerManager) SetDone(JobId string){
	s.mutex.Lock()
	s.activate[JobId] = false
	s.mutex.Unlock()
}

func (s *SchedulerManager) Delete(JobId string){
	delete(s.activate, JobId)
}

type JobLogScheduler struct {
	JobId string `json:"job_id"`
	EntryId []cron.EntryID `json:"entry_id"`
}


type JobScheduler struct {
	c *cron.Cron
	JobId uint
}

func (job *JobScheduler) RemoveOldScheduler(){

	entryIds ,err := RemoveOldRunnerId(job.JobId)
	if err != nil{
		log.Error(err)
	}
	for _, removeEntryId := range entryIds{
		job.c.Remove(removeEntryId)
	}
}

func (job *JobScheduler) SaveNewLockTmpScheduler(NewlistEntryId []cron.EntryID){
	err := SaveNewRunnerId(job.JobId,NewlistEntryId)
	if err != nil{
		log.Error(err)
	}
}

func RegisterJobOnStartup(c *cron.Cron, s *SchedulerManager) error{
	jobs, err := FetchGetJobForScheduler()
	if err != nil{
		return err
	}

	
	// remove queue lock in first time startup
	err = RemoveAllJobScheduleQueue()

	for _, job := range jobs{
		jobScheduler := &JobScheduler{
			c: c,
			JobId: job.JobIdUint,
		}

		listEntryId := []cron.EntryID{}

		job, err := GetJobForScheduler(job.JobIdUint)
		if err != nil{
			log.Error(err)
			continue
		}

		for _, schedule := range job.Schedule{
			log.Info("Register :",schedule)
			entryId, err := c.AddFunc(schedule, func() {
				StartJobScheduler(s, &job) 
			})
			if err != nil{
				log.Error(err)
				continue
			}
			listEntryId = append(listEntryId, entryId)
		}

		jobScheduler.SaveNewLockTmpScheduler(listEntryId)
	}

	return nil
}


func HaveChangeScheduleQueue(c *cron.Cron, s *SchedulerManager){
	queues, err := FetchJobScheduleQueue()
	if err != nil{
		log.Error(err)
		return
	}
	for _, queue := range queues{

		jobScheduler := &JobScheduler{
			c: c,
			JobId: queue.JobId,
		}


		jobScheduler.RemoveOldScheduler()

		listEntryId := []cron.EntryID{}

		job, err := GetJobForScheduler(queue.JobId)
		
		
		if err != nil{
			log.Error(err)
			continue
		}

		if job.Active != 1 {
			log.Info(job.JobName, " => Inactive")
			continue
		}

		for _, schedule := range queue.Schedules{
			log.Info("Register :",schedule)
			entryId, err := c.AddFunc(schedule, func() {
				StartJobScheduler(s, &job) 
			})
			if err != nil{
				log.Error(err)
				continue
			}
			listEntryId = append(listEntryId, entryId)
		}
		jobScheduler.SaveNewLockTmpScheduler(listEntryId)
	}
}


func StartJobScheduler(schedule *SchedulerManager, job *JobParameter){
	if schedule.IsRunning(job.JobId) == true {
		return
	}

	schedule.SetRunning(job.JobId)
	defer schedule.SetDone(job.JobId)

	job.StartJobRunning()
}


func StartScheduler(){
	log.Info("Starting scheduler ..")

	s := &SchedulerManager{
		activate: make(map[string]bool),
	}
	c := cron.New()
	RegisterJobOnStartup(c,s)
	c.Start()
	
	for {
		time.Sleep(1 * time.Second)
		HaveChangeScheduleQueue(c, s)
	}
}


func CheckConfigSchedule(stringSchedule string) error {
	specParser := cron.NewParser(
		// 
		cron.Minute | cron.Hour | cron.Dom | cron.Month | cron.Dow | cron.Descriptor,
	)
	_,err := specParser.Parse(stringSchedule)
	if err != nil{
		return err
	}
	return nil
}