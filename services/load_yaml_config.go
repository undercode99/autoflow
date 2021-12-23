package services
import (
	log "github.com/sirupsen/logrus"
	"gopkg.in/yaml.v2"
	"regexp"
	"strings"
	"fmt"
	"errors"
	"github.com/go-playground/validator/v10"
)

type JobStepYamlConfig struct {
	Name string `yaml:"name" validate:"required"`
	Type string `yaml:"type"`
	IfStepError string `yaml:"if_step_error"`
	TotalRetryError string `yaml:"total_retry_error" validate:"number"`
	StrictError bool `yaml:"strict_error"`
	SaveOutput string  `yaml:"save_output"`
	TimeSleep string `yaml:"time_sleep" validate:"number"`
	Env string `yaml:"env"`
	EnvVariable []string `yaml:"env_variable"`
	WorkingDir string	`yaml:"working_dir"`
	Timeout string `yaml:"timeout" validate:"number"`
	Commands []string	`yaml:"commands" validate:"required"`
}

type JobYamlConfig struct {
	Step []*JobStepYamlConfig `yaml:"step" validate:"required,dive"`
	Schedule []string `yaml:"schedule" validate:"required"`
	KeepLogsRunning string `yaml:"keep_logs_running" validate:"number"`
	UseErrorNotification string `yaml:"use_error_notification"`
}


var validate *validator.Validate

func LoadConfigYaml(yamlconfig string) (*JobYamlConfig, error) {

	load := &JobYamlConfig{}
	err := yaml.Unmarshal([]byte(yamlconfig), load)
	if err != nil {
		log.Errorf("error: %v", err)
		return &JobYamlConfig{}, err
	}
	if load.KeepLogsRunning == ""{
		load.KeepLogsRunning = "25" //default
	}

	for _, step := range load.Step{
		if step.TimeSleep == "" {
			step.TimeSleep = "0"
		}
		if step.TotalRetryError == ""{
			step.TotalRetryError = "0"
		}
		if step.Timeout == ""{
			step.Timeout = "0"
		}
		
	}
	

	toSnackCase := func (str string) string {
		var matchFirstCap = regexp.MustCompile("(.)([A-Z][a-z]+)")
		var matchAllCap   = regexp.MustCompile("([a-z0-9])([A-Z])")
		snake := matchFirstCap.ReplaceAllString(str, "${1}_${2}")
		snake  = matchAllCap.ReplaceAllString(snake, "${1}_${2}")
		return strings.ToLower(snake)
	}

	messageError := func (field string, tag string, value interface{}) error{
		var errMessage string

		field = toSnackCase(field)
		
		if tag == "required"{
			errMessage = fmt.Sprintf("Key %s is required and please fill value", field)
			return errors.New(errMessage)
		}
		if tag == "numeric" || tag =="number"{
			errMessage = fmt.Sprintf("Value '%s' invalid on key %s type value must numeric ", value, field)
			return errors.New(errMessage)
		}

		errMessage = fmt.Sprintf("Failed for key %s tag:%s",field, tag)
		return errors.New(errMessage)

	}
	validate = validator.New()
	err = validate.Struct(load)
	if err != nil{
		validationErrors := err.(validator.ValidationErrors)
		for _,e := range validationErrors{
			errMessage := messageError(e.Field(), e.Tag(), e.Value())
			return &JobYamlConfig{}, errMessage
		}
	}
	return load, nil
}
