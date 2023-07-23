import { config } from '../config'
import { Extension, listener } from '@pikokr/command.ts'
import type { Message } from 'discord.js'

class Announce extends Extension {
  @listener({ event: 'messageCreate' })
  async autoNotification(msg: Message) {
    if (msg.author.bot) return

    if (msg.channelId !== config.announce_channel) return

    await msg.reply({
      content: `<@&${config.announce_role}>`,
      allowedMentions: { roles: [config.announce_role] },
    })
  }
}

export const setup = async () => {
  return new Announce()
}
