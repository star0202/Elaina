import { config } from '../config'
import { VERSION } from '../constants'
import { logger } from '../utils'
import { CommandClient } from '@pikokr/command.ts'
import { green } from 'chalk'
import { ActivityType, Client } from 'discord.js'
import { short } from 'git-rev-sync'
import { Jejudo } from 'jejudo'
import { join } from 'path'

export class Elaina extends CommandClient {
  private jejudo: Jejudo | null = null

  constructor() {
    super(
      new Client({
        intents: ['GuildMessages', 'Guilds', 'MessageContent', 'GuildMembers'],
      }),
      logger
    )

    this.discord.on('ready', () => this.onReady())

    this.discord.on('debug', (msg) => {
      this.logger.debug(msg)
    })
  }

  async setup() {
    await this.enableApplicationCommandsExtension({ guilds: config.guilds })

    await this.registry.loadAllModulesInDirectory(
      join(__dirname, '..', 'modules')
    )
  }

  async onReady() {
    this.jejudo = new Jejudo(this.discord, {
      isOwner: (user) => this.owners.has(user.id),
      prefix: `;`,
      noPermission: (i) => i.reply('Permission denied'),
    })

    this.discord.on('messageCreate', (msg) => this.jejudo?.handleMessage(msg))

    this.discord.on('interactionCreate', (i) => {
      this.jejudo?.handleInteraction(i)
    })

    this.discord.user?.setPresence({
      activities: [
        {
          name: `${VERSION} (${short()})`,
          type: ActivityType.Playing,
        },
      ],
    })

    this.logger.info(`Logged in as: ${green(this.discord.user?.tag)}`)

    await this.fetchOwners()
  }
}
