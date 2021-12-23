package api

import (
	s "app/services"
	"github.com/gin-gonic/gin"
	"net/http"
	"fmt"
	"compress/gzip"

	"bytes"


	// log "github.com/sirupsen/logrus"

)

// type TestDelete struct {
// 	ID   uint `uri:"id" binding:"required"`
// }

// func ApiTestDelete(c *gin.Context){
// 	var testDelete TestDelete
	
// 	if err := c.ShouldBindUri(&testDelete); err != nil {
// 		c.JSON(400, gin.H{"msg": err})
// 		return
// 	}

// 	log.Info(testDelete.ID)
// 	s.DeleteJobById(testDelete.ID)
// }


// func ApiTestCreate(c *gin.Context){
// 	s.CreateJobTestWithStep()
// }




type Job struct {
	Name string `json:"name"`
	Category string `json:"category"`
	Description string `json:"description"`
	Active uint `json:"active"`
	Code string `json:"code"`
}

// POST: /job/create 
func CreateJobController(c *gin.Context){
	_, err := JwtVerified(c)
	if err != nil{
		return 
	}

	var j Job
	if err := c.ShouldBindJSON(&j); err != nil {
	   c.JSON(http.StatusUnprocessableEntity,gin.H{
		   "status": "error",
		   "message":  "Invalid json provided",
	   })
	   return
	}
	data, err := s.CreateNewJobFromYamlConfig(j.Name,j.Description,  j.Category, j.Active, j.Code)
	if err != nil{
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"status": "error",
			"message":  err.Error(),
		})
		return
	}

	result := gin.H{
		"status": "success",
		"message": "Success created a job pipeline",
		"job_id": data.ID,
		"jobs": data,
	}
	c.JSON(http.StatusOK, result)

}



type ParamId struct {
	ID uint `uri:"id" binding:"required"`
}

// PATCH: /job/id
func UpdateJobController(c *gin.Context){
	_, err := JwtVerified(c)
	if err != nil{
		return 
	}

	var pp ParamId
	if err := c.BindUri(&pp); err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	var j Job
	if err := c.ShouldBindJSON(&j); err != nil {
	   c.JSON(http.StatusUnprocessableEntity,gin.H{
		   "status": "error",
		   "message":  "Invalid json provided",
	   })
	   return
	}
	data, err := s.UpdateJobFromYamlConfig(pp.ID, j.Name,j.Description, j.Category, j.Active, j.Code)
	if err != nil{
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"status": "error",
			"message":  err.Error(),
		})
		return
	}

	result := gin.H{
		"status": "success",
		"message": "Success created a job pipeline",
		"job_id": data.ID,
		"jobs": data,
	}
	c.JSON(http.StatusOK, result)
}


// DELETE: /job/id
func DeleteJobController(c *gin.Context){

	_, err := JwtVerified(c)
	if err != nil{
		return 
	}


	var pp ParamId
	if err := c.BindUri(&pp); err != nil {
		c.Status(http.StatusBadRequest)
		return
	}
	fmt.Println(pp.ID)
	err = s.DeleteJob(pp.ID)
	if err != nil{
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Failed delete job pipeline"})
		return
	}

	result := gin.H{
		"status": "success",
		"message": "Success delete job pipeline",
		"job_id": pp.ID,
	}

	c.JSON(http.StatusOK, result)

}


func FirstJobController(c *gin.Context){
	_, err := JwtVerified(c)
	if err != nil{
		return 
	}
	var pp ParamId
	if err := c.BindUri(&pp); err != nil {
		c.Status(http.StatusBadRequest)
		return
	}
	data, err := s.GetJobById(pp.ID)
	if err != nil{
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Job ID invalid"})
		return
	}
	result := gin.H{
		"status": "success",
		"message": "Success",
		"job": data,
	}
	c.JSON(http.StatusOK, result)
}


type QueryJobList struct {
	Limit int    `json:"limit" form:"limit"`
	Page  int    `json:"page" form:"page"`
	Sort  string `json:"sort" form:"sort"`
	Query string `json:"query" form:"query"`
	StatusRunning string `json:"status_running" form:"status_running"`
}

