package database
import (
	"time"
	"gorm.io/gorm"
	"database/sql"

)

type Repository struct{
	Db *gorm.DB
}

func (r *Repository) InitConnection(){
	if r.Db == nil{
		r.Db = GetConnection()
	}
}

func (r *Repository) Create(model interface{}) error {
	
	r.InitConnection()

	err := r.Db.Create(model)

	if err.Error != nil {
		return err.Error
	}
	return nil
}

func (r *Repository) DeleteById(model interface{}, id uint) error{
	
	r.InitConnection()

	err := r.Db.Delete(model, id)

	if err.Error != nil{
		return err.Error
	}

	return nil
}


func (r *Repository) Update(where interface{}, value interface{}) error {
	
	r.InitConnection()

	err := r.Db.Model(where).Updates(value)
	if err.Error != nil{
		return err.Error
	}
	return nil
}

func (r *Repository) UpdateAssociation(data interface{}) error {
	r.InitConnection()
	err := r.Db.Session(&gorm.Session{FullSaveAssociations: true}).Updates(data)
	if err.Error != nil{
		return err.Error
	}
	return nil
}

func (r *Repository) First(model interface{}, id uint) (*gorm.DB, error){
	r.InitConnection()
	results := r.Db.First(model, id)
	return results, results.Error
}



func (r *Repository) WhereFirst(where interface{}, model interface{}) (*gorm.DB, error){
	r.InitConnection()
	results := r.Db.Where(where).First(model)
	return results, results.Error
}


func (r *Repository) WhereFind(where interface{}, model interface{}) (*gorm.DB, error){
	r.InitConnection()
	results := r.Db.Where(where).Find(model)
	return results, results.Error
}


func (r *Repository) FindBy(where interface{},model interface{}) (*gorm.DB, error){
	r.InitConnection()
	results := r.Db.Where(where).Find(model)
	return results, results.Error
}

func (r *Repository) DeleteAll(model interface{})  (*gorm.DB, error) {
	r.InitConnection()
	results := r.Db.Session(&gorm.Session{AllowGlobalUpdate: true}).Delete(model)
	return results, results.Error

}

func SqlNullTime(tm time.Time) sql.NullTime {
	return sql.NullTime{Time: tm, Valid: true}
}