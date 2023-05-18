function convertMarkdownToPlainText(markdownStr, length = 296) {
  const excerpt = markdownStr
    .replace(/\[([^\]]+)\]\(([^\)]+)\)/gm, '$1')
    .replace(/^#+\s+(.*)$/gm, '# $1')
    .replace(/```([\s\S]*?)```/g, '')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\n|\r/g, '')
    .substr(0, length)

  return excerpt.length >= length ? excerpt.slice(0, length) + '...' : excerpt
}

export default convertMarkdownToPlainText
