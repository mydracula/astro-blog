import { vitePreprocess } from '@astrojs/svelte'

export default {
  preprocess: vitePreprocess(),
  kit: {
    alias: {
      '$styles/*': 'src/styles/*'
    }
  }
}
