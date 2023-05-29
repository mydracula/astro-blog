import lozad from 'lozad'
import CONFIG from '$lib/config'
import anime from 'animejs'

const $dom = (selector, element = document) => {
  // 在测试环境中这能优化0.01-0.02ms左右
  if (selector[0] === '#') {
    return element.getElementById(selector.substring(1))
  }
  return element.querySelector(selector)
}
const $storage = {
  set: (key, value) => {
    localStorage.setItem(key, value)
  },
  get: (key) => {
    return localStorage.getItem(key)
  },
  del: (key) => {
    localStorage.removeItem(key)
  }
}
const getDocHeight = () => $dom('main > .inner').offsetHeight
Object.assign(HTMLElement.prototype, {
  /**
   * 创建一个子节点并放置
   */
  createChild: function (tag, obj, positon) {
    const child = document.createElement(tag)
    Object.assign(child, obj)
    switch (positon) {
      case 'after':
        this.insertAfter(child)
        break
      case 'replace':
        this.innerHTML = ''
        this.appendChild(child)
        break
      default:
        this.appendChild(child)
    }
    return child
  },
  wrapObject: function (obj) {
    const box = document.createElement('div')
    Object.assign(box, obj)
    this.parentNode.insertBefore(box, this)
    this.parentNode.removeChild(this)
    box.appendChild(this)
  },
  changeOrGetHeight: function (h) {
    if (h) {
      this.style.height = typeof h === 'number' ? h + 'rem' : h
    }
    return this.getBoundingClientRect().height
  },
  /**
   此函数将元素的宽度设置为指定值,如果未提供值,则返回元素的宽度.<br />
   宽度可以作为数字提供(假定它以`rem`为单位).作为字符串提供则直接设置为元素宽度
   */
  changeOrGetWidth: function (w) {
    if (w) {
      this.style.width = typeof w === 'number' ? w + 'rem' : w
    }
    return this.getBoundingClientRect().width
  },
  top: function () {
    return this.getBoundingClientRect().top
  },
  left: function () {
    return this.getBoundingClientRect().left
  },
  /**
   * 该函数接受两个参数：`type`字符串和 `value`字符串的可选参数。该函数具有基于参数值的三个主要逻辑分支。 <br />
   * 1. `value`如果是`null`，则该函数从当前上下文中删除具有`type`函数名称的属性。 <br />
   * 2. `value`如果为真，则该函数将使用`type`参数指定的名称将属性设置为当前上下文中`value`参数的值。然后，该函数返回当前上下文。 <br />
   * 3. `value`如果不是真，则该函数返回属性的值，该值具有当前上下文中的参数指定的名称。
   */
  attr: function (type, value) {
    if (value === null) {
      return this.removeAttribute(type)
    }
    if (value) {
      this.setAttribute(type, value)
      return this
    } else {
      return this.getAttribute(type)
    }
  },
  /**
   * 将此节点插入父节点的下一个节点之前
   */
  insertAfter: function (element) {
    const parent = this.parentNode
    if (parent.lastChild === this) {
      parent.appendChild(element)
    } else {
      parent.insertBefore(element, this.nextSibling)
    }
  },
  /**
   * 当d为空时返回此节点的CSSStyle display属性 <br />
   * 反之,将d设置为此节点的CSSStyle display属性
   */
  display: function (d) {
    if (d == null) {
      return this.style.display
    } else {
      this.style.display = d
      return this
    }
  },
  /**
   * 找到此节点第一个符合selector选择器的子节点
   */
  child: function (selector) {
    return $dom(selector, this)
  },
  /**
   * 找到此节点所有符合selector选择器的子节点
   */
  find: function (selector) {
    return $dom.all(selector, this)
  },
  /**
   * 当输入type为toggle时,对每个className执行toggle操作 <br />
   * 反之,对每个className执行type操作
   */
  _class: function (type, className, display) {
    const classNames = className.indexOf(' ') ? className.split(' ') : [className]
    classNames.forEach((name) => {
      if (type === 'toggle') {
        this.classList.toggle(name, display)
      } else {
        this.classList[type](name)
      }
    })
  },
  addClass: function (className) {
    this._class('add', className)
    return this
  },
  removeClass: function (className) {
    this._class('remove', className)
    return this
  },
  toggleClass: function (className, display) {
    this._class('toggle', className, display)
    return this
  },
  hasClass: function (className) {
    return this.classList.contains(className)
  }
})
// 获取具有此选择器的所有dom节点
$dom.all = (selector, element = document) => {
  return element.querySelectorAll(selector)
}
// 获取具有此选择器的所有dom节点,并依次执行callback函数
$dom.each = (selector, callback, element) => {
  return $dom.all(selector, element).forEach(callback)
}
// export const statics = CONFIG.statics.indexOf('//') > 0 ? CONFIG.statics : CONFIG.root
export const scrollAction = {
  x: 0,
  y: 0
}
export let diffY = 0
export let originTitle, titleTime
export const BODY = document.getElementsByTagName('body')[0]
export const HTML = document.documentElement
export const Container = $dom('#container')
export const loadCat = $dom('#loading')
export const siteNav = $dom('#nav')
export const siteHeader = $dom('#header')
export const menuToggle = siteNav.child('.toggle')
export const quickBtn = $dom('#quick')
export const sideBar = $dom('#sidebar')
export const siteBrand = $dom('#brand')
export let toolBtn = $dom('#tool')
export let toolPlayer
export let backToTop
export let goToComment
export let showContents
export let siteSearch = $dom('#search')
export let siteNavHeight, headerHightInner, headerHight
export let oWinHeight = window.innerHeight
export let oWinWidth = window.innerWidth
export let LOCAL_HASH = 0
export let LOCAL_URL = window.location.href
export let pjax
const auto_scroll = true

