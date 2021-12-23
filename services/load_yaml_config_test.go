package services
import (
	"testing"
)


func SampleYamlConfig() string{
  return `
keep_logs_running: 112
step:
- name : Step run python
  type : ssh
  env  : ssh-local
  commands:
  - /home/xxx/anaconda3/envs/levelup/bin/python -u test_run.py

- name : Step 3 Execute ssh
  type : ssh 
  env  : my-ssh
  commands:
    - echo "Check Hardisk ..."
    - df -h

schedule: 
- "@every 10s"
`	
}


func TestLoadConfigYaml(t *testing.T){
	_, err := LoadConfigYaml(SampleYamlConfig())
	if err != nil{
		t.Error(err)
	}
}
