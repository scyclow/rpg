import {ls} from './$.js'

export function createDeepProxy(target, cb) {
  return new Proxy(target, {
    set(obj, key, val) {
      obj[key] = val

      cb(obj, key, val)

      return Reflect.set(...arguments)
    },
    get(obj, key) {
      return typeof obj[key] === 'object'
        ? createDeepProxy(obj[key], cb)
        : obj[key]
    },
  })
}

export function persist(lsKey, init={}) {
  console.log(lsKey)
  const ctx = ls.get(lsKey) || init
  const set = () => {
    ls.set(lsKey, JSON.stringify(ctx))
  }

  set()

  return createDeepProxy(ctx, set)
}