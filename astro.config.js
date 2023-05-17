import { defineConfig } from 'astro/config'
import UnoCSS from 'unocss/astro'
import InjectJSCSS from './src/utils/index.js'
import permalinkPlugin from 'vite-plugin-permalink'
import Remark from './src/utils/remark.js'
import setCodeBlock from './src/utils/setCodeBlock.js'
import test from './src/utils/test.js'
import compress from 'astro-compress'
import mdx from '@astrojs/mdx'
import rehypePrettyCode from 'rehype-pretty-code'
import fs from 'fs'
import json from './public/moonlight-ii.json'

const options = {
  // Use one of Shiki's packaged themes
  theme: 'one-dark-pro',
  // Or your own JSON theme
  theme: json,

  // Keep the background or use a custom background color?
  keepBackground: true,

  // Callback hooks to add custom logic to nodes when visiting
  // them.
  onVisitLine(node) {
    // Prevent lines from collapsing in `display: grid` mode, and
    // allow empty lines to be copy/pasted
    if (node.children.length === 0) {
      node.children = [{ type: 'text', value: ' ' }]
    }
  },
  onVisitHighlightedLine(node) {
    // Each line node by default has `class="line"`.
    node.properties.className.push('highlighted')
  },
  onVisitHighlightedWord(node) {
    // Each word node has no className by default.
    node.properties.className = ['word']
  }
}

// https://astro.build/config
export default defineConfig({
  integrations: [UnoCSS(), InjectJSCSS(), mdx(), compress()],
  markdown: {
    // syntaxHighlight: false,
    remarkPlugins: [Remark]
    // rehypePlugins: [[rehypePrettyCode, options]]
  },
  vite: {
    plugins: [permalinkPlugin(['src/content/**/*.{md,mdx}'])],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "src/styles/variables.scss" as *; @use "src/styles/mixin.scss" as *; @use "src/styles/animate.scss" as *; '
        }
      }
    }
  }
})
