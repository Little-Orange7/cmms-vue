import {
  INIT_ROUTES,
  INIT_USER,
  SET_KEEPALIVE
} from './mutation-types.js'

export default {
  [INIT_ROUTES] (state, data) {
    state.routes = data
  },
  [INIT_USER] (state, user) {
    state.user = user
  },
  [SET_KEEPALIVE] (state, compNames) {
    state.keepAliveComps = compNames
  }
}
