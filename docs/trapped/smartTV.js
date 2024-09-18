import {$, createComponent} from './$.js'
import {persist} from './persist.js'



const state = persist('__TV_STATE', {
  screen:
})


createComponent(
  'smart-tv',
  `
    <style>
      * {
        padding: 0;
        margin: 0;
        scrollbar-width: thin;
      }

      #tv {
        width: min(90vw, calc(85vh * 16 / 9));
        height: min(85vh, calc(90vw * 9 / 16));
        background: #00f;

        border: 2px solid #262626;
        box-shadow: 0 0 3em #00f, 0 0 10em #00f;
        border-radius: 3px;
        display: flex;

        justify-content: space-between;
        align-items: center;
        flex-direction: column;


        color: #fff;

      }

      #mobileContainer {
        overflow: scroll;
        display: flex;

      }

      mobile-phone {
        display: flex;
        width: 100%;
        min-width: 320px;
        min-height: 600px;
        border-right: 1px solid #000;
      }


      @media (max-aspect-ratio: 0.95) and (max-width: 550px) {
        #tv {
          transform: rotate(90deg);

          width: min(90vh, calc(85vw * 16 / 9));
          height: min(85vw, calc(90vh * 9 / 16));
        }
      }

    </style>

    <div id="tv">
      <div></div>

      <h1>NO SIGNAL</h1>


      <div style="display: flex; align-self: flex-start; padding: 0.5em">
        <h3>MENU</h3>
        <h3>POWER OFF</h3>
      </div>

      <!--
        <div id="mobileContainer" style="display: none">
          <mobile-phone screen-only="true" id="blah"></mobile-phone>
          <mobile-phone screen-only="true" ></mobile-phone>
          <mobile-phone screen-only="true" ></mobile-phone>
        </div>
      -->


    </div>
  `,
  state,
  ctx => {
    // ctx.$('#blah').onClose = () => console.log('blah')
  },
  ctx => {},
  (oldState, newState, stateUpdate) => {}
)