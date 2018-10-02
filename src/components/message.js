const Component = require('choo/component')
const html = require('choo/html')
const raw = require('choo/html/raw')
const tinydate = require('tinydate').default
const anchorme = require('anchorme').default
const fileType = require('file-type')

const stamp = tinydate('{DD}/{MM}/{YY} {HH}:{mm}:{ss}')

const parseMessage = message => {
  const anchor = anchorme(message, { list: true })
  if (anchor.length) {
    // detect file type
    return Promise.all(anchor.map(async anchorData => {
      const controller = new window.AbortController()
      const signal = controller.signal

      const fetchPromise = window.fetch(anchorData.raw, { signal })

      // 5 second timeout:
      setTimeout(() => controller.abort(), 5000)
      const response = await fetchPromise

      if (!response) return ''
      const ab = await response.arrayBuffer()
      const ft = fileType(ab)
      if (ft && ft.mime.includes('image')) {
        return html`<img class="mw-100" style="height: 300px"src="${anchorData.raw}"/>`
      } else return ''
    })).then(out => {
      // prepare output
      var f = anchorme(message)
      console.log(f)
      return html`
        <span class="lh-copy">
          ${out.filter(img => img)}
        </span>
      `
    })
  } else {
    return Promise.resolve()
  }
}

class Message extends Component {
  constructor (id, choo, f, opts) {
    super()
    this.local = {
      extra: ''
    }
    this.parent = {}
    this.parent.updateHeight = opts.updateHeight
  }

  update ({ message }) {
    if (this.local.message !== message) return true
  }

  load (el) {
    parseMessage(this.local.message)
      .then(msg => {
        if (msg) {
          this.local.extra = msg
          this.rerender()
        }
      })
      .catch(console.log)
  }

  createElement (props) {
    const { username, message, timestamp } = props
    const { extra } = this.local

    this.local.message = message

    const date = stamp(new Date(timestamp))
    return html`
      <div class="flex h-auto mt3 tl" style="min-height:2rem">
        <div class="flex mr2 mr4-ns h2 br3 order-1">
          <div data-balloon="${date}" data-balloon-pos="right">
            <div class="dib w3 w4-ns truncate"><span>${username}</span></div>
          </div>
        </div>
        <div class="flex order-2 olaf__message">
          <p class="dib bg-white w-auto f6 pa3 br3 ba b--white f5-ns lh-copy measure measure-wide-ns mv0" style="word-break: break-all;">
            ${raw(anchorme(message))}
          </p>
        </div>
        ${extra}
      </div>
    `
  }

  afterupdate () {
    if (this.parent.updateHeight) {
      this.parent.updateHeight(this.element.scrollHeight)
    }
  }
}

module.exports = Message
