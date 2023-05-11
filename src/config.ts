type Config = {
  token: string
  guilds: string[]

  log_channel: string
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const config: Config = require('../config.json')
