type Config = {
  token: string
  guilds: string[]

  log_channel: string
  default_role: string
  bot_role: string
  announce_channel: string
  announce_role: string
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const config: Config = require('../config.json')
