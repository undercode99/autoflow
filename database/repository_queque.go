
package database
import "gorm.io/gorm"

type QueueRepository struct {
	Repository
}

func (r *QueueRepository) All(queue *[]JobQueuesSchedule) (*gorm.DB,error) {
	r.InitConnection()

	results := r.Db.Find(queue)
	return results, results.Error
}


