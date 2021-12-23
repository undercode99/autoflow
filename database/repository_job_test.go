package database


import (
	"testing"
	"gorm.io/gorm"
)


func TestCreateJob(t *testing.T){

	InitialDatabase()
	
	repo := JobRepository{}

	job := Jobs{
		ID: 3,
		Name: "New Job With Cron every seconds",
		Active: 1,
		JobSteps: []JobSteps{
			JobSteps{
				NumberStep: 1,
				Name: "Create File",
			},
			JobSteps{
				NumberStep: 2,
				Name: "Send Success",
			},
		},
		JobSchedules: []JobSchedules{
			JobSchedules{
				Schedule: "@every 2s",
			},
			JobSchedules{
				Schedule: "@every 8s",
			},
		},
	}
	err := repo.Create(&job)
	if err != nil{
		t.Errorf("Error : %s", err)
	}
}


func TestCreateQueueSchedule(t *testing.T){
	
	InitialDatabase()

	repo := JobRepository{}

	job := Jobs{
		Name: "New Job With Cron every seconds",
		Active: 1,
		JobSteps: []JobSteps{
			JobSteps{
				NumberStep: 1,
				Name: "Create File",
			},
			JobSteps{
				NumberStep: 2,
				Name: "Send Success",
			},
		},
		JobSchedules: []JobSchedules{
			JobSchedules{
				Schedule: "@every 2s",
			},
			JobSchedules{
				Schedule: "@every 8s",
			},
		},
	}
	err := repo.Create(&job)

	if err != nil{
		t.Errorf("Error : %s", err)
	}

	err = repo.CreateQueueSchedule(job.ID)
	
	if err != nil{
		t.Errorf("Error : %s", err)
	}
}

func TestDeleteByIdJob(t *testing.T) {
	InitialDatabase()

	repo := JobRepository{}
 
	err := repo.DeleteById(&Jobs{}, 5)
	
	if err != nil{
		t.Errorf("Error : %s", err)
	}
	
}

func TestUpdateJob(t *testing.T){

	InitialDatabase()

	repo := &JobRepository{}
	repo.InitConnection()

	var job_id  uint 
	job_id = 1

	job := Jobs{
		ID: job_id,
		Name: "New Data baru",
		JobSchedules: []JobSchedules{
			JobSchedules{
				Schedule: "@schedule baru",
			},
		},
		JobSteps: []JobSteps{
			JobSteps{
				Name : "Step baru",
			},
		},
	}
	err  := repo.Db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Delete(&JobSchedules{}, "jobs_id = ?", job_id).Error; err != nil{
			return err
		}

		if err := tx.Delete(&JobSteps{}, "jobs_id = ?", job_id).Error; err != nil{
			return err
		}

		if err := tx.Session(&gorm.Session{FullSaveAssociations: true}).Updates(&job).Error ; err!= nil{
			return err
		}
		return nil
	})
	if err != nil{
		panic(err)
	}
}
