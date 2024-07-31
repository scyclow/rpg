export class StateMachine {
  constructor(startingCtx, config, nodes) {
    this.ctx = startingCtx
    this.nodes = nodes
    this.defaultWait = config.defaultWait ?? 1000
    this.onUpdate = config.onUpdate || (() => {})
    this.currentNodeKey = config.start
    this.queue = []
  }

  getNode(nodeKey) {
    const [baseKey, keyIx] = this.splitNodeKeys(nodeKey)
    return Array.isArray(this.nodes[baseKey])
      ? this.nodes[baseKey][keyIx]
      : this.nodes[baseKey]
  }

  splitNodeKeys(nodeKey) {
    const [baseKey, keyIx] = nodeKey.split('.')
    return Array.isArray(this.nodes[baseKey])
      ? [baseKey, Number(keyIx || 0)]
      : [baseKey, null]

  }


  async next(ur) {
    this.run(ur, 'handler')
  }

  redirect(newNode) {
    this.currentNodeKey = newNode
  }

  async run(ur, fn) {
    const currentNode = this.getNode(this.currentNodeKey)

    const nextNodeKey = await this.getNextNodeKey(fn, this.currentNodeKey, ur)

    this.ctx.lastNode = this.currentNodeKey
    this.ctx.currentNode = nextNodeKey

    await this.evaluate(currentNode.after, ur)

    const wait = currentNode.wait || this.defaultWait
    this.enqueue(nextNodeKey, ur, wait, fn === 'follow')
  }

  nodeIsArray(key) {
    return key.includes('.') || Array.isArray(this.nodes[key])
  }

  async getNextNodeKey(fn, key, ur) {
    const currentNode = this.getNode(key)
    const evaluated = await this.evaluate(currentNode[fn], ur)

    if (evaluated) {
      return evaluated
    } else if (this.nodeIsArray(key)) {
      const [baseKey, keyIx] = this.splitNodeKeys(key)
      return `${baseKey}.${Number(keyIx) + 1}`
    }
  }

  async evaluate(handler, ur='', fallback='') {
    if (!handler) {
      return fallback
    }
    if (typeof handler === 'string') return handler || fallback
    if (typeof handler === 'object') return handler || fallback

    return await handler({
      ur,
      ctx: this.ctx,
      enqueue: this.enqueue.bind(this),
      redirect: this.redirect.bind(this)
    }) || fallback
  }

  goto(nodeKey) {
    this.enqueue(nodeKey)
  }

  enqueue(nodeKey, ur='', wait=0, isFollow=false) {
    if (!nodeKey) return

    this.queue.push({
      nodeKey,
      ur,
      wait,
      isFollow,
      timestamp: Date.now() + wait
    })

    this.queue.sort((a, b) => a.timestamp - b.timestamp)
    this.scheduleQueueShift(wait)
  }

  scheduleQueueShift(wait=0) {
    setTimeout(() => {
      const event = this.queue[0]
      if (!event) return

      if (event.timestamp <= Date.now()) {
        this.shiftQueue()
      } else {
        this.scheduleQueueShift(Date.now() - event.timestamp)
      }
    }, wait)
  }

  async shiftQueue() {
    if (!this.queue.length) return

    const event = this.queue.shift()
    this.scheduleQueueShift(1)

    this.currentNodeKey = event.nodeKey
    const currentNode = this.getNode(event.nodeKey)
    await this.evaluate(currentNode.before, event.ur)

    this.onUpdate(
      await this.evaluate({...currentNode, text: await this.evaluate(currentNode.text)}, event.ur),
      this
    )

    if (currentNode.follow) this.run(event.ur, 'follow')
    if (this.nodeIsArray(this.currentNodeKey)) {
      const [base, ix] = this.splitNodeKeys(this.currentNodeKey)
      if (ix + 1 < this.nodes[base].length) {
        this.run(event.ur, 'follow')
      }
    }
  }
}

export class CTX {
  constructor(props={}) {
    this.history = []
    this.state = {}
    this.lastNode = ''
    this.currentNode = ''
    this.stack = []
    Object.assign(this, props)
  }
}