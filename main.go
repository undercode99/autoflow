package main

import (
	"app/services"
	"app/api"
	"github.com/gin-gonic/gin"
	"app/lib"
	"net/http"
	"github.com/joho/godotenv"
	db "app/database"
	log "github.com/sirupsen/logrus"
)
 
func CORSMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
        c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
        c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }

        c.Next()
    }
}

func main(){

	err := godotenv.Load()
	if err != nil {
	  log.Fatal("Error loading .env file")
	}
	
	log.SetFormatter(&log.TextFormatter{FullTimestamp: true})

	db.InitialDatabase()

	r := gin.Default()
	r.Use(CORSMiddleware())
	
	go services.StartScheduler()

	r.Use(lib.Serve("/", lib.LocalFile("./ui/build", true)))

	apiv1 := r.Group("/api")
	{
		apiv1.POST("/login", api.AuthLogin)
		apiv1.POST("/create-job", api.CreateJobController)
		apiv1.GET("/jobs", api.ListJobController)
		apiv1.GET("/job/:id", api.FirstJobController)
		apiv1.PUT("/job/:id", api.UpdateJobController)
		apiv1.DELETE("/job/:id", api.DeleteJobController)
	
		apiv1.GET("/job/:id/logs", api.ListLogsRunningJobController)
		apiv1.GET("/job/:id/raw-logs", api.DetailRawLogsRunningJobController)
		apiv1.GET("/job/:id/download-raws/:status", api.DownloadRawData)
	
		apiv1.GET("/env", api.GetStepJobEnvs)
		apiv1.GET("/env/:id", api.FirstStepJobEnv)
		apiv1.POST("/env", api.CreateNewStepJobEnv)
		apiv1.PUT("/env/:id", api.UpdateStepJobEnv)
		apiv1.DELETE("/env/:id", api.DeleteStepJobEnv)
		apiv1.GET("/userinfo", api.Auth)
	}

	r.LoadHTMLFiles("./ui/build/index.html")

	r.NoRoute(func(c *gin.Context) {
		c.HTML(
		  http.StatusOK,
		  "index.html",
		  gin.H{},
		)
	  })

	r.Run() 
}
