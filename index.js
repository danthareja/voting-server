import makeStore from './src/store'
import startServer from './src/server'
import initialEntries from './entries.json'

export const store = makeStore()
startServer(store)

store.dispatch({
  type: 'SET_ENTRIES',
  entries: initialEntries
})
store.dispatch({ type: 'NEXT' })