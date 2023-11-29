export function splitTextIntoArray(
  text: string,
  maxLen: number
): string[] {
  const words = text.split(' ')
  const lines: string[] = ['']
  let lineIndex = 0

  words.forEach((word) => {
    if ((lines[lineIndex] + word).length > maxLen) {
      lines.push(word)
      lineIndex++
    } else {
      lines[lineIndex] += ` ${word}`
    }
  })

  return lines
}

export function splitTextIntoString(
  text: string,
  maxLen: number
): string {
  const words = text.split(' ')
  const lines: string[] = ['']
  let lineIndex = 0

  words.forEach((word) => {
    if ((lines[lineIndex] + word).length > maxLen) {
      lines.push(word)
      lineIndex++
    } else if (lines[lineIndex] === '') {
      lines[lineIndex] = word
    } else {
      lines[lineIndex] += ` ${word}`
    }
  })

  return lines.join('\n')
}
