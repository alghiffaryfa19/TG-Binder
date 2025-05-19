require("dotenv").config();
const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require('telegram/events');
const input = require("input");
const axios = require('axios');

const apiId = parseInt(process.env.API_ID);
const apiHash = process.env.API_HASH;
const stringSession = new StringSession(process.env.STRING_SESSION);



(async () => {
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => await input.text('Nomor HP: '),
    password: async () => await input.text('Password 2FA: '),
    phoneCode: async () => await input.text('Kode OTP: '),
    onError: (err) => console.log(err),
  });

  console.log('Client siap!');


  // Listen semua pesan masuk
client.addEventHandler(async (event) => {
    const message = event.message;

    // Filter: hanya dari bot tertentu
    if (message.peerId?.userId?.value == 1636695583n) {
      try {
        await axios.post('https://tradelogic.id/api/bot', {
          message: message.message,
        });
      } catch (err) {
        console.error('Gagal forward:', err);
      }
    }
  }, new NewMessage({}));

})();