type ResultPaginate struct {
	Limit int    `json:"limit"`
	Page  int    `json:"page"`
	Sort  string `json:"sort"`
	Offest int `json:"offset"`
	NextPage  int `json:"next_page"`
	PrevPage  int `json:"prev_page"`
	Count  int `json:"count"`
	HasNext  bool `json:"has_next"`
	HasPrev  bool `json:"has_prev"`
}

// GET: /jobs
func ListJobController(c *gin.Context){

	_, err := JwtVerified(c)
	if err != nil{
		return 
	}

	filter := QueryJobList{
		Limit: 6,
		Page: 1,
		Sort: "id desc",
		StatusRunning: "all",
	}
	c.Bind(&filter)
	offset := (filter.Page - 1) * filter.Limit

	

	data,count, err := s.GetAllJob(filter.Limit, offset, filter.Sort, filter.Query, filter.StatusRunning)
	if err != nil{
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"status": "error",
			"message":  err.Error(),
		})
		return
	}

	hasNext := false
	nextPage := 0
	if offset+filter.Limit < int(count) && filter.Limit <= int(count){
		hasNext = true
		nextPage = filter.Page + 1
	}
	hasPrev := false
	prevPage := 0
	if offset != 0{
		hasPrev = true
		prevPage = filter.Page - 1
	}

	result := gin.H{
		"status": "success",
		"jobs": data,
		"paginate": ResultPaginate{
			Limit: filter.Limit,
			Page: filter.Page,
			Sort: filter.Sort,
			Offest: offset,
			NextPage: nextPage,
			PrevPage: prevPage,
			Count: int(count),
			HasPrev: hasPrev,
			HasNext: hasNext,
		},
	}
	c.JSON(http.StatusOK, result)
}




// GET: /job/<id>/logs
func ListLogsRunningJobController(c *gin.Context){
	_, err := JwtVerified(c)
	if err != nil{
		return 
	}
	var pp ParamId
	if err := c.BindUri(&pp); err != nil {
		c.Status(http.StatusBadRequest)
		return
	}
	data, err:=s.GetLogsByIdJobs(pp.ID)
	if err != nil{
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"status": "error",
			"message":  err.Error(),
		})
		return
	}
	result := gin.H{
		"status": "success",
		"logs_running": data,
	}
	c.JSON(http.StatusOK, result)
}



type RawLogsParam struct {
	ID string `uri:"id" binding:"required"`
}

// GET: /job/1/raw-logs
func DetailRawLogsRunningJobController(c *gin.Context){
	_, err := JwtVerified(c)
	if err != nil{
		return 
	}
	var p_raw RawLogsParam
	if err := c.BindUri(&p_raw); err != nil {
		c.Status(http.StatusBadRequest)
		return
	}
	data , err := s.GetRawsLogsByIdRunning(p_raw.ID)
	if err != nil{
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"status": "error",
			"message":  err.Error(),
		})
		return
	}
	
	result := gin.H{
		"status": "success",
		"logs_running": data,
	}
	c.JSON(http.StatusOK, result)

}

// POST: /job/<id>/running
func StartTestRunningJobController(c *gin.Context){

}



type RawLogsDownloadParam struct {
	ID uint `uri:"id" binding:"required"`
	Status int `uri:"status"`
}


func DownloadRawData(c *gin.Context){

	var rw RawLogsDownloadParam

	if err := c.BindUri(&rw); err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	buffer, err := s.GetRawLogsByRunningLogsId(rw.ID, rw.Status)
	if err != nil{
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"status": "error",
			"message":  err.Error(),
		})
		return
	}

	by, err := gzipFast(&buffer)

	w := c.Writer
	header := w.Header()
	header.Set("Content-Type", "application/octet-stream")
	c.Header("Content-Encoding", "gzip")
	c.Header("Content-Disposition",fmt.Sprintf("attachment; filename=LOG-%d-%d.log",rw.ID, rw.Status))
	c.Header("Vary", "Accept-Encoding")
	w.WriteHeader(http.StatusOK)
	w.Write(by)
	if f, ok := w.(http.Flusher); ok {
		f.Flush()
	}
}

func gzipFast(a *[]byte) ([]byte, error) {
	var b bytes.Buffer
	gz, _ := gzip.NewWriterLevel(&b, gzip.BestSpeed)
	if _, err := gz.Write(*a); err != nil {
		gz.Close()
		return []byte{}, err
	}
	gz.Close()
	return b.Bytes(), nil
}
