import { visit } from 'unist-util-visit'
import { unified } from 'unified'
import rehypeRaw from 'rehype-raw'
const parseRaw = unified().use(rehypeRaw)

// import { type } from './../../.astro/types.d'

// const setCodeBlock = () => (tree, file) => {
//   console.log(this, '=sdsd')
//   // console.log(tree, '--')

//   // visit(tree, (node) => {
//   //   if (node.type === 'code' && 'value' in node) {
//   //     node.value = `<pre><code>${node.value}</code></pre>`
//   //   }
//   // })
//   // const astro = file.data.astro
//   // // const fileToc = getToc(tree);
//   // // if (!astro.frontmatter.toc && fileToc) {
//   // //   astro.frontmatter.toc = fileToc;
//   // // }
//   // if (file.extname === '.mdx' && !astro.frontmatter.rawContent) {
//   //   // let rawContent = ''
//   //   // visit(tree, (node) => {
//   //   //   if (node.type !== 'mdxjsEsm' && 'value' in node) {
//   //   //     rawContent += node.value
//   //   //   }
//   //   // })
//   //   // astro.frontmatter.rawContent = rawContent
//   //   astro.frontmatter.isMdx = true
//   // } else {
//   //   astro.frontmatter.isMdx = false
//   // }
//   // const moreLabel = tree.children.findIndex((elem) => elem.type === 'html' && elem.value === '<!--more-->')
//   // let val = ''
//   // if (!astro.frontmatter.description) {
//   //   if (moreLabel !== -1) {
//   //     const targetNodes = tree.children.slice(0, moreLabel)
//   //     val = targetNodes.map((node) => getText(node)).join('')
//   //   }
//   // }
//   // astro.frontmatter.description = astro.frontmatter.description || val
//   // // astro.frontmatter.layout = '@layouts/BlogPost.astro';
// }

// export default setCodeBlock
export default function remarkMath() {
  return (tree) => {
    visit(tree, (node) => {
      // console.log(node)
    })
  }
}
