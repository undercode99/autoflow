package services
import (
	"testing" 
)




func TestTelegramSendMessage(t *testing.T){
	message := "Hi"
	token := "1616355098:AAFQR6II4RysWp_CKCbXq2_2RDSqOV-vqvI"
	err := TelegramSendMessage(message, token, []int64{1578510992})
	if err != nil{
		panic(err)
	}
}
