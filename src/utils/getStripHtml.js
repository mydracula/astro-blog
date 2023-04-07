function convertMarkdownToPlainText(markdownStr) {
  markdownStr = markdownStr
    .replace(/\[([^\]]+)\]\(([^\)]+)\)/gm, '$1')
    .replace(/^#+\s+(.*)$/gm, '# $1')
    .replace(/```([\s\S]*?)```/g, '')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
    .substr(0, 300)
  return markdownStr
}

export default convertMarkdownToPlainText