export const transition = function (target, type, complete) {
  var animation = {}
  var display = 'none'
  switch (type) {
    case 0:
      animation = {
        opacity: [1, 0]
      }
      break
    case 1:
      animation = {
        opacity: [0, 1]
      }
      display = 'block'
      break
    case 'bounceUpIn':
      animation = {
        begin: function (anim) {
          target.display('block')
        },
        translateY: [
          {
            value: -60,
            duration: 200
          },
          {
            value: 10,
            duration: 200
          },
          {
            value: -5,
            duration: 200
          },
          {
            value: 0,
            duration: 200
          }
        ],
        opacity: [0, 1]
      }
      display = 'block'
      break
    case 'shrinkIn':
      animation = {
        begin: function (anim) {
          target.display('block')
        },
        scale: [
          {
            value: 1.1,
            duration: 300
          },
          {
            value: 1,
            duration: 200
          }
        ],
        opacity: 1
      }
      display = 'block'
      break
    case 'slideRightIn':
      animation = {
        begin: function (anim) {
          target.display('block')
        },
        translateX: [100, 0],
        opacity: [0, 1]
      }
      display = 'block'
      break
    case 'slideRightOut':
      animation = {
        translateX: [0, 100],
        opacity: [1, 0]
      }
      break
    default:
      animation = type
      display = type.display
      break
  }
  anime(
    Object.assign(
      {
        targets: target,
        duration: 200,
        easing: 'linear'
      },
      animation
    )
  ).finished.then(function () {
    target.display(display)
    complete && complete()
  })
}

// 更改日夜模式
export const changeTheme = function (type) {
  const btn = $dom('.theme .ic')
  if (type === 'dark') {
    HTML.attr('data-theme', type)
    btn.removeClass('i-sun')
    btn.addClass('i-moon')
  } else {
    HTML.attr('data-theme', null)
    btn.removeClass('i-moon')
    btn.addClass('i-sun')
  }
}
// 自动调整黑夜白天 优先级: 手动选择>时间>跟随系统
export const autoDarkmode = function () {
  const auto_dark = {
    enable: true,
    start: 20,
    end: 7
  }
  if (auto_dark.enable) {
    if (new Date().getHours() >= auto_dark.start || new Date().getHours() <= auto_dark.end) {
      changeTheme('dark')
    } else {
      changeTheme()
    }
  }
}
// 懒加载图片
export const lazyload = lozad('img, [data-background-image]', {
  loaded: function (el) {
    el.addClass('lozaded')
  }
})
// 加载动画
export const Loader = {
  timer: undefined,
  lock: false,
  show: function () {
    clearTimeout(this.timer)
    document.body.removeClass('loaded')
    loadCat.attr('style', 'display:block')
    Loader.lock = false
  },
  hide: function (sec) {
    if (!CONFIG.loader.start) {
      sec = -1
    }
    this.timer = setTimeout(this.vanish, sec || 3000)
  },
  vanish: function () {
    if (Loader.lock) {
      return
    }
    if (CONFIG.loader.start) {
      transition(loadCat, 0)
    }
    document.body.addClass('loaded')
    Loader.lock = true
  }
}

const cardActive = function () {
  if (!$dom('.index.wrap')) {
    return
  }

  if (!window.IntersectionObserver) {
    $dom.each('.index.wrap article.item, .index.wrap section.item', function (article) {
      if (article.hasClass('show') === false) {
        article.addClass('show')
      }
    })
  } else {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (article) {
          if (article.target.hasClass('show')) {
            io.unobserve(article.target)
          } else {
            if (article.isIntersecting || article.intersectionRatio > 0) {
              article.target.addClass('show')
              io.unobserve(article.target)
            }
          }
        })
      },
      {
        root: null,
        threshold: [0.3]
      }
    )

    $dom.each('.index.wrap article.item, .index.wrap section.item', function (article) {
      io.observe(article)
    })

    $dom('.index.wrap .item:first-child').addClass('show')
  }

  $dom.each('.cards .item', function (element, index) {
    ;['mouseenter', 'touchstart'].forEach(function (item) {
      element.addEventListener(
        item,
        function (event) {
          if ($dom('.cards .item.active')) {
            $dom('.cards .item.active').removeClass('active')
          }
          element.addClass('active')
        },
        {
          passive: true
        }
      )
    })
    ;['mouseleave'].forEach(function (item) {
      element.addEventListener(
        item,
        function (event) {
          element.removeClass('active')
        },
        {
          passive: true
        }
      )
    })
  })
}

