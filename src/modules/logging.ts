import { config } from '../config'
import { COLORS } from '../constants'
import { diff, isIrrelevant } from '../utils'
import { Extension, listener } from '@pikokr/command.ts'
import { blue, green, red, yellow } from 'chalk'
import type {
  GuildMember,
  Interaction,
  Message,
  TextBasedChannel,
} from 'discord.js'
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  codeBlock,
} from 'discord.js'
import { inspect } from 'util'

class Logging extends Extension {
  @listener({ event: 'applicationCommandInvokeError', emitter: 'cts' })
  async errorLogger(err: Error) {
    this.logger.error(err)
  }

  @listener({ event: 'interactionCreate' })
  async commandLogger(i: Interaction) {
    if (!i.isChatInputCommand()) return

    const options: string[] = []
    for (const option of i.options.data) {
      options.push(
        `\n- ${green(option.name)}: ${blue(option.value)} (${yellow(
          ApplicationCommandOptionType[option.type]
        )})`
      )
    }

    const guild = i.guild ? `${green(i.guild.name)}(${blue(i.guild.id)})` : 'DM'

    this.logger.info(
      `${green(i.user.tag)}(${blue(i.user.id)}) in ${guild}: ${yellow.bold(
        `/${i.commandName}`
      )}${options}`
    )
  }

  @listener({ event: 'messageUpdate' })
  async messageUpdateLogger(before: Message, after: Message) {
    if (isIrrelevant(before) && isIrrelevant(after)) return

    const msgDiff = diff(after, before)

    this.logger.info(
      `Updated: ${green(before.author.tag)} (${blue(
        before.author.id
      )}) - ${red.bold.strikethrough(
        inspect(msgDiff.original, { colors: false })
      )} -> ${yellow.bold(inspect(msgDiff.updated, { colors: false }))}`
    )

    const channel = after.client.channels.cache.get(
      config.log_channel
    ) as TextBasedChannel

    await channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle('Update')
          .setColor(COLORS.YELLOW)
          .setAuthor({
            name: `${after.author.tag} (${after.author.id})`,
            iconURL: after.author.displayAvatarURL(),
          })
          .addFields(
            { name: 'User', value: `<@${after.author.id}>`, inline: true },
            { name: 'Channel', value: `<#${after.channelId}>`, inline: true },
            {
              name: 'Before',
              value: codeBlock('ts', inspect(msgDiff.original)),
            },
            {
              name: 'After',
              value: codeBlock('ts', inspect(msgDiff.updated)),
            }
          ),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setURL(after.url)
            .setLabel('Go To Message')
        ),
      ],
    })
  }

  @listener({ event: 'messageDelete' })
  async messageDeleteLogger(msg: Message) {
    if (isIrrelevant(msg)) return

    this.logger.info(
      `Deleted: ${green(msg.author.tag)} (${blue(
        msg.author.id
      )}) - ${red.bold.strikethrough(msg.content)}`
    )

    const channel = msg.client.channels.cache.get(
      config.log_channel
    ) as TextBasedChannel

    await channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle('Deleted')
          .setColor(COLORS.RED)
          .setAuthor({
            name: `${msg.author.tag} (${msg.author.id})`,
            iconURL: msg.author.displayAvatarURL(),
          })
          .addFields(
            { name: 'User', value: `<@${msg.author.id}>`, inline: true },
            { name: 'Channel', value: `<#${msg.channelId}>`, inline: true },
            { name: 'Message', value: codeBlock('ts', inspect(msg.toJSON())) }
          ),
      ],
    })
  }

  @listener({ event: 'guildMemberAdd' })
  async memberJoinLogger(member: GuildMember) {
    if (member.user.bot) return

    this.logger.info(
      `Joined: ${green(member.user.tag)} (${blue(member.user.id)})`
    )

    const channel = member.client.channels.cache.get(
      config.log_channel
    ) as TextBasedChannel

    await channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle('Joined')
          .setColor(COLORS.GREEN)
          .setAuthor({
            name: `${member.user.tag} (${member.user.id})`,
            iconURL: member.user.displayAvatarURL(),
          })
          .setTimestamp(),
      ],
    })
  }

  @listener({ event: 'guildMemberRemove' })
  async memberLeaveLogger(member: GuildMember) {
    if (member.user.bot) return

    this.logger.info(
      `Left: ${green(member.user.tag)} (${blue(member.user.id)})`
    )

    const channel = member.client.channels.cache.get(
      config.log_channel
    ) as TextBasedChannel

    await channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle('Left')
          .setColor(COLORS.RED)
          .setAuthor({
            name: `${member.user.tag} (${member.user.id})`,
            iconURL: member.user.displayAvatarURL(),
          })
          .setTimestamp(),
      ],
    })
  }
}

export const setup = async () => {
  return new Logging()
}
