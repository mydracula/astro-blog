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

// https://astro.build/config
export default defineConfig({
  integrations: [UnoCSS(), InjectJSCSS(), mdx(), compress()],
  markdown: {
    syntaxHighlight: 'prism',
    remarkPlugins: [Remark, setCodeBlock],
    rehypePlugins: [test]
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
