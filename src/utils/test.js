import { visit } from 'unist-util-visit'
import { toString } from 'hast-util-to-string'
import { unified } from 'unified'
import { removePosition } from 'unist-util-remove-position'
import rehypeParse from 'rehype-parse'
function escapeSwigTag(str) {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/{/g, '&lbrace;').replace(/}/g, '&rbrace;')
}
const parseHtml = unified().use(rehypeParse, { fragment: true })

export default function test() {
  return (tree, file) => {
    visit(tree, 'element', (element, index, parent) => {
      if (element.tagName === 'pre') {
        console.log(element.children)
        // const classes = element.properties && Array.isArray(element.properties.className) ? element.properties.className : []
        // let lang = classes.find((i) => i.indexOf('language-') != -1)
        // if (!lang) return
        // lang = lang.split('-')[1]
        // let code = toString(element)
        // let escapedCode = escapeSwigTag(code)
        // let lines = escapedCode.split('\n')
        // let content = ''
        // let result = `<figure class="highlight ${lang}">`
        // for (let i = 0, len = lines.length; i < len; i++) {
        //   let line = lines[i]
        //   let lineno = i + 1
        //   content += `<tr><td data-num="${lineno}"></td><td><pre>${line}</pre></td></tr>`
        // }
        // result += `<figcaption></figcaption><div class="code-container"><table><tbody>${content}</tbody></table></div><div class="operation"><span class="breakline-btn"><i class="ic i-align-left"></i></span><span class="copy-btn"><i class="ic i-clipboard"></i></span><span class="fullscreen-btn"><i class="ic i-expand"></i></span></div></figure>`
        // const codeBlock = removePosition(parseHtml.parse(result), true).children
        // Object.assign(element, codeBlock[0])
      }
    })
  }
}
