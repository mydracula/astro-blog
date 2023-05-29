import { defineConfig } from 'astro/config'
import unocss from 'unocss/astro'
import InjectJSCSS from './src/utils/index.js'
import permalinkPlugin from 'vite-plugin-permalink'
import Remark from './src/utils/remark.js'
import compress from 'astro-compress'
import mdx from '@astrojs/mdx'

// https://astro.build/config
export default defineConfig({
  compressHTML: true,
  integrations: [unocss(), mdx(), InjectJSCSS(), compress()],
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
