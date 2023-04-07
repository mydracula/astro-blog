import { visit } from 'unist-util-visit'

import { toString } from 'mdast-util-to-string'

const getText = (node) => {
  let value = ''
  visit(node, (node1) => {
    if (node1.type === 'text' || node1.type === 'inlineCode') {
      value += node1.value
    }
  })
  return value
}

// const getToc = (tree) => {
//   // const astro = file.data.astro as MDInstance;
//   const result = toc(tree);
//   if (!result.map) {
//     return undefined;
//   }
//   const hast = toHast(result.map);
//   const html = toHtml(hast!);
//   return html;
// };

const injectDefaultLayout = () => (tree, file) => {
  const astro = file.data.astro
  // const fileToc = getToc(tree);
  // if (!astro.frontmatter.toc && fileToc) {
  //   astro.frontmatter.toc = fileToc;
  // }
  if (file.extname === '.mdx' && !astro.frontmatter.rawContent) {
    // let rawContent = ''
    // visit(tree, (node) => {
    //   if (node.type !== 'mdxjsEsm' && 'value' in node) {
    //     rawContent += node.value
    //   }
    // })
    // astro.frontmatter.rawContent = rawContent
    astro.frontmatter.isMdx = true
  } else {
    astro.frontmatter.isMdx = false
  }
  const moreLabel = tree.children.findIndex((elem) => elem.type === 'html' && elem.value === '<!--more-->')

  let val = ''
  if (!astro.frontmatter.description) {
    if (moreLabel !== -1) {
      const targetNodes = tree.children.slice(0, moreLabel)
      val = targetNodes.map((node) => getText(node)).join('')
    }
  }
  astro.frontmatter.description = astro.frontmatter.description || val
  // astro.frontmatter.layout = '@layouts/BlogPost.astro';
}

export default injectDefaultLayout
