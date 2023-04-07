export default function () {
  return {
    name: 'InjectJSCSS',
    hooks: {
      'astro:config:setup': ({ injectScript }) => {
        injectScript('page-ssr', 'import "/src/styles/base.scss"')
        injectScript('page', 'import "/src/script/index.js"')
      }
    }
  }
}