// 更改主题的meta
export const changeMetaTheme = function (color) {
  if (HTML.attr('data-theme') === 'dark') {
    color = '#222'
  }

  $dom('meta[name="theme-color"]').attr('content', color)
}
// 记忆日夜模式切换和系统亮暗模式监听
export const themeColorListener = function () {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (mediaQueryList) {
    if (mediaQueryList.matches) {
      changeTheme('dark')
    } else {
      changeTheme()
    }
  })

  const t = $storage.get('theme')
  if (t) {
    changeTheme(t)
  } else {
    if (CONFIG.darkmode) {
      changeTheme('dark')
    }
  }
}
// 可见度监听(离开页面和返回时更改document的title)
export const visibilityListener = function () {
  const iconNode = $dom('[rel="icon"]')
  document.addEventListener('visibilitychange', function () {
    switch (document.visibilityState) {
      case 'hidden':
        iconNode.attr('href', statics + CONFIG.favicon.hidden)
        document.title = LOCAL.favicon.hide
        if (CONFIG.loader.switch) {
          Loader.show()
        }
        clearTimeout(titleTime)
        break
      case 'visible':
        iconNode.attr('href', statics + CONFIG.favicon.normal)
        document.title = LOCAL.favicon.show
        if (CONFIG.loader.switch) {
          Loader.hide(1000)
        }
        titleTime = setTimeout(function () {
          document.title = originTitle
        }, 2000)
        break
    }
  })
}
// 显示提示(现阶段用于版权及复制结果提示)
export const showtip = function (msg) {
  if (!msg) {
    return
  }

  const tipbox = BODY.createChild('div', {
    innerHTML: msg,
    className: 'tip'
  })

  setTimeout(function () {
    tipbox.addClass('hide')
    setTimeout(function () {
      BODY.removeChild(tipbox)
    }, 300)
  }, 3000)
}
export const resizeHandle = function (event) {
  // 获取 siteNav 的高度
  siteNavHeight = siteNav.changeOrGetHeight()
  // 获取 siteHeader 的高度
  headerHightInner = siteHeader.changeOrGetHeight()
  // 获取 #waves 的高度
  headerHight = headerHightInner + $dom('#waves').changeOrGetHeight()

  // 判断窗口宽度是否改变
  if (oWinWidth !== window.innerWidth) {
    sideBarToggleHandle(null, 1)
  }

  // 记录窗口高度和宽度
  oWinHeight = window.innerHeight
  oWinWidth = window.innerWidth
  // 设置 sidebar .panels 元素的高度
  sideBar.child('.panels').changeOrGetHeight(oWinHeight + 'px')
}
export const scrollHandle = function (event) {
  // 获取窗口高度
  const winHeight = window.innerHeight
  // 获取文档高度
  const docHeight = getDocHeight()
  // 计算可见内容高度
  const contentVisibilityHeight = docHeight > winHeight ? docHeight - winHeight : document.body.scrollHeight - winHeight
  // 判断页面是否滚动超过 headerHightInner
  const SHOW = window.scrollY > headerHightInner
  // 判断页面是否开始滚动
  const startScroll = window.scrollY > 0

  // // 根据条件修改 meta theme
  // if (SHOW) {
  //   changeMetaTheme('#FFF')
  // } else {
  //   changeMetaTheme('#222')
  // }

  // 控制导航栏的显示隐藏
  siteNav.toggleClass('show', SHOW)
  // 控制网站 logo 的显示隐藏
  toolBtn.toggleClass('affix', startScroll)
  // 控制侧边栏的显示隐藏，当滚动高度大于 headerHight 且窗口宽度大于 991px 时显示
  siteBrand.toggleClass('affix', startScroll)
  sideBar.toggleClass('affix', window.scrollY > headerHight && document.body.offsetWidth > 991)
  // 初始化滚动时导航栏的显示方向
  if (typeof scrollAction.y === 'undefined') {
    scrollAction.y = window.scrollY
  }
  diffY = scrollAction.y - window.scrollY

  // 控制滑动时导航栏显示
  if (diffY < 0) {
    siteNav.removeClass('up')
    siteNav.toggleClass('down', SHOW)
  } else if (diffY > 0) {
    siteNav.removeClass('down')
    siteNav.toggleClass('up', SHOW)
  } else {
    /* empty */
  }
  scrollAction.y = window.scrollY
  // 计算滚动百分比
  const scrollPercent = Math.round(Math.min((100 * window.scrollY) / contentVisibilityHeight, 100)) + '%'
  // 更新回到顶部按钮的文字
  backToTop.child('span').innerText = scrollPercent
  // 更新百分比进度条的宽度
  $dom('.percent').changeOrGetWidth(scrollPercent)
}

