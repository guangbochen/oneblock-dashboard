import { MANAGEMENT } from '@shell/config/types';

const definitions = {};

export const create = function(name, def) {
  definitions[name] = { def };

  return name;
};

export const mapFeature = function(name) {
  return {
    get() {
      return this.$store.getters['features/get'](name);
    },

    set(value) {
      throw new Error('The feature store only supports getting');
    }
  };
};

// --------------------
// The default (2nd arg) is used only if the flag is missing entirely from the server.
//    This is mainly useful for development before the flag has been created in the API..

export const MULTI_CLUSTER = create('multi-cluster-management', true);
export const UNSUPPORTED_STORAGE_DRIVERS = create('unsupported-storage-drivers', false);

// --------------------
export const getters = {
  get: (state, getters, rootState, rootGetters) => (name) => {
    const definition = definitions[name];

    if (!definition) {
      throw new Error(`Unknown feature: ${ name }`);
    }

    const entry = rootGetters['management/byId'](MANAGEMENT.FEATURE, name);

    if ( entry ) {
      return entry.enabled;
    }

    return definition.def;
  },
};

export const actions = {
  loadServer({ rootGetters, dispatch }) {
    if ( rootGetters['management/canList'](MANAGEMENT.FEATURE) ) {
      return dispatch('management/findAll', { type: MANAGEMENT.FEATURE }, { root: true });
    }
  },
};
