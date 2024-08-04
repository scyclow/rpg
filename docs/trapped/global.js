import {persist} from './persist.js'

export const globalState = persist('__GLOBAL_STATE', {
  routerRestartTime: 0
})