const pageScroll = function (target, offset, complete) {
  // target: 滚动到的目标元素或坐标(number)
  // offset: 可选的偏移量
  // complete: 可选的回调函数，在动画完成时调用
  const opt = {
    // 动画目标
    targets: typeof offset === 'number' ? target.parentNode : document.scrollingElement,
    // 动画持续时间
    duration: 500,
    // 动画缓动函数
    easing: 'easeInOutQuad',
    // 如果 offset 存在，则滚动到 offset，如果 target 是数字，则滚动到 target，如果 target 是 DOM 元素，则滚动到下述表达式
    scrollTop: offset || (typeof target === 'number' ? target : target ? target.top() + document.documentElement.scrollTop - siteNavHeight : 0),
    // 完成回调函数
    complete: function () {
      complete && complete()
    }
  }
  anime(opt)
  // 调用 anime.js 函数，并传入参数
}

export const pagePosition = function () {
  // 判断配置项是否开启了自动记录滚动位置
  if (auto_scroll) {
    // 将当前页面的滚动位置存入本地缓存
    $storage.set(LOCAL_URL, String(scrollAction.y))
  }
}
export const positionInit = function (comment) {
  // 获取页面锚点
  const anchor = window.location.hash

  let target = null
  if (LOCAL_HASH) {
    $storage.del(LOCAL_URL)
    return
  }

  if (anchor) {
    target = $dom(decodeURI(anchor))
  } else {
    target = auto_scroll ? parseInt($storage.get(LOCAL_URL)) : 0
  }

  if (target) {
    pageScroll(target)
    LOCAL_HASH = 1
  }

  if (comment && anchor && !LOCAL_HASH) {
    pageScroll(target)
    LOCAL_HASH = 1
  }
}
export const clipBoard = function (str, callback) {
  //   这段代码是用来复制文本的。它使用了浏览器的 Clipboard API，如果浏览器支持该 API 并且当前页面是安全协议 (https)，
  // 它将使用 Clipboard API 将文本复制到剪贴板。如果不支持，它会创建一个隐藏的文本区域并使用 document.execCommand('copy') 将文本复制到剪贴板。最后，它会回调传入的函数并传入一个布尔值表示是否成功复制。
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(str).then(
      () => {
        callback && callback(true)
      },
      () => {
        callback && callback(false)
      }
    )
  } else {
    const ta = BODY.createChild('textarea', {
      style: {
        top: window.scrollY + 'px',
        position: 'absolute',
        opacity: '0'
      },
      readOnly: true,
      value: str
    })

    const selection = document.getSelection()
    const selected = selection.rangeCount > 0 ? selection.getRangeAt(0) : false
    ta.select()
    ta.setSelectionRange(0, str.length)
    ta.readOnly = false
    const result = document.execCommand('copy')
    callback && callback(result)
    ta.blur() // For iOS
    if (selected) {
      selection.removeAllRanges()
      selection.addRange(selected)
    }
    BODY.removeChild(ta)
  }
}
export const isOutime = function () {
  let updateTime
  if (CONFIG.outime.enable && LOCAL.outime) {
    const times = document.getElementsByTagName('time')
    if (times.length === 0) {
      return
    }
    const posts = document.getElementsByClassName('body md')
    if (posts.length === 0) {
      return
    }

    const now = Date.now() // 当前时间戳
    const pubTime = new Date(times[0].dateTime) // 文章发布时间戳
    if (times.length === 1) {
      updateTime = pubTime // 文章发布时间亦是最后更新时间
    } else {
      updateTime = new Date(times[1].dateTime) // 文章最后更新时间戳
    }
    // @ts-ignore
    const interval = parseInt(String(now - updateTime)) // 时间差
    const days = parseInt(String(CONFIG.outime.days)) || 30 // 设置时效，默认硬编码 30 天
    // 最后一次更新时间超过 days 天（毫秒）
    if (interval > days * 86400000) {
      // @ts-ignore
      const publish = parseInt(String((now - pubTime) / 86400000))
      const updated = parseInt(String(interval / 86400000))
      const template = LOCAL.template.replace('{{publish}}', String(publish)).replace('{{updated}}', String(updated))
      posts[0].insertAdjacentHTML('afterbegin', template)
    }
  }
}
export const clickMenu = function () {
  /**
   * 此函数用于修改右键点击显示菜单 <br/>
   * 需要在document下存在如下元素:
   * - id为clickMenu的容器(右键菜单容器)
   * - class为clickSubmenu的容器(可以有0到无限个)(子菜单容器)
   * CSS应有如下class:
   * - clickMenu的active类(控制显示)
   */
  const menuElement = $dom('#clickMenu')
  window.oncontextmenu = function (event) {
    if (event.ctrlKey) {
      // 当按下ctrl键时不触发自定义菜单
      return
    }
    event.preventDefault()
    let x = event.offsetX // 触发点到页面窗口左边的距离
    let y = event.offsetY
    const winWidth = window.innerWidth // 窗口的内部宽度（包括滚动条）
    const winHeight = window.innerHeight
    const menuWidth = menuElement.offsetWidth // 菜单宽度
    const menuHeight = menuElement.offsetHeight
    x = winWidth - menuWidth >= x ? x : winWidth - menuWidth
    y = winHeight - menuHeight >= y ? y : winHeight - menuHeight
    menuElement.style.top = y + 'px'
    menuElement.style.left = x + 'px'
    menuElement.classList.add('active')
    $dom.each('.clickSubmenu', (submenu) => {
      if (x > winWidth - menuWidth - submenu.offsetWidth) {
        submenu.style.left = '-200px'
      } else {
        submenu.style.left = ''
        submenu.style.right = '-200px'
      }
    })
  }
  window.addEventListener('click', function () {
    menuElement.classList.remove('active')
  })
}
/* 边栏分区 */
const sideBarToggleHandle = function (event, force) {
  if (sideBar.hasClass('on')) {
    sideBar.removeClass('on')
    menuToggle.removeClass('close')
    if (force) {
      // @ts-ignore
      // noinspection JSConstantReassignment
      sideBar.style = ''
    } else {
      transition(sideBar, 'slideRightOut')
    }
  } else {
    if (force) {
      // @ts-ignore
      // noinspection JSConstantReassignment
      sideBar.style = ''
    } else {
      transition(sideBar, 'slideRightIn', function () {
        sideBar.addClass('on')
        menuToggle.addClass('close')
      })
    }
  }
}

