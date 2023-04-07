import config from './index'

export const iconfont = config.iconfont
export const font = config.font

const getFontFamily = (param) => {
  const result = font[param]['family']
  return !!result ? [result] : []
}

// Font families.
export const fontFamilyChinese = ['-apple-system', 'PingFang SC', 'Microsoft YaHei']
export const fontFamilyBase = getFontFamily('global').concat(fontFamilyChinese, ['sans-serif']).join(',')
export const fontFamilyLogo = getFontFamily('logo').concat(fontFamilyBase).join(',')
export const fontFamilyTitle = getFontFamily('global').concat(getFontFamily('title'), getFontFamily('headings'), fontFamilyBase).join(',')
export const fontFamilyHeadings = getFontFamily('global').concat(getFontFamily('title'), getFontFamily('headings'), fontFamilyBase).join(',')
export const fontFamilyPosts = getFontFamily('posts').concat(fontFamilyBase).join(',')
export const fontFamilyMonospace = getFontFamily('codes').concat(['consolas', 'Menlo'], fontFamilyChinese).join(',')

// Font size
export const fontSizebase = font.enable && /^(\d+)(\.\d+)?$/.test(font.global.size) ? font.global.size + 'em' : '1em'
export const fontSizeSmallest = '.75em'
export const fontSizeSmaller = '.8125em'
export const fontSizeSmall = '.875em'
export const fontSizeMedium = '1em'
export const fontSizeLarge = '1.125em'
export const fontSizeLarger = '1.25em'
export const fontSizeLargest = '1.5em'

// Headings font size
export const fontSizeHeadingsStep = '0.125em'
export const fontSizeHeadingsBase = font.enable && /^(\d+)(\.\d+)?$/.test(font.headings.size) ? font.headings.size + 'em' : '1.625em'

// Global line height
export const lineHeightBase = 2
export const lineHeightCodeBlock = 1.6 // Can't be less than 1.3;

// Z-index master list
export const zindex0 = -1
export const zindex1 = 1
export const zindex2 = 9
export const zindex3 = 99
export const zindex4 = 999
export const zindex5 = 9999

// Pagination

// Layout sizes
export const sidebarWidth = 15
export const sidebarDesktop = sidebarWidth + 'rem'
export const contentOffset = '.75rem'
export const contentWrap = `calc(100% - ${sidebarWidth + contentOffset})`

export const contentDesktopPadding = 1.25
export const contentTabletPadding = '.625rem'
export const contentMobilePadding = '.5rem'

export const contentDesktop = `calc(100% - ${contentDesktopPadding / 2}rem)`
export const contentDesktopLarge = '72.5rem'
export const contentDesktopLargest = '73%'

export const fontSizeTitle = font.enable && /^(\d+)(\.\d+)?$/.test(font.title.size) ? font.title.size + 'em' : '2em'
export const fontSizeSubtitle = fontSizeSmall
export const fontSizeLogo = font.enable && /^(\d+)(\.\d+)?$/.test(font.logo.size) ? font.logo.size + 'em' : '3.5em'
