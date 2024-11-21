import {$, createComponent} from './$.js'
import {drawLabrynth} from './labrynth.js'



createComponent(
  'smart-frame',
  `
    <style>
      * {
        padding: 0;
        margin: 0;
      }

      #screen {
        width: 85vmin;
        height: 85vmin;
        border: 2px solid #262626;
        border-radius: 3px;
        background: #333333;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      h1 {
        color: #fff;
        padding: 1em;
        text-align: center;
      }

      #nftDisplay {
        border: 0;
        width: 100%;
        height: 100%;
        flex: 1;
      }

    </style>

    <div id="screen">
    </div>
  `,
  {},
  ctx => {
    ctx.refresh = () => {
      ctx.setState({}, true)
    }
  },
  ctx => {
    if (globalState.castingNFT != null) {
      ctx.$('#screen').innerHTML = `<div id="nftDisplay"></div>`

      drawLabrynth({ hash: globalState.castingNFT }, ctx.$('#nftDisplay'))

    } else {
      ctx.$('#screen').innerHTML = `
        <h1>Download the official SmartFrame app to display your favorite NFT here!</h1>
      `
    }
  },
  () => {}
)