import { toString } from './object'
import { splitMessage } from './text'
import type { EmbedField } from 'discord.js'
import { codeBlock } from 'discord.js'

export const chunk = (
  content: string | object,
  maxLength: number
): string[] => {
  if (typeof content !== 'string') content = toString(content)

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
