package api

import (
	s "app/services"
	"github.com/gin-gonic/gin"
	"net/http"
	// "fmt"
	// "compress/gzip"

	// "bytes"


	// log "github.com/sirupsen/logrus"

)


type StepJobEnv struct {
	Name string `json:"name"  binding:"required"`
	Label string `json:"label"`
	Type string `json:"type" binding:"required"`
	Options string `json:"options"  binding:"required"`
}

type StepJobEnvParamId struct {
	ID uint `uri:"id" binding:"required"`
}


func CreateNewStepJobEnv(c *gin.Context){
	_, err := JwtVerified(c)
	if err != nil{
		return 
	}

	var envJob StepJobEnv
	if err := c.ShouldBindJSON(&envJob); err != nil {
	   c.JSON(http.StatusUnprocessableEntity,gin.H{
		   "status": "error",
		   "message":  "Invalid json provided",
	   })
	   return
	}

	if err := s.CreateNewStepJobEnv(envJob.Name, envJob.Label, envJob.Type, envJob.Options); err != nil{
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"status": "error",
			"message":  err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"message": "Create new environment success",
	}) 
}
type UpdateStructStepJobEnv struct {
	Label string `json:"label"`
	Options string `json:"options"  binding:"required"`
}


func UpdateStepJobEnv(c *gin.Context){
	_, err := JwtVerified(c)
	if err != nil{
		return 
	}

	var paramId StepJobEnvParamId
	if err := c.BindUri(&paramId); err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	var envJob UpdateStructStepJobEnv
	if err := c.ShouldBindJSON(&envJob); err != nil {
	   c.JSON(http.StatusUnprocessableEntity,gin.H{
		   "status": "error",
		   "message":  "Invalid json provided",
	   })
	   return
	}

	if err := s.UpdateStepJobEnv(paramId.ID, envJob.Label, envJob.Options); err != nil{
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"status": "error",
			"message":  err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"message": "Update environment success",
	}) 

}

func FirstStepJobEnv(c *gin.Context){
	_, err := JwtVerified(c)
	if err != nil{
		return 
	}

	var paramId StepJobEnvParamId
	if err := c.BindUri(&paramId); err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	results, err := s.FirstJobStepEnvById(paramId.ID)
	if err != nil{
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"message": "Success",
		"data": results,
	})
}


func DeleteStepJobEnv(c *gin.Context){
	_, err := JwtVerified(c)
	if err != nil{
		return 
	}

	var paramId StepJobEnvParamId
	if err := c.BindUri(&paramId); err != nil {
		c.Status(http.StatusBadRequest)
		return
	}
	err = s.DeleteEnvById(paramId.ID)
	if err != nil{
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"message": "Delete Success",
	})

}

func GetStepJobEnvs(c *gin.Context){
	_, err := JwtVerified(c)
	if err != nil{
		return 
	}

	results, err := s.GetAllJobStepEnv()
	if err != nil{
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"message": "Success",
		"data": results,
	})
}