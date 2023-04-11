import permalinkPlugin from 'vite-plugin-permalink'

export default {
  name: 'permalinkPlugin',
  hooks: {
    'astro:config:setup': ({ updateConfig }) => {
      updateConfig({
        vite: {
          plugins: [permalinkPlugin()]
        }
      })
    }
  }
}