const sideBarTab = function () {
  const sideBarInner = sideBar.child('.inner')
  const panels = sideBar.find('.panel')

  if (sideBar.child('.tab')) {
    sideBarInner.removeChild(sideBar.child('.tab'))
  }

  const list = document.createElement('ul')
  let active = 'active'
  list.className = 'tab'
  ;['contents', 'related', 'overview'].forEach(function (item) {
    const element = sideBar.child('.panel.' + item)
    if (element.innerHTML.replace(/(^\s*)|(\s*$)/g, '').length < 1) {
      if (item === 'contents') {
        showContents.display('none')
      }
      return
    }

    if (item === 'contents') {
      showContents.display('')
    }

    const tab = document.createElement('li')
    const span = document.createElement('span')
    const text = document.createTextNode(element.attr('data-title'))
    span.appendChild(text)
    tab.appendChild(span)
    tab.addClass(item + ' item')

    if (active) {
      element.addClass(active)
      tab.addClass(active)
    } else {
      element.removeClass('active')
    }
    // TODO 出现BUG把event去掉
    tab.addEventListener('click', function (event) {
      const target = event.currentTarget
      if (target.hasClass('active')) return

      sideBar.find('.tab .item').forEach(function (element) {
        element.removeClass('active')
      })

      sideBar.find('.panel').forEach(function (element) {
        element.removeClass('active')
      })

      sideBar.child('.panel.' + target.className.replace(' item', '')).addClass('active')

      target.addClass('active')
    })

    list.appendChild(tab)
    active = ''
  })
  if (list.childNodes.length > 1) {
    sideBarInner.insertBefore(list, sideBarInner.childNodes[0])
    sideBar.child('.panels').style.paddingTop = ''
  } else {
    sideBar.child('.panels').style.paddingTop = '.625rem'
  }
}

const sidebarTOC = function () {
  const activateNavByIndex = function (index, lock) {
    const target = navItems[index]

    if (!target) return

    if (target.hasClass('current')) {
      return
    }

    $dom.each('.toc .active', function (element) {
      element && element.removeClass('active current')
    })

    sections.forEach(function (element) {
      element && element.removeClass('active')
    })

    target.addClass('active current')
    sections[index] && sections[index].addClass('active')

    let parent = target.parentNode

    while (!parent.matches('.contents')) {
      if (parent.matches('li')) {
        parent.addClass('active')
        const t = $dom(parent.child('a.toc-link').attr('href'))
        if (t) {
          t.addClass('active')
        }
      }
      parent = parent.parentNode
    }
    // Scrolling to center active TOC element if TOC content is taller than viewport.
    if (getComputedStyle(sideBar).display !== 'none' && tocElement.hasClass('active')) {
      pageScroll(tocElement, target.offsetTop - tocElement.offsetHeight / 4)
    }
  }
  const navItems = $dom.all('.contents li')
  if (navItems.length < 1) {
    return
  }

  let sections = Array.prototype.slice.call(navItems) || []
  let activeLock = null

  sections = sections.map(function (element, index) {
    const link = element.child('a.toc-link')
    const anchor = $dom(decodeURI(link.attr('href')))
    if (!anchor) return null
    const alink = anchor.child('a.anchor')

    const anchorScroll = function (event) {
      event.preventDefault()
      const target = $dom(decodeURI(event.currentTarget.attr('href')))

      activeLock = index
      pageScroll(target, null, function () {
        activateNavByIndex(index)
        activeLock = null
      })
    }

    // TOC item animation navigate.
    link.addEventListener('click', anchorScroll)
    alink &&
      alink.addEventListener('click', function (event) {
        anchorScroll(event)
        clipBoard(CONFIG.hostname + '/' + LOCAL.path + event.currentTarget.attr('href'))
      })
    return anchor
  })

  const tocElement = sideBar.child('.contents.panel')

  const findIndex = function (entries) {
    let index = 0
    let entry = entries[index]

    if (entry.boundingClientRect.top > 0) {
      index = sections.indexOf(entry.target)
      return index === 0 ? 0 : index - 1
    }
    for (; index < entries.length; index++) {
      if (entries[index].boundingClientRect.top <= 0) {
        entry = entries[index]
      } else {
        return sections.indexOf(entry.target)
      }
    }
    return sections.indexOf(entry.target)
  }

  const createIntersectionObserver = function () {
    if (!window.IntersectionObserver) return

    const observer = new IntersectionObserver(
      function (entries, observe) {
        const index = findIndex(entries) + (diffY < 0 ? 1 : 0)
        if (activeLock === null) {
          activateNavByIndex(index)
        }
      },
      {
        rootMargin: '0px 0px -100% 0px',
        threshold: 0
      }
    )

    sections.forEach(function (element) {
      element && observer.observe(element)
    })
  }

  createIntersectionObserver()
}

