const eventBus = {}
let emitEventCycle = null
export function addEvent(ev, callback) {
  if (ev in eventBus) {
    eventBus[ev].push(callback)
  } else {
    eventBus[ev] = [callback]
  }
  return () => {
    if (ev in eventBus) {
      const eventBusLen = eventBus[ev].length
      for (let a = 0; a < eventBusLen; a += 1) {
        if (eventBus[ev][a] === callback) {
          /**
           * this will ensure that we don’t miss an event
           * listener due to unsubscription during emitEvent
           */
          if (emitEventCycle !== null && emitEventCycle.ev === ev && a <= emitEventCycle.counter) {
            emitEventCycle.counter -= 1
          }
          return eventBus[ev].splice(a, 1)
        }
      }
    }
    return -1
  }
}
export function removeEvent(ev) {
  if (ev in eventBus === false) {
    return -1
  }
  delete eventBus[ev]
}
export function emitEvent(ev, payload) {
  if (ev in eventBus === false) {
    return -1
  }
  emitEventCycle = {
    ev,
    counter: 0,
  }
  for (
    let eventBusLen = eventBus[ev].length;
    emitEventCycle.counter < eventBusLen;
    emitEventCycle.counter += 1
  ) {
    if (eventBus[ev][emitEventCycle.counter]) {
      eventBus[ev][emitEventCycle.counter](payload)
    }
  }
  emitEventCycle = null
}
