import {createComponent} from './$.js'

createComponent(
  'trapped-modal',
  `
    <style>
      * {
        margin: 0;
        padding: 0;
        font-family: var(--default-font);
        opacity: 1;
        transition: 0.3s;
      }

      #bg {
        position: fixed;
        left: 0;
        top: 0;
        height: 100vh;
        width: 100vw;
        background: #000;
        cursor: pointer;
        background: rgba(0,0,0,0.6);
        transition: 0.3s
      }

      .deepFocus #bg {
        background: rgba(0,0,0,1);
      }

      .multitask {
        pointer-events: none;
      }
      .multitask #modal {
        pointer-events: auto;

      }
      .multitask #bg {
        background: rgba(0,0,0,0);
        pointer-events: none;
        backdrop-filter: blur(0);
      }

      .blur {
        backdrop-filter: blur(1px);
        -webkit-backdrop-filter: blur(1px);
      }

      #modal {
        z-index: 501;
      }

      .hidden, .hidden * {
        pointer-events: none;
        display: none;
      }

      .invisible {
        opacity: 0;
        pointer-events: none;
      }

      article {
        z-index: 500;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        height: 100vh;
        width: 100vw;
        top: 0;
        left: 0;
      }

      #x {
        cursor: pointer;
        position: absolute;
        display: inline-block;
        padding: 1em;
        color: #fff;
        top:0;
        right: 0;
        z-index:501;
        font-size:1.2em;
        opacity: 0;
        transition: 0.6s;
        user-select: none;
      }

      #bg:hover #x {
        opacity: 0.75;
      }
      #x:hover {
        opacity: 1
      }



    </style>


    <div id="modelParent" class="hidden">
      <article id="container">
        <div id="bg">
          <div id="x">close</div>
        </div>
        <div id="modal" >
          <slot name="content"></slot>
        </div>

      </article>
    </div>
  `,
  {display: false, bgMode: 1},
  (ctx) => {
    ctx.$bg = ctx.$('#bg')
    ctx.$container = ctx.$('#container')
    ctx.$x = ctx.$('#x')
    ctx.$modal = ctx.$('#modal')
    ctx.$modelParent = ctx.$('#modelParent')


    const blur = ctx.getAttribute('blur')
    const display = ctx.getAttribute('display')
    const bgMode = ctx.state.bgMode ?? ctx.getAttribute('bgMode')

    if (blur) {
      ctx.$bg.classList.add('blur')
    }

    if (display) {
      ctx.setState({ display: true })
    }

    let onClose = noop
    ctx.onClose = cb => onClose = cb

    let lastClose = Date.now()
    ctx.close = () => {
      if (lastClose + 1200 < Date.now()) {
        ctx.setState({ display: false })
        onClose()
        lastClose = Date.now()
      } else  {
        console.log('blah')
      }
    }

    ctx.open = () => {
      ctx.setState({ display: true })
    }

    ctx.setBgMode = (bgMode) => {
      ctx.setState({ bgMode })
    }

    ctx.$bg.onclick = ctx.close
    // ctx.$x.onclick = ctx.close

  },
  (ctx) => {
    const escClose = e => {
      if (e.key === 'Escape' && ctx.state.display) ctx.close()
    }

    if (ctx.state.display) {
      ctx.$modelParent.classList.remove('hidden')
      setTimeout(() => {
        ctx.$modelParent.classList.remove('invisible')
      })
      document.addEventListener('keyup', escClose)
    } else {
      ctx.$modelParent.classList.add('invisible')
      setTimeout(() => {
        ctx.$modelParent.classList.add('hidden')
      }, 1000)
      document.removeEventListener('keyup', escClose)
    }

    if (ctx.state.bgMode === 0) {
      ctx.$container.classList.add('multitask')
      ctx.$container.classList.remove('deepFocus')
    }
    else if (ctx.state.bgMode === 1) {
      ctx.$container.classList.remove('multitask')
      ctx.$container.classList.remove('deepFocus')
    }
    else if (ctx.state.bgMode === 2) {
      ctx.$container.classList.remove('multitask')
      ctx.$container.classList.add('deepFocus')
    }

  },
)