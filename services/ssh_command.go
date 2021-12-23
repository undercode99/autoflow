package services

import (
	"time"
	"errors"
	"strings"
	"app/lib"
	"encoding/json"
	log "github.com/sirupsen/logrus"
)

type SshCredential struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Host string	`json:"host"`
	Port string	`json:"port"`
}

func (step *StepCommand) SshCommands(r *RunningStepManager, job *JobParameter) error {

	var envs SshCredential

	err := json.Unmarshal([]byte(step.Env), &envs)
	if err != nil{
		r.SaveLogRaw(IS_ERROR, err.Error())
		return err
	}

	if step.WorkingDir != ""{
		step.WorkingDir = "cd "+step.WorkingDir+";"
	}

	envPathDefault := "PATH=\"$HOME/bin:$PATH\";PATH=\"$HOME/.local/bin:$PATH\";"
	cmd := envPathDefault+step.WorkingDir+strings.Join(step.Commands, "; ")
	
	if envs.Port == "" {
		envs.Port = "22"
	}

	ssh := &lib.MakeConfig{
		User:   envs.Username,
		Server: envs.Host,
		// Optional key or Password without either we try to contact your agent SOCKET
		Password: envs.Password,
		// Paste your source content of private key
		// Key: `-----BEGIN RSA PRIVATE KEY-----
		// MIIEpAIBAAKCAQEA4e2D/qPN08pzTac+a8ZmlP1ziJOXk45CynMPtva0rtK/RB26
		// 7XC9wlRna4b3Ln8ew3q1ZcBjXwD4ppbTlmwAfQIaZTGJUgQbdsO9YA==
		// -----END RSA PRIVATE KEY-----
		// `,
		// KeyPath: "/Users/username/.ssh/id_rsa",
		Port:    envs.Port,
		Timeout: 8640 * time.Hour,

		// Parse PrivateKey With Passphrase
		// Passphrase: password,
	}

	HAS_STD_ERROR := false
	
	message := "Start login ssh .."
	r.SaveLogRaw(IS_SUCCESS, message)
	log.Info(job.JobName, message)

	// Call Run method with command you want to run on remote server.
	stdoutChan, stderrChan, doneChan, errChan, err := ssh.Stream(cmd)
	// Handle errors
	if err != nil {
		message := "Can't run remote command: " + err.Error()
		r.SaveLogRaw(IS_ERROR, message)
		log.Error(job.JobName, message)
		return err
	} else {
		// read from the output channel until the done signal is passed
		isTimeout := true
	loop:
		for {
			select {
			case isTimeout = <-doneChan:
				break loop
			case outline := <-stdoutChan:
				if outline == ""{
					continue
				}

				log.Info(job.JobName +" "+  outline)
				if step.SaveOutput == true {
					r.SaveLogRaw(IS_OUTPUT, outline)
				}
			case errline := <-stderrChan:
				if errline == ""{
					continue
				}
				log.Error(job.JobName +" "+ errline)
				r.SaveLogRaw(IS_ERROR, errline)
				HAS_STD_ERROR = true
			case err = <-errChan:
			}
		}


		if step.StrictError &&  HAS_STD_ERROR == true{
			message:= "STD Command Error"
			return errors.New(job.JobName + message)
		}

		// command time out
		if !isTimeout {
			message := "Error: command timeout"
			log.Error(job.JobName,message)
			r.SaveLogRaw(IS_ERROR, message)
			return errors.New(job.JobName + message)
		}

		// get exit code or command error.
		if err != nil {
			r.SaveLogRaw(IS_ERROR, err.Error())
			log.Error(job.JobName +" "+ err.Error())
			return err
		}

	}
	return  nil
}
