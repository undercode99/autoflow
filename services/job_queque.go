package services

import (
	db "app/database"
	// log "github.com/sirupsen/logrus"
)

type JobQueue struct {
	JobId uint
	Schedules []string
}

func FetchJobScheduleQueue() ([]JobQueue, error) {
	repo := db.QueueRepository{}

	queues := []db.JobQueuesSchedule{}
	_, err := repo.All(&queues)
	if err != nil {
		return []JobQueue{},err
	}

	var jobQueues []JobQueue

	for _, queue := range queues{
		job_repo := db.JobRepository{}
		result, err := job_repo.FindBy(db.Jobs{ID: queue.QueueJobsId}, &db.Jobs{})
		if err != nil {
			break
		}
		if result.RowsAffected == 0 {
			break
		}

		schedules := []db.JobSchedules{}
		_, err = repo.FindBy(db.JobSchedules{JobsId: queue.QueueJobsId},&schedules)
		if err != nil {
			break
		}
		jobQueue := JobQueue{
			JobId: queue.QueueJobsId,
		}
		for _,schedule := range schedules{
			jobQueue.Schedules = append(jobQueue.Schedules, schedule.Schedule)
		}

		jobQueues = append(jobQueues, jobQueue)
	}

	if err != nil {
		return []JobQueue{},err
	}

	err = RemoveAllJobScheduleQueue()

	if err != nil {
		return []JobQueue{},err
	}

	return  jobQueues,nil
}

func RemoveAllJobScheduleQueue() error {
	repo := db.QueueRepository{}
	_, err := repo.DeleteAll(&db.JobQueuesSchedule{})
	if err != nil {
		return err
	}
	return nil
}