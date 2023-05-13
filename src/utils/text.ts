import { verifyString } from 'discord.js'

// https://github.com/pikokr/jejudo/blob/dev/src/commands/Evaluate.ts#L29-L75
export const splitMessage = (
  text: string,
  {
    maxLength = 2_000,
    char = '\n',
    prepend = '',
    append = '',
  }: {
    maxLength?: number
    char?: string | RegExp | (string | RegExp)[]
    prepend?: string
    append?: string
  } = {}
) => {
  text = verifyString(text)
  if (text.length <= maxLength) return [text]
  let splitText = [text]
  if (Array.isArray(char)) {
    while (
      char.length > 0 &&
      splitText.some((elem) => elem.length > maxLength)
    ) {
      const currentChar = char.shift()
      if (currentChar instanceof RegExp) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        splitText = splitText.flatMap((chunk) => chunk.match(currentChar)!)
      } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        splitText = splitText.flatMap((chunk) => chunk.split(currentChar!))
      }
    }
  } else {
    splitText = text.split(char)
  }
  if (splitText.some((elem) => elem.length > maxLength))
    throw new RangeError('SPLIT_MAX_LEN')
  const messages = []
  let msg = ''
  for (const chunk of splitText) {
    if (msg && (msg + char + chunk + append).length > maxLength) {
      messages.push(msg + append)
      msg = prepend
    }
    msg += (msg && msg !== prepend ? char : '') + chunk
  }
  return messages.concat(msg).filter((m) => m)
}
