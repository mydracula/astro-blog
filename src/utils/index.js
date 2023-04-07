export default function () {
  return {
    name: 'InjectJSCSS',
    hooks: {
      'astro:config:setup': ({ injectScript }) => {
        injectScript('page-ssr', 'import "/src/styles/global.scss"'), injectScript('page-ssr', 'import "/src/styles/theme.scss"'), injectScript('page', 'import "/src/utils/global.js"')
      }
    }
  }
}
