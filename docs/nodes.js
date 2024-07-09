import {StateMachine} from './stateMachine.js'

const startingCtx = {
  history: []
}

const config = {
  defaultWait: 100,
  onUpdate(text) {
    console.log(text)
    startingCtx.history.push(text)
  },
  start: 'start'
}

const nodes = {
  start: {
    handler: 'node1'
  },

  node1: {
    before: () => {},
    text: 'inside node1',
    handler: 'node2',
    wait: 1000,
    after: () => {}
  },

  node2: {
    text: 'inside node2',
    handler: x => x.ur === 'a' ? 'node3a' : 'node3b'
  },

  node3a: {
    text: 'inside node3a',
    follow: 'node4'
  },

  node3b: {
    text: 'inside node3b',
    follow: 'node4'
  },

  node4: [
    'blah', // node4.0
    () => 'blah blah', // node4.1
    { // node4.2
      before: () => {},
      text: 'blah blah blah',
      handler: 'node1',
      after: () => {}
    }
  ]
}

window.sm = new StateMachine(startingCtx, config, nodes)
