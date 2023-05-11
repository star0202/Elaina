import { config } from '../config'
import { Extension, listener } from '@pikokr/command.ts'
import type { GuildMember } from 'discord.js'

class Role extends Extension {
  @listener({ event: 'guildMemberAdd' })
  async giveDefaultRole(member: GuildMember) {
    if (member.user.bot) return await member.roles.add(config.bot_role)

    await member.roles.add(config.default_role)
  }
}

export const setup = async () => {
  return new Role()
}
