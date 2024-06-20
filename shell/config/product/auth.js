import { DSL } from '@shell/store/type-map';
import { MANAGEMENT } from '@shell/config/types';
import { NAME as HEADER_NAME } from '@shell/config/table-headers';

export const NAME = 'auth';

const USERS_VIRTUAL_TYPE = 'users';
const ROLES_VIRTUAL_TYPE = 'roles';

export function init(store) {
  const {
    basicType,
    configureType,
    virtualType,
  } = DSL(store, NAME);

  virtualType({
    labelKey:   'typeLabel."management.cattle.io.user"',
    name:       USERS_VIRTUAL_TYPE,
    namespaced: false,
    weight:     103,
    icon:       'user',
    route:      {
      name:   'c-cluster-product-resource',
      params: {
        cluster:  'local',
        product:  NAME,
        resource: MANAGEMENT.USER,
      }
    }
  });
  configureType(MANAGEMENT.USER, { showListMasthead: false });

  basicType([
    'config',
    USERS_VIRTUAL_TYPE,
    ROLES_VIRTUAL_TYPE
  ]);


  // A lot of the built in roles have nicer names returned by nameDisplay. In both tables we want to show both nicer and base names
  const DISPLAY_NAME = {
    ...HEADER_NAME,
    name:     'displayName',
    labelKey: 'tableHeaders.nameDisplay',
  };
}
