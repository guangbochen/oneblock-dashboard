<script>
import { mapPref, AFTER_LOGIN_ROUTE, READ_WHATS_NEW, HIDE_HOME_PAGE_CARDS } from '@shell/store/prefs';
import { Banner } from '@components/Banner';
import BannerGraphic from '@shell/components/BannerGraphic';
import IndentedPanel from '@shell/components/IndentedPanel';
import SortableTable from '@shell/components/SortableTable';
import { BadgeState } from '@components/BadgeState';
import CommunityLinks from '@shell/components/CommunityLinks';
import SingleClusterInfo from '@shell/components/SingleClusterInfo';
import { mapGetters, mapState } from 'vuex';
import { MANAGEMENT } from '@shell/config/types';
import { getVersionInfo, markSeenReleaseNotes } from '@shell/utils/version';
import PageHeaderActions from '@shell/mixins/page-actions';
import { getVendor } from '@shell/config/private-label';
import { mapFeature, MULTI_CLUSTER } from '@shell/store/features';

import { RESET_CARDS_ACTION, SET_LOGIN_ACTION } from '@shell/config/page-actions';

export default {
  name:       'Home',
  layout:     'home',
  components: {
    Banner,
    BannerGraphic,
    IndentedPanel,
    SortableTable,
    BadgeState,
    CommunityLinks,
    SingleClusterInfo,
  },

  mixins: [PageHeaderActions],

  fetch() {
    if ( this.$store.getters['management/schemaFor'](MANAGEMENT.CLUSTER) ) {
      this.$store.dispatch('management/findAll', { type: MANAGEMENT.CLUSTER });
    }
  },

  data() {
    const fullVersion = getVersionInfo(this.$store).fullVersion;
    // Page actions don't change on the Home Page
    const pageActions = [
      {
        labelKey: 'nav.header.setLoginPage',
        action:   SET_LOGIN_ACTION
      },
      { separator: true },
      {
        labelKey: 'nav.header.restoreCards',
        action:   RESET_CARDS_ACTION
      },
    ];

    return {
      HIDE_HOME_PAGE_CARDS, fullVersion, pageActions, vendor: getVendor(),
    };
  },

  computed: {
    ...mapState(['managementReady']),
    ...mapGetters(['currentCluster', 'defaultClusterId', 'releaseNotesUrl']),
    mcm: mapFeature(MULTI_CLUSTER),

    mgmtClusters() {
      return this.$store.getters['management/all'](MANAGEMENT.CLUSTER);
    },

    afterLoginRoute: mapPref(AFTER_LOGIN_ROUTE),
    homePageCards:   mapPref(HIDE_HOME_PAGE_CARDS),

    showSetLoginBanner() {
      return this.homePageCards?.setLoginPage;
    },

    clusterHeaders() {
      return [
        {
          name:      'state',
          labelKey:  'tableHeaders.state',
          sort:      ['stateSort', 'nameSort'],
          value:     'status.conditions[0].status',
          getValue:  (row) => row.status.conditions[0]?.status,
          width:     100,
          default:   'unknown',
          formatter: 'BadgeStateFormatter',
        },
        {
          name:     'name',
          labelKey: 'tableHeaders.name',
          value:    'displayName',
          getValue:      (row) => row.mgmt?.displayName,
          sort:     ['nameSort'],
        },
        {
          label:     this.t('landing.clusters.provider'),
          value:     'status.provider',
          name:      'Provider',
          sort:      ['status.provider'],
        },
        {
          label: this.t('landing.clusters.kubernetesVersion'),
          value: 'status.version.gitVersion',
          name:  'Kubernetes Version'
        },
      ];
    },

    kubeClusters() {
      return this.mgmtClusters
    }
  },

  async created() {
    // Update last visited on load
    await this.$store.dispatch('prefs/setLastVisited', { name: 'home' });
    markSeenReleaseNotes(this.$store);
  },

  // Forget the types when we leave the page
  beforeDestroy() {},

  methods: {
    /**
     * Define actions for each navigation link
     * @param {*} action
     */
    handlePageAction(action) {
      switch (action.action) {
      case RESET_CARDS_ACTION:
        this.resetCards();
        break;

      case SET_LOGIN_ACTION:
        this.afterLoginRoute = 'home';
        break;
      }
    },

    showUserPrefs() {
      this.$router.push({ name: 'prefs' });
    },

    async resetCards() {
      await this.$store.dispatch('prefs/set', { key: HIDE_HOME_PAGE_CARDS, value: {} });
      await this.$store.dispatch('prefs/set', { key: READ_WHATS_NEW, value: '' });
    },

    async closeSetLoginBanner(retry = 0) {
      let value = this.$store.getters['prefs/get'](HIDE_HOME_PAGE_CARDS);

      if (value === true || value === false || value.length > 0) {
        value = {};
      }
      value.setLoginPage = true;

      const res = await this.$store.dispatch('prefs/set', { key: HIDE_HOME_PAGE_CARDS, value });

      if (retry === 0 && res?.type === 'error' && res?.status === 500) {
        await this.closeSetLoginBanner(retry + 1);
      }
    }
  }
};

