export class StateMachine {
  constructor(startingCtx, config, nodes) {
    this.ctx = startingCtx
    this.nodes = nodes
    this.defaultWait = config.defaultWait ?? 1000
    this.onUpdate = config.onUpdate || (() => {})
    this.queue = []
    this.start = this.ctx.currentNode
    this.alive = false
    this.clearQueue = config.clearQueue || false
  }

  getNode(nodeKey) {
    const [baseKey, keyIx] = this.splitNodeKeys(nodeKey || this.ctx.fallbackNode)
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


  async next(ur, force=false) {
    this.alive = true
    this.run(ur, 'handler', force)
  }

  redirect(newNode) {
    this.lastNode = this.ctx.currentNode
    this.ctx.currentNode = newNode
  }

  async run(ur, fn, force=false) {
    try {
      const currentNode = this.getNode(this.ctx.currentNode)

      const nextNodeKey = await this.getNextNodeKey(fn, this.ctx.currentNode, ur)


      if (nextNodeKey || force) {
        this.ctx.currentKey = nextNodeKey
        const nextNode = this.getNode(nextNodeKey)

        if (this.isNotDeadEnd(nextNodeKey)) {
          this.ctx.lastNode = this.ctx.currentNode
          this.ctx.currentNode = nextNodeKey
        }

        await this.evaluate(currentNode.after, ur)

        const wait = currentNode.wait || this.defaultWait
        this.enqueue(nextNodeKey, ur, wait, fn === 'follow')
      }
    } catch (e) {
      console.log(e)
      if (this.ctx.currentNode !== this.ctx.fallbackNode) {
        this.enqueue(this.ctx.fallbackNode)
      }
    }
  }

  isNotDeadEnd(key) {
    const nextNode = this.getNode(key)
    return nextNode.follow || nextNode.handler || this.nodeIsArray(key)
  }

  nodeIsArray(key) {
    return key && (key.includes('.') || Array.isArray(this.nodes[key]))
  }

  async getNextNodeKey(fn, key, ur) {
    const currentNode = this.getNode(key)
    const evaluated = await this.evaluate(currentNode[fn], ur)

    if (evaluated) {
      return evaluated
    } else if (this.nodeIsArray(key)) {
      const [baseKey, keyIx] = this.splitNodeKeys(key)
      if (this.nodes[baseKey][keyIx+1]) return `${baseKey}.${Number(keyIx) + 1}`
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
    }) ?? fallback
  }

  goto(nodeKey) {
    this.enqueue(nodeKey)
  }

  enqueue(nodeKey, ur='', wait=0, isFollow=false) {
    if (isFollow && !this.alive) return
    if (!nodeKey) return

    if (this.clearQueue) {
      if (this.queue.length && isFollow) return
      this.queue = []
    }

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

  kill() {
    this.queue.forEach(() => this.queue.pop())
    this.redirect(this.start)
    this.alive = false
  }

  async shiftQueue() {
    if (!this.queue.length) return

    const event = this.queue.shift()
    this.scheduleQueueShift(1)

    this.ctx.currentKey = event.nodeKey

    if (this.isNotDeadEnd(event.nodeKey)) {
      this.ctx.currentNode = event.nodeKey
    }
    const newNode = this.getNode(event.nodeKey)
    const displayText = await this.evaluate(newNode.before, event.ur)

    if (displayText !== false) {
      this.onUpdate(
        await this.evaluate({
          ...newNode,
          text: await this.evaluate(newNode.text, event.ur)
        }, event.ur),
        this,
        event.nodeKey
      )
    }


    if (newNode.follow) this.run(event.ur, 'follow')
    if (this.nodeIsArray(this.ctx.currentNode)) {
      const [base, ix] = this.splitNodeKeys(this.ctx.currentNode)
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