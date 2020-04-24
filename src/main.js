import Vue from 'vue'
import 'normalize.css/normalize.css'
import '@/styles/index.scss'
import Vant from 'vant'
import 'vant/lib/index.css'
import '@/icons'
import App from '@/App.vue'
import '@/permission'
import '@/pwa/registerServiceWorker'
import router from '@/router'
import store from '@/store'
import Report from '@/utils/report'
import bus from '@/utils/bus'
import filters from '@/filters'
import preventReClick from '@/directive/prevent-re-click'
import i18n from '@/lang'
// 视频插件
import VideoPlayer from 'vue-video-player'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
const hls = require('videojs-contrib-hls')

Vue.use(VideoPlayer)
Vue.use(hls)

Vue.config.productionTip = false

const { NODE_ENV, VUE_APP_SENTRY_ENABLED } = process.env
const PROD = NODE_ENV === 'production'

if (PROD && VUE_APP_SENTRY_ENABLED === 'yes') {
  const { VUE_APP_SENTRY_DSN } = process.env
  const sentry = Report.getInstance(Vue, {
    dsn: VUE_APP_SENTRY_DSN,
    release: __VERSION__,
    environment: 'Prod'
  })

  window.$sentry = sentry

  Vue.config.errorHandler = (error, vm, info) => {
    window.$sentry.log({
      error,
      type: 'vue errorHandler',
      vm,
      info
    })
  }
}

Object.keys(filters).forEach(filterName => {
  Vue.filter(filterName, filters[filterName])
})

Vue.use(Vant)
  .use(bus)
  .use(preventReClick)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
