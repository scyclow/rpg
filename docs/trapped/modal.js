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
        opacity: 0;
        display: none;
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
        opacity:0.75;
        transition: 0.3s;
      }
      #x:hover {
        opacity: 1
      }



    </style>


    <div id="modelParent" class="hidden">
      <article>
        <div id="bg" ></div>
        <div id="modal" >
          <slot name="content"></slot>
        </div>

      </article>
      <div id="x" style="display: none">close</div>
    </div>
  `,
  {display: false},
  (ctx) => {
    ctx.$bg = ctx.$('#bg')
    ctx.$x = ctx.$('#x')
    ctx.$modal = ctx.$('#modal')
    ctx.$modelParent = ctx.$('#modelParent')


    const blur = ctx.getAttribute('blur')
    const display = ctx.getAttribute('display')
    if (blur) {
      ctx.$bg.classList.add('blur')
    }

    if (display) {
      ctx.setState({ display: true })
    }

    let onClose = noop
    ctx.onClose = cb => onClose = cb

    ctx.close = () => {
      ctx.setState({ display: false })
      onClose()
    }

    ctx.open = () => {
      ctx.setState({ display: true })
    }

    ctx.$bg.onclick = ctx.close
    ctx.$x.onclick = ctx.close

  },
  (ctx) => {
    const escClose = e => {
      if (e.key === 'Escape') ctx.close()
    }

    if (ctx.state.display) {
      ctx.$modelParent.classList.remove('hidden')
      document.addEventListener('keydown', escClose)
    } else {
      ctx.$modelParent.classList.add('hidden')
      document.removeEventListener('keydown', escClose)
    }

  },
)