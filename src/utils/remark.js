import { visit } from 'unist-util-visit'
import { toc } from 'mdast-util-toc'
import { toHast } from 'mdast-util-to-hast'
import { toHtml } from 'hast-util-to-html'
import { toString } from 'mdast-util-to-string'
import { html_beautify } from 'js-beautify'

function filterEmptyNodes(tree) {
  const newTree = {}

  // 首先将原始树的其他属性复制到新的树中
  for (const key of Object.keys(tree)) {
    if (key !== 'children') {
      newTree[key] = tree[key]
    }
  }

  // 如果当前节点有子节点，则递归调用 `filterEmptyNodes()` 函数将其子节点过滤后加入树中
  if (tree.children && tree.children.length > 0) {
    const filteredChildren = tree.children.map(filterEmptyNodes).filter((child) => child !== null)

    if (filteredChildren.length > 0) {
      newTree.children = filteredChildren
    }
  }

  // 如果当前节点是文本节点，且其值为空串或仅包含空格，则将其返回值设为 `null`
  if (newTree.type === 'text') {
    if (!newTree.value.trim()) {
      return null
    }
  }

  // 返回新树
  return newTree
}

const getText = (node) => {
  let value = ''
  visit(node, (node1) => {
    if (node1.type === 'text' || node1.type === 'inlineCode') {
      value += node1.value
    }
  })
  return value
}

const juhe = (authData) => {
  const handlingString = (str) => {
    return (
      str
        .replace(/(^&+)|(&+$)/g, '')
        .split('&')
        .filter(Boolean)
        .join('.') + '.'
    )
  }
  const find = (arr, child = false, leave = 0, parentId = '') => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].tagName === 'ul') {
        leave++
        arr[i].tagName = 'ol'
        arr[i].properties.class = child ? 'toc-child' : 'toc'
      }
      if (arr[i].tagName === 'p') {
        arr[i].properties.href = arr[i].children[0].tagName === 'a' && arr[i].children.length === 1 ? arr[i].children[0].properties.href : ''
        arr[i].properties.class = 'toc-link'
        arr[i].tagName = 'a'
        arr[i].children = [
          {
            type: 'element',
            tagName: 'span',
            properties: {
              class: 'toc-number'
            },
            children: [
              {
                type: 'text',
                value: '无'
              }
            ]
          },
          {
            type: 'element',
            tagName: 'span',
            properties: {
              class: 'toc-text'
            },
            children: [
              {
                type: 'text',
                value: arr[i].children[0].children[0].value
              }
            ]
          }
        ]
      }
      if (arr[i].tagName === 'li') {
        arr[i].properties.class = `toc-item toc-level-${leave}`
        if (arr[i].children.length === 1 && arr[i].children[0].tagName === 'a') {
          const value = arr[i].children[0].children[0].value
          arr[i].children[0].children = [
            {
              type: 'element',
              tagName: 'span',
              properties: {
                class: 'toc-number'
              },
              children: [
                {
                  type: 'text',
                  value: '无'
                }
              ]
            },
            {
              type: 'element',
              tagName: 'span',
              properties: {
                class: 'toc-text'
              },
              children: [
                {
                  type: 'text',
                  value: value
                }
              ]
            }
          ]
        }
      }

      if (arr[i].tagName === 'a') {
        arr[i].properties.class = 'toc-link'
      }

      if (Array.isArray(arr[i].children) && arr[i].children.length > 0) {
        let id = i + 1
        if (arr[i].tagName === 'ol' || arr[i].tagName === 'a') {
          id = ''
        }
        if (arr[i].tagName === 'li' || arr[i].tagName === 'a') {
          if (arr[i].children[0].children[0].type === 'text') arr[i].children[0].children[0].value = handlingString(`${parentId}&${id}&`)
        }
        find(arr[i].children, true, leave, `${parentId}&${id}&`)
      }
    }
  }
  find(authData)
  return authData
}

const getToc = (tree) => {
  // const astro = file.data.astro as MDInstance;
  const result = toc(tree)
  if (!result.map) {
    return undefined
  }
  const hast = toHast(result.map)
  const filteredHAST = filterEmptyNodes(hast)
  const output = juhe([filteredHAST])
  const html = toHtml(output, { minify: false })

  return html_beautify(html, { indent_size: 2, extra_liners: ['span'] })
}

const injectDefaultLayout = () => (tree, file) => {
  const astro = file.data.astro
  const fileToc = getToc(tree)
  if (!astro.frontmatter.toc && fileToc) {
    astro.frontmatter.toc = fileToc
  }
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
