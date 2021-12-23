package services

import (
	"os"
	"bufio"
	"strings"
	"os/exec"
	log "github.com/sirupsen/logrus"
)


func (step *StepCommand) RunLocalCommand(r *RunningStepManager,job *JobParameter) error {

	if step.WorkingDir == "" {
		home, _ := os.UserHomeDir()
		step.WorkingDir = home
	}

	cmd := exec.Command("/bin/sh","-c",strings.Join(step.Commands, "; "))
	cmd.Dir = step.WorkingDir
	outReader, _ := cmd.StdoutPipe()
	errReader, _ := cmd.StderrPipe()
	

	scannerOut := bufio.NewScanner(outReader)
	scannerErr := bufio.NewScanner(errReader)


    go func() {
        for scannerOut.Scan() {
			scan := scannerOut.Text()
			log.Infof("%s %s\n",job.JobName, scan)
			r.SaveLogRaw(IS_OUTPUT, scan)
		}
	}()
	
    go func() {
        for scannerErr.Scan() {
			scanErr := scannerErr.Text()
			log.Errorf("%s %s\n",job.JobName, scannerErr.Text())
			r.SaveLogRaw(IS_ERROR, scanErr)
		}
	}()
	
	err := cmd.Start()
	if err != nil {
		log.Errorf("%s Failed start with %s\n", job.JobName, err)
		r.SaveLogRaw(IS_ERROR, "Failed start command with "+ err.Error())
		return err
	}

	err = cmd.Wait()
	if err != nil {
		log.Errorf("%s Failed  with %s\n", job.JobName, err)
		r.SaveLogRaw(IS_ERROR, "Failed wait command with "+ err.Error())
		return err
	}

	return nil

}