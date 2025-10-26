// api/pair.js
import makeWASocket, { Browsers } from '@whiskeysockets/baileys'
import Pino from 'pino'

export default async function handler(req, res) {
  const number = req.query.number
  if (!number) {
    return res.status(400).json({ error: 'Número não informado' })
  }

  try {
    // Cria uma sessão em memória com autenticação fake (não usa arquivos)
    const sock = makeWASocket({
      logger: Pino({ level: 'silent' }),
      printQRInTerminal: false,
      browser: Browsers.macOS('Safari'),
      auth: {
        creds: {
          noiseKey: { private: {}, public: {} },
          signedIdentityKey: { private: {}, public: {} },
          signedPreKey: { keyPair: { private: {}, public: {} } },
          registrationId: 0,
          advSecretKey: 'souza-temp-key',
          nextPreKeyId: 1,
          firstUnuploadedPreKeyId: 1,
          account: {},
          me: { id: `${number}@s.whatsapp.net`, name: 'Souza-BOT' },
          signalIdentities: [],
          lastAccountSyncTimestamp: 0,
          platformType: 'ANDROID',
        },
        keys: {
          get: () => ({}),
          set: () => {},
        },
      },
    })

    const code = await sock.requestPairingCode(number)
    if (!code) {
      return res.status(500).json({ error: 'Falha ao gerar código de pareamento' })
    }

    res.status(200).json({ status: true, code })
  } catch (err) {
    res.status(500).json({
      error: 'Erro interno no servidor',
      details: err.message,
    })
  }
}
