import { splitMessage } from './text'
import type { EmbedField } from 'discord.js'
import { codeBlock } from 'discord.js'
import { inspect } from 'util'

export const chunk = (
  content: string | object,
  maxLength: number
): string[] => {
  if (typeof content !== 'string')
    content = inspect(content, {
      maxArrayLength: 200,
      depth: 2,
    })

  if (content.length <= maxLength) return [content]

  return splitMessage(content, {
    char: [new RegExp(`.{1,${maxLength}}`, 'g'), '\n'],
    maxLength: maxLength,
  })
}

export const chunkedFields = (content: object): EmbedField[] => {
  const chunked = chunk(content, 1024 - 10)

  return chunked.map((chunk, i) => ({
    name: `Content ${i + 1} / ${chunked.length}`,
    value: codeBlock('ts', chunk),
    inline: false,
  }))
}
