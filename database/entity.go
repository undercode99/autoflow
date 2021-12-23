package database

import (
	"time"
	"database/sql"
)

type TimeStamps struct {
	CreatedAt time.Time
	UpdatedAt time.Time
}

type User struct {
	ID uint `gorm:"primaryKey"`
	Name string
	Username string `gorm:"unique"`
	Email string  `gorm:"unique"`
	Password string
	Photos string
	UserAuth string  `gorm:"default:local"`
	SuperUser bool
	Jobs []*Jobs `gorm:"many2many:user_job_permissions;"`
	LastLoginAt  sql.NullString
	TimeStamps
}

type UserJobPermission struct {
	ID uint `gorm:"primaryKey"`
	UserId uint `gorm:"primaryKey"`
	JobsId uint `gorm:"primaryKey"`
	Roles int // {3: owner, 2: write, 1: access}
}

// type UsersEnvPermission struct {
// 	UserId uint
// 	User User `gorm:"foreignKey:UserId"`
// 	JobStepEnvsId uint
// 	JobStepEnvs JobStepEnvs `gorm:"foreignKey:JobStepEnvsId"`
// 	Roles int // {2: write, 1: access}
// }

type Jobs struct {
	ID uint `gorm:"primaryKey"`
	Name string
	Active uint `gorm:"default:0"`
	Options string
	Description string
	Category string
	TmpConfigYaml string
	LastRunning sql.NullTime
	StatusLastRunning uint `gorm:"default:3"` // enum({0: "Error", 1: "Success", 3: "Waiting"})
	StatusRunning uint `gorm:"default:4"` // enum({4: "Idle", 2: "Running"})
	JobSteps []JobSteps `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	JobSchedules []JobSchedules `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	JobLogsRunning []JobLogsRunning `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Users []User `gorm:"many2many:user_job_permissions;"`
	TimeStamps
}

type JobSchedules struct {
	ID uint `gorm:"primaryKey"`
	JobsId uint
	Schedule string
	Jobs Jobs `gorm:"foreignKey:JobsId"`
	TimeStamps
}

type JobQueuesSchedule struct {
	ID uint `gorm:"primaryKey"`
	QueueJobsId uint
	TimeStamps
}

type JobSteps struct {
	ID uint `gorm:"primaryKey"`
	JobsId uint
	Jobs Jobs `gorm:"foreignKey:JobsId"`
	NumberStep uint
	Name string
	Type string `gorm:"default:sh"`
	JobStepEnvsId  sql.NullString
	JobStepEnvs *JobStepEnvs `gorm:"foreignKey:JobStepEnvsId"`
	OptionsStep string
	TimeStamps
}

type JobStepEnvs struct {
	ID uint `gorm:"primaryKey"`
	Name string `gorm:"unique"`
	Label string 
	Type string
	Options string
	TimeStamps
}

type JobLockTmpSchedule struct {
	ID uint `gorm:"primaryKey"`
	LockJobsId uint
	ScheduleRunningId string
	TimeStamps
}


type JobLogsRunning struct {
	ID uint `gorm:"primaryKey"`
	RunningId string
	JobsId uint
	Jobs Jobs `gorm:"foreignKey:JobsId"`
	JobStepName string
	JobStepsId uint
	Status uint // uname(2:Running, 1:Success, 0: Error)
	JobRawsLog []JobRawsLog `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	TimeJobStart sql.NullTime
	TimeJobFinish sql.NullTime
	TimeStepStart sql.NullTime
	TimeStepFinish sql.NullTime
	TimeStamps
}

type JobRawsLog struct {
	ID uint `gorm:"primaryKey"`
	JobLogsRunningId uint
	JobLogsRunning JobLogsRunning
	Status uint
	RawLog string
	Timestamps time.Time
}
