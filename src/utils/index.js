export default function () {
  return {
    name: 'InjectJSCSS',
    hooks: {
      'astro:config:setup': ({ injectScript }) => {
        injectScript('page', 'import "/src/utils/global.js"')
      }
    }
  }
}
