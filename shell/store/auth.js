import { base64Encode } from '@shell/utils/crypto';
import { randomStr } from '@shell/utils/string';

export const BASE_SCOPES = {
  github:       ['read:org'],
};

const KEY = 'rc_nonce';
const ERR_NONCE = 'nonce';

export const LOGIN_ERRORS = {
  CLIENT:              'client',
  CLIENT_UNAUTHORIZED: 'client_unauthorized',
  SERVER:              'server'
};

export const state = function() {
  return {
    fromHeader:  null,
    hasAuth:     null,
    loggedIn:    false,
    principalId: null,
    initialPass: null,
  };
};

export const getters = {
  fromHeader() {
    return state.fromHeader;
  },

  enabled(state) {
    return state.hasAuth;
  },

  loggedIn(state) {
    return state.loggedIn;
  },

  principalId(state) {
    return state.principalId;
  },

  initialPass(state) {
    return state.initialPass;
  },

};

export const mutations = {
  gotHeader(state, fromHeader) {
    state.fromHeader = fromHeader;
  },

  hasAuth(state, hasAuth) {
    state.hasAuth = !!hasAuth;
  },

  loggedInAs(state, principalId) {
    state.loggedIn = true;
    state.principalId = principalId;

    this.$cookies.remove(KEY);
  },

  loggedOut(state) {
    // Note: plugin/norman/index watches for this mutation
    // to automatically disconnect subscribe sockets.

    state.loggedIn = false;
    state.principalId = null;
    state.initialPass = null;
  },

  initialPass(state, pass) {
    state.initialPass = pass;
  }
};

export const actions = {
  gotHeader({ commit }, fromHeader) {
    commit('gotHeader', fromHeader);
  },

  gotUser({ commit }, user) {
    commit('gotUser', user);
  },

  setInitialPass({ commit }, pass) {
    commit('initialPass', pass);
  },

  /**
   * Create the basic json object used for the nonce (this includes the random nonce/state)
   */
  createNonce(ctx, opt) {
    const out = { nonce: randomStr(16), to: 'vue' };

    if ( opt.test ) {
      out.test = true;
    }

    if (opt.provider) {
      out.provider = opt.provider;
    }

    return out;
  },

  /**
   * Save nonce details. Information it contains will be used to validate auth requests/responses
   * Note - this may be structurally different than the nonce we encode and send
   */
  saveNonce(ctx, opt) {
    const strung = JSON.stringify(opt);

    this.$cookies.set(KEY, strung, {
      path:     '/',
      sameSite: true,
      secure:   true,
    });

    return strung;
  },

  /**
   * Convert the nonce into something we can send
   */
  encodeNonce(ctx, nonce) {
    const stringify = JSON.stringify(nonce);

    return base64Encode(stringify, 'url');
  },


  async login({ dispatch }, { provider, body }) {
    try {
      await dispatch('rancher/request', {
        url:                  '/v1-public/auth?action=login',
        method:               'post',
        data:                 { ...body },
        headers:              { 'Content-Type': 'application/json' },
        redirectUnauthorized: false,
      }, { root: true, redirectUnauthorized: false });

      return;
    } catch (err) {
      if (err._status === 401) {
        return Promise.reject(LOGIN_ERRORS.CLIENT_UNAUTHORIZED);
      } else if (err.message) {
        return Promise.reject(err.message);
      } else if ( err._status >= 400 && err._status <= 499 ) {
        return Promise.reject(LOGIN_ERRORS.CLIENT);
      }

      return Promise.reject(LOGIN_ERRORS.SERVER);
    }
  },

  async logout({ dispatch, commit }) {
    // Unload plugins - we will load again on login
    await this.$plugin.logout();

    try {
      await dispatch('rancher/request', {
        url:                  '/v1-public/auth?action=logout',
        method:               'post',
        data:                 {},
        headers:              { 'Content-Type': 'application/json' },
        redirectUnauthorized: false,
      }, { root: true });
    } catch (e) {
    }

    commit('loggedOut');
    dispatch('onLogout', null, { root: true });
  }
};
