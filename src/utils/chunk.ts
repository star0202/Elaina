import type { EmbedField } from 'discord.js'
import { codeBlock } from 'discord.js'
import { inspect } from 'util'

export const chunk = (content: string, size: number): string[] => {
  if (content.length <= size) {
    return [content]
  }

  const chunks = []
  let i = 0
  while (i < content.length) {
    chunks.push(content.slice(i, i + size))
    i += size
  }
  return chunks
}

export const chunkedFields = (content: object, size: number): EmbedField[] => {
  const chunked = chunk(
    inspect(content, {
      maxArrayLength: 200,
      depth: 2,
    }),
    size - 10
  )

  return chunked.map((chunk, i) => ({
    name: `Content ${i + 1} / ${chunked.length}`,
    value: codeBlock('ts', chunk),
    inline: false,
  }))
}