</script>
<template>
  <div
    v-if="managementReady"
    class="home-page"
  >
    <BannerGraphic
      :small="true"
      :title="t('landing.welcomeToRancher', {vendor})"
      :pref="HIDE_HOME_PAGE_CARDS"
      pref-key="welcomeBanner"
      data-testid="home-banner-graphic"
    />
    <IndentedPanel class="mt-20 mb-20">
      <div class="row home-panels">
        <div class="col main-panel">
          <div
            v-if="!showSetLoginBanner"
            class="mb-10 row"
          >
            <div class="col span-12">
              <Banner
                color="set-login-page mt-0"
                data-testid="set-login-page-banner"
                :closable="true"
                @close="closeSetLoginBanner()"
              >
                <div>
                  {{ t('landing.landingPrefs.title') }}
                </div>
                <a
                  class="hand mr-20"
                  @click.prevent.stop="showUserPrefs"
                ><span v-clean-html="t('landing.landingPrefs.userPrefs')" /></a>
              </Banner>
            </div>
          </div>
          <div class="row panel">
            <div v-if="mcm" class="col span-12">
              <SortableTable
                :table-actions="false"
                :row-actions="false"
                key-field="id"
                :rows="kubeClusters"
                :headers="clusterHeaders"
                :loading="!kubeClusters"
              >
                <template #header-left>
                  <div class="row table-heading">
                    <h2 class="mb-0">
                      {{ t('landing.clusters.title') }}
                    </h2>
                    <BadgeState
                      v-if="kubeClusters"
                      :label="kubeClusters.length.toString()"
                      color="role-tertiary ml-20 mr-20"
                    />
                  </div>
                </template>

                <template #col:name="{row}">
                  <td>
                    <div class="list-cluster-name">
                      <span v-if="row.mgmt?.isReady && !row.hasError">
                        <n-link
                          :to="{ name: 'c-cluster-explorer', params: { cluster: row.mgmt.id }}"
                        >
                          {{ row.spec.displayName }}
                        </n-link>
                      </span>
                      <span v-else>{{ row.spec.displayName }}</span>
                    </div>
                  </td>
                </template>
              </SortableTable>

            </div>
            <div
              v-else
              class="col span-12"
            >
              <SingleClusterInfo />
            </div>
          </div>
        </div>
      </div>
    </IndentedPanel>
  </div>
</template>
<style lang='scss' scoped>
  .home-panels {
    display: flex;
    align-items: stretch;
    .col {
      margin: 0
    }
    .main-panel {
      flex: auto;
    }

    .side-panel {
      margin-left: 1.75%;
    }
  }

  .set-login-page, .whats-new {
    > ::v-deep .banner__content {
      display: flex;

      > div {
        flex: 1;
      }
      > a {
        align-self: flex-end;
      }
    }
  }

  .banner.set-login-page {
    border: 1px solid var(--border);
  }
  .table-heading {
    align-items: center;
    display: flex;
    height: 39px;

    & > a {
      margin-left: 10px;
    }
  }
  .panel:not(:first-child) {
    margin-top: 20px;
  }
  .getting-started {
    align-items: flex-end;
    display: flex;

    > span {
      flex: 1;
      margin-right: 20px;
    }
  }
  .getting-started-btn {
    display: contents;
    white-space: nowrap;
  }

  .list-cluster-name {
    align-items: center;
    display: flex;

    .conditions-alert-icon {
      color: var(--error);
      margin-left: 4px;
    }
  }

  // Hide the side-panel showing links when the screen is small
  @media screen and (max-width: 996px) {
    .side-panel {
      display: none;
    }
  }
</style>
<style lang="scss">
.home-page {
  .search {
    align-items: center;
    display: flex;

    > INPUT {
      background-color: transparent;
      height: 30px;
      padding: 8px;
    }
  }

  h2 {
    font-size: 16px;
  }
}
</style>