const backToTopHandle = function () {
  pageScroll(0)
}

const goToBottomHandle = function () {
  pageScroll(parseInt(String(Container.changeOrGetHeight())))
}

const goToCommentHandle = function () {
  pageScroll($dom('#comments'))
}

const menuActive = function () {
  $dom.each('.menu .item:not(.title)', function (element) {
    const target = element.child('a[href]')

    const parentItem = element.parentNode.parentNode
    if (!target) return
    const isSamePath = target.pathname === location.pathname || target.pathname === location.pathname.replace('index.html', '')
    const isSubPath = location.pathname.startsWith(target.pathname)
    const active = target.hostname === location.hostname && (isSamePath || isSubPath)
    element.toggleClass('active', active)
    if (element.parentNode.child('.active') && parentItem.hasClass('dropdown')) {
      parentItem.removeClass('active').addClass('expand')
    } else {
      parentItem.removeClass('expand')
    }
  })
}

const postBeauty = function () {
  // loadComments()

  if (!$dom('.md')) {
    return
  }

  // postFancybox('.post.block')

  // $dom('.post.block').oncopy = async function (event) {
  //   showtip(LOCAL.copyright)

  //   if (LOCAL.nocopy) {
  //     event.preventDefault()
  //     return
  //   }

  //   const copyright = await $dom.asyncify('#copyright')
  //   if (window.getSelection().toString().length > 30 && copyright) {
  //     event.preventDefault()
  //     const author = '# ' + copyright.child('.author').innerText
  //     const link = '# ' + copyright.child('.link').innerText
  //     const license = '# ' + copyright.child('.license').innerText
  //     const htmlData = author + '<br>' + link + '<br>' + license + '<br><br>' + window.getSelection().toString().replace(/\r\n/g, '<br>')

  //     const textData = author + '\n' + link + '\n' + license + '\n\n' + window.getSelection().toString().replace(/\r\n/g, '\n')
  //     if (event.clipboardData) {
  //       event.clipboardData.setData('text/html', htmlData)
  //       event.clipboardData.setData('text/plain', textData)
  //     } else {
  //       // @ts-ignore
  //       if (window.clipboardData) {
  //         // @ts-ignore
  //         return window.clipboardData.setData('text', textData)
  //       }
  //     }
  //   }
  // }

  // $dom.each('li ruby', function (element) {
  //   let parent = element.parentNode
  //   // @ts-ignore
  //   if (element.parentNode.tagName !== 'LI') {
  //     parent = element.parentNode.parentNode
  //   }
  //   parent.addClass('ruby')
  // })

  // $dom.each('ol[start]', function (element) {
  //   // @ts-ignore
  //   element.style.counterReset = 'counter ' + parseInt(element.attr('start') - 1)
  // })

  // $dom.each('.md table', function (element) {
  //   element.wrapObject({
  //     className: 'table-container'
  //   })
  // })

  // $dom.each('.highlight > .table-container', function (element) {
  //   element.className = 'code-container'
  // })

  // $dom.each('figure.highlight', function (element) {
  //   const code_container = element.child('.code-container')
  //   const caption = element.child('figcaption')

  //   element.insertAdjacentHTML(
  //     'beforeend',
  //     '<div class="operation"><span class="breakline-btn"><i class="ic i-align-left"></i></span><span class="copy-btn"><i class="ic i-clipboard"></i></span><span class="fullscreen-btn"><i class="ic i-expand"></i></span></div>'
  //   )

  //   const copyBtn = element.child('.copy-btn')
  //   if (LOCAL.nocopy) {
  //     copyBtn.remove()
  //   } else {
  //     copyBtn.addEventListener(
  //       'click',
  //       function (event) {
  //         const target = event.currentTarget
  //         let comma = ''
  //         let code = ''
  //         code_container.find('pre').forEach(function (line) {
  //           code += comma + line.innerText
  //           comma = '\n'
  //         })

  //         clipBoard(code, function (result) {
  //           target.child('.ic').className = result ? 'ic i-check' : 'ic i-times'
  //           target.blur()
  //           showtip(LOCAL.copyright)
  //         })
  //       },
  //       { passive: true }
  //     )
  //     copyBtn.addEventListener('mouseleave', function (event) {
  //       setTimeout(function () {
  //         event.target.child('.ic').className = 'ic i-clipboard'
  //       }, 1000)
  //     })
  //   }

  //   const breakBtn = element.child('.breakline-btn')
  //   breakBtn.addEventListener('click', function (event) {
  //     const target = event.currentTarget
  //     if (element.hasClass('breakline')) {
  //       element.removeClass('breakline')
  //       target.child('.ic').className = 'ic i-align-left'
  //     } else {
  //       element.addClass('breakline')
  //       target.child('.ic').className = 'ic i-align-justify'
  //     }
  //   })

  //   const fullscreenBtn = element.child('.fullscreen-btn')
  //   const removeFullscreen = function () {
  //     element.removeClass('fullscreen')
  //     element.scrollTop = 0
  //     BODY.removeClass('fullscreen')
  //     fullscreenBtn.child('.ic').className = 'ic i-expand'
  //   }
  //   const fullscreenHandle = function (event) {
  //     const target = event.currentTarget
  //     if (element.hasClass('fullscreen')) {
  //       removeFullscreen()
  //       if (code_container && code_container.find('tr').length > 15) {
  //         const showBtn = code_container.child('.show-btn')
  //         code_container.style.maxHeight = '300px'
  //         showBtn.removeClass('open')
  //       }
  //       pageScroll(element)
  //     } else {
  //       element.addClass('fullscreen')
  //       BODY.addClass('fullscreen')
  //       fullscreenBtn.child('.ic').className = 'ic i-compress'
  //       if (code_container && code_container.find('tr').length > 15) {
  //         const showBtn = code_container.child('.show-btn')
  //         code_container.style.maxHeight = ''
  //         showBtn.addClass('open')
  //       }
  //     }
  //   }
  //   fullscreenBtn.addEventListener('click', fullscreenHandle)
  //   caption && caption.addEventListener('click', fullscreenHandle)

  //   if (code_container && code_container.find('tr').length > 15) {
  //     code_container.style.maxHeight = '300px'
  //     code_container.insertAdjacentHTML('beforeend', '<div class="show-btn"><i class="ic i-angle-down"></i></div>')
  //     const showBtn = code_container.child('.show-btn')

  //     const hideCode = function () {
  //       code_container.style.maxHeight = '300px'
  //       showBtn.removeClass('open')
  //     }
  //     const showCode = function () {
  //       code_container.style.maxHeight = ''
  //       showBtn.addClass('open')
  //     }

  //     showBtn.addEventListener('click', function (event) {
  //       if (showBtn.hasClass('open')) {
  //         removeFullscreen()
  //         hideCode()
  //         pageScroll(code_container)
  //       } else {
  //         showCode()
  //       }
  //     })
  //   }
  // })

  // $dom.asyncifyEach('pre.mermaid > svg', function (element) {
  //   const temp = element
  //   temp.style.maxWidth = ''
  // })

  $dom.each('.reward button', function (element) {
    element.addEventListener('click', function (event) {
      event.preventDefault()
      const qr = $dom('#qr')
      if (qr.display() === 'inline-flex') {
        transition(qr, 0)
      } else {
        transition(qr, 1, function () {
          qr.display('inline-flex')
        }) // slideUpBigIn
      }
    })
  })

  // // quiz
  // $dom.asyncifyEach('.quiz > ul.options li', function (element) {
  //   element.addEventListener('click', function (event) {
  //     if (element.hasClass('correct')) {
  //       element.toggleClass('right')
  //       element.parentNode.parentNode.addClass('show')
  //     } else {
  //       element.toggleClass('wrong')
  //     }
  //   })
  // })

  // $dom.asyncifyEach('.quiz > p', function (element) {
  //   element.addEventListener('click', function (event) {
  //     element.parentNode.toggleClass('show')
  //   })
  // })

  // $dom.asyncifyEach('.quiz > p:first-child', function (element) {
  //   const quiz = element.parentNode
  //   let type = 'choice'
  //   if (quiz.hasClass('true') || quiz.hasClass('false')) {
  //     type = 'true_false'
  //   }
  //   if (quiz.hasClass('multi')) {
  //     type = 'multiple'
  //   }
  //   if (quiz.hasClass('fill')) {
  //     type = 'gap_fill'
  //   }
  //   if (quiz.hasClass('essay')) {
  //     type = 'essay'
  //   }
  //   element.attr('data-type', LOCAL.quiz[type])
  // })

  // $dom.asyncifyEach('.quiz .mistake', function (element) {
  //   element.attr('data-type', LOCAL.quiz.mistake)
  // })

  // $dom.each('div.tags a', function (element) {
  //   element.className = ['primary', 'success', 'info', 'warning', 'danger'][Math.floor(Math.random() * 5)]
  // })

  // $dom.asyncifyEach('.md div.player', function (element) {
  //   mediaPlayer(element, {
  //     type: element.attr('data-type'),
  //     mode: 'order',
  //     btns: []
  //   })
  //     .player.load(JSON.parse(element.attr('data-src')))
  //     .fetch()
  // })
}

