import {
  defineConfig
} from 'astro/config'
import UnoCSS from 'unocss/astro'
import InjectJSCSS from './src/utils/index.js'
import permalinkPlugin from 'vite-plugin-permalink'
import Remark from './src/utils/remark.js'
import compress from 'astro-compress'

// https://astro.build/config
export default defineConfig({
  integrations: [UnoCSS(), InjectJSCSS(), compress()],
  markdown: {
    remarkPlugins: [Remark]
  },
  vite: {
    plugins: [permalinkPlugin(['src/content/**/*.md'])],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "src/styles/variables.scss" as *; @use "src/styles/mixin.scss" as *; @use "src/styles/animate.scss" as *; '
        }
      }
    }
  }
})