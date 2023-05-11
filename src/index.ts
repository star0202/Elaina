import { config } from './config'
import { Elaina } from './structures'

const cts = new Elaina()

;(async () => {
  await cts.setup()

  await cts.discord.login(config.token)

  await cts.getApplicationCommandsExtension()?.sync()
})()