export const changeThemeByBtn = function () {
  let c
  const btn = $dom('.theme').child('.ic')

  const neko = BODY.createChild('div', {
    id: 'neko',
    innerHTML:
      '<div class="planet"><div class="sun"></div><div class="moon"></div></div><div class="body"><div class="face"><section class="eyes left"><span class="pupil"></span></section><section class="eyes right"><span class="pupil"></span></section><span class="nose"></span></div></div>'
  })

  const hideNeko = function () {
    transition(
      neko,
      {
        // @ts-ignore
        delay: 2500,
        opacity: 0
      },
      function () {
        BODY.removeChild(neko)
      }
    )
  }

  if (btn.hasClass('i-sun')) {
    c = function () {
      neko.addClass('dark')
      changeTheme('dark')
      $storage.set('theme', 'dark')
      hideNeko()
    }
  } else {
    neko.addClass('dark')
    c = function () {
      neko.removeClass('dark')
      changeTheme()
      $storage.set('theme', 'light')
      hideNeko()
    }
  }
  transition(neko, 1, function () {
    setTimeout(c, 210)
  })
}

export const domInit = function () {
  $dom.each('.overview .menu > .item', function (el) {
    // siteNav.child('.menu').appendChild(el.cloneNode(true))
  })

  loadCat.addEventListener('click', Loader.vanish)
  menuToggle.addEventListener('click', sideBarToggleHandle)
  $dom('.dimmer').addEventListener('click', sideBarToggleHandle)

  quickBtn.child('.down').addEventListener('click', goToBottomHandle)
  quickBtn.child('.up').addEventListener('click', backToTopHandle)

  if (!toolBtn) {
    toolBtn = siteHeader.createChild('div', {
      id: 'tool',
      innerHTML:
        '<div class="item player"></div><div class="item contents"><i class="ic i-list-ol"></i></div><div class="item chat" style="display: none;"><i class="ic i-comments"></i></div><div class="item back-to-top"><i class="ic i-arrow-up"></i><span>0%</span></div>'
    })
  }

  // toolPlayer = toolBtn.child('.player')
  backToTop = toolBtn.child('.back-to-top')
  // goToComment = toolBtn.child('.chat')
  showContents = toolBtn.child('.contents')

  backToTop.addEventListener('click', backToTopHandle)
  // goToComment.addEventListener('click', goToCommentHandle)
  showContents.addEventListener('click', sideBarToggleHandle)

  // if (typeof mediaPlayer !== 'undefined') {
  //   mediaPlayer(toolPlayer)

  //   $dom('main').addEventListener('click', function () {
  //     toolPlayer.player.mini()
  //   })
  // }
}

