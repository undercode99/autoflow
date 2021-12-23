package services

import 	(
	"github.com/go-telegram-bot-api/telegram-bot-api"
)


func TelegramSendMessage(message string, token string, telegram_ids []int64) error {
	bot, err := tgbotapi.NewBotAPI(token)
	if err != nil {
		return err
	}
	for _, telegram_id := range telegram_ids{
		bot.Send(tgbotapi.NewMessage(telegram_id, message))	
	}
	return nil
}