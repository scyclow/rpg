
export const $ = (elem, prop, value) => elem.style[prop] = value

window.$ = $
$.cls = (selector, elem=document) => Array.isArray(elem)
  ? elem.map(e => $.cls(e, selector)).flat()
  : Array.from(elem.getElementsByClassName(selector))

$.id = (selector, elem=document) => Array.isArray(elem)
  ? elem.find(e => $.id(e, selector))
  : elem.getElementById(selector)


$.render = (e, children) => {
  if (!children) return
  else if (typeof children === 'string') e.innerHTML = children
  else if (Array.isArray(children)) {
    if (typeof children[0] === 'string') {
      children.forEach(child => {
        e.innerHTML += (
          typeof child === 'string' ? child : child.outerHTML
        )
      })
    } else {
      e.append(...children.flat())
    }
  }
  else {
    e.append(children)
  }
}


$.create = elType => (children, attrs={}) => {
  const e = document.createElement(elType)
  $.render(e, children)

  Object.keys(attrs).forEach(a => {
    e.setAttribute(a, attrs[a])
  })

  return e
}

$.p = $.create('p')
$.a = $.create('a')
$.li = $.create('li')
$.div = $.create('div')
$.span = $.create('span')
$.main = $.create('main')
$.section = $.create('section')


const $html = document.getElementsByTagName('html')[0]

export let queryParams

try {
  queryParams = window.location.search
    ? window.location.search.replace('?', '').split('&').reduce((params, i) => {
        const [k, v] = i.split('=')
        params[k] = v
        return params
      }, {})
    : {}
} catch (e) {
  queryParams = {}
}




const addMetaTag = (args) => {
  const meta = document.createElement('meta')
  Object.keys(args).forEach(arg => {
    meta[arg] = args[arg]
  })

  document.head.appendChild(meta)
}

const addThumbnail = (fill) => {
  const existing = document.getElementById('favicon')
  if (existing) document.head.removeChild(existing)
  const link = document.createElement('link')
  link.href = `data:image/svg+xml;base64,${btoa(
    `<svg viewBox="0 0 1 1" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="1" height="1" fill="${fill}"></rect></svg>`
  )}`
  link.rel = 'shortcut icon'
  link.type = 'image/svg+xml'
  link.id = 'favicon'
  document.head.appendChild(link)
}

function css(style) {
  const s = document.createElement('style')
  s.innerHTML = style
  document.head.appendChild(s)
}


function setMetadata() {
  $html.translate = false
  $html.lang = 'en'
  $html.className = 'notranslate'

  addMetaTag({ name: 'google', content: 'notranslate' })
}

setMetadata()

export const ls = {
  get(key) {
    try {
      return window.localStorage && window.localStorage.getItem && JSON.parse(window.localStorage.getItem(key))
    } catch (e) {
      console.log(e)
    }
  },
  set(key, value) {
    try {
      return window.localStorage.setItem(key, value)
    } catch (e) {
      console.log(e)
    }
  }
}

export function setFavicon(c1, c2) {
  $.id('favicon').href = `data:image/svg+xml;base64,${btoa(`
    <svg width="768" height="768" viewBox="0 0 768 768" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M384 80.2011L710 391.54V710H58V391.54L384 80.2011Z" fill="${c1}" stroke="${c2}" stroke-width="128"/>
    </svg>
  `)}`
}

window.ls = ls

export const createComponent = (tag, templateStr, initialState, onInit, onRender, onSetState=noop, broadcast={}) => {
  const Instances = []

  class ReactStyleComponent extends HTMLElement {
    constructor() {
      super();

      // Initialize component state (similar to React's state)
      this.state = Object.assign({}, initialState)
      this.oldState = this.state
      this.events = {}

      // Create a shadow DOM and attach it to the element
      const shadowRoot = this.attachShadow({ mode: 'open' })

      // Define a template for the web component
      const template = document.createElement('template');
      template.innerHTML = templateStr;

      // Clone the template content and append it to the shadow DOM
      shadowRoot.appendChild(template.content.cloneNode(true));

      const qs = shadowRoot.querySelector.bind(shadowRoot)
      const qsa = shadowRoot.querySelectorAll.bind(shadowRoot)

      this.$ = selector => {
        const e = qs(selector)
        if (selector[0] === '.') {
          return e ? Array.from(e) : []
        } else {
          return e
        }
      }

      this.qsa = selector => {
        const e = qsa(selector)
        if (selector[0] === '.') {
          return e ? Array.from(e) : []
        } else {
          return e
        }
      }

      this.onRender = onRender
      onInit(this)
      Instances.push(this)
    }

    veiwState() {
      return this.state
    }

    // Define a method to set the component state
    setState(stateUpdate, force=false, ignoreBroadcast=false) {
      this.oldState = this.state
      this.state = { ...this.state, ...stateUpdate }

      onSetState(this.oldState, this.state, stateUpdate)


      if (deepEquals(this.state, this.oldState) && !force) return
      this.render()

      if (broadcast.enabled && !ignoreBroadcast) {
        Instances.forEach((ctx, i) => {
          setTimeout(() => {
            if (ctx === this) return
            if (broadcast?.ignoreFn?.(stateUpdate)) return
            else ctx.setState(stateUpdate, false, true)
          }, 10 + i*broadcast.delay)
        })
        // this.state.screen = screen
      }
    }

    // Define a method to render the component
    render() {
      this.onRender(this)
    }

    // Called when the element is connected to the DOM
    connectedCallback() {
      this.render();
    }

    registerEventHandler(event, fn) {
      if (this.events[event]) this.events[event].push(fn)
      else this.events[event] = [fn]
    }
  }

  customElements.define(tag, ReactStyleComponent)
}