const pjaxReload = function () {
  pagePosition()

  if (sideBar.hasClass('on')) {
    transition(sideBar, function () {
      sideBar.removeClass('on')
      menuToggle.removeClass('close')
    }) // 'transition.slideRightOut'
  }
  const mainNode = $dom('#main')

  // $('#main').innerHTML = ''
  // $('#main').appendChild(loadCat.lastChild.cloneNode(true));
  mainNode.innerHTML = ''
  mainNode.appendChild(loadCat.lastElementChild.cloneNode(true))
  pageScroll(0)
}

export const siteRefresh = function (reload) {
  LOCAL_HASH = 0
  LOCAL_URL = window.location.href
  // vendorCss('katex')
  // vendorJs('copy_tex')
  // vendorCss('mermaid')
  // vendorJs('chart')
  // if (reload !== 1) {
  //   $dom.each('script[data-pjax]', pjaxScript)
  // }
  // originTitle = document.title
  resizeHandle()
  menuActive()
  sideBarTab()
  sidebarTOC()
  // registerExtURL()
  postBeauty()
  // tabFormat()
  // if (typeof mediaPlayer !== 'undefined') {
  //   toolPlayer.player.load(LOCAL.audio || CONFIG.audio || {})
  // }
  Loader.hide()
  setTimeout(function () {
    positionInit()
  }, 500)
  cardActive()
  lazyload.observe()
  // isOutime()
}

export const siteInit = function () {
  domInit()
  pjax = new Pjax({
    selectors: ['head title', '.languages', '.pjax', '.leancloud-recent-comment', , 'script[data-config]'],
    analytics: false,
    cacheBust: false
  })
  // autoDarkmode()
  window.addEventListener('scroll', scrollHandle)
  window.addEventListener('resize', resizeHandle)
  window.addEventListener('pjax:send', pjaxReload)
  window.addEventListener('pjax:success', siteRefresh)
  window.addEventListener('beforeunload', function () {
    pagePosition()
  })
  siteRefresh(1)
}
