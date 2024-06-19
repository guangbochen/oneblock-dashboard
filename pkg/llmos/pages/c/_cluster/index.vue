<script>
import { PRODUCT_NAME } from '../../../config/product';
import { LLMOS } from '~/pkg/llmos/types/types';

export default {
  middleware({ redirect, route }) {
    return redirect({
      name:   `${ PRODUCT_NAME }-c-cluster-resource`,
      params: {
        ...route.params,
        product:  PRODUCT_NAME,
        resource: LLMOS.DASHBOARD
      }
    });
  }
};
</script>

<template>
  <div>
    This is LLMOS Dashboard.
  </div>
</template>
../../../config/product
