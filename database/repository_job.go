
package database
import "gorm.io/gorm"

type JobRepository struct {
	Repository
}

func (j *JobRepository) CreateQueueSchedule(jobId uint) error {
	
	j.InitConnection()

	jobQueue := JobQueuesSchedule{
		QueueJobsId: jobId,
	}
	err := j.Db.Create(&jobQueue)
	if err.Error != nil{
		return err.Error
	}
	return nil
}

func (j *JobRepository) UpdateJobById(jobId uint, job *Jobs) error {
	j.InitConnection()

	job.ID = jobId

	err  := j.Db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Delete(&JobSchedules{}, "jobs_id = ?", jobId).Error; err != nil{
			return err
		}
		if err := tx.Delete(&JobSteps{}, "jobs_id = ?", jobId).Error; err != nil{
			return err
		}
		if err := tx.Session(&gorm.Session{FullSaveAssociations: true}).Updates(job).Error ; err!= nil{
			return err
		}
		return nil
	})
	
	if err != nil{
		return err
	}
	return nil
}


func (j *JobRepository) All() ([]Jobs, error) {
	job := []Jobs{}
	j.InitConnection()
	if err := j.Db.Order("id desc").Find(&job).Error; err != nil {
		return []Jobs{}, err
	}
	return job, nil
}