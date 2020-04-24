<template>
  <div class="content">

    <div class="select">
      <input v-model="keyword" class="uni-input" confirm-type="search" placeholder="键盘右下角按钮显示为搜索">
      <!-- <icon class="select-icon" type="search" size="26" @click="getVideo" /> -->
      <svg-icon
        icon-class="search"
        class="select-icon"
      />
    </div>
    <div class="video-list">
      <div v-for="(item,index) in videoList" :key="index" class="detail-item">
        <div class="detail">
          <img class="video-img" :src="item.vod_pic" mode="">
          <div class="detail-text">
            <span class="video-name">
              {{ item.vod_name }}({{ item.vod_continu }})
            </span>
            <span class="text">
              {{ item.list_name }}
            </span>
            <span class="text">
              主演：{{ item.vod_actor }}
            </span>
            <span class="text">
              导演：{{ item.vod_director }}
            </span>
            <span class="text">
              更新时间：{{ item.vod_addtime }}
            </span>
          </div>
          <button v-if="showIndex !== index" class="show-btn" type="primary" plain="text" size="mini" @click="showVideo(index,item)">显示</button>
          <button v-if="showIndex === index" class="show-btn" type="primary" plain="text" size="mini" @click="showVideo(null)">隐藏</button>
        </div>
        <template v-if="showIndex === index">
          <div class="video-box">
            <!-- <video id="myVideo" :title="active.item.name" :src="active.item.videoUrl" poster="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1587711290944&di=6b94a3e8aac5e2a2a5a91f7ce34080fe&imgtype=0&src=http%3A%2F%2Fpic1.win4000.com%2Fpic%2F9%2Fc0%2Ffc32878982.jpg" @error="videoErrorCallback" controls enable-play-gesture play-btn-position="center"></video> -->
            <video-player
              ref="videoPlayer"
              class="video-player vjs-custom-skin"
              :playsinline="true"
              :options="playerOptions"
              @play="onPlayerPlay($event)"
              @pause="onPlayerPause($event)"
            />
          </div>
          <div class="video">
            <div v-for="(item2,index2) in item.videoData" :key="index2" class="video-item" :class="{'video-item-active':active.index === index2}">
              <button class="show-btn" size="mini" @click="setActiveIndex(index2,item2)">{{ item2.name }}</button>
            </div>
          </div>
        </template>

      </div>
    </div>
  </div>
</template>

<script>
import { testHttpInteractor } from '@/core'
export default {
  name: 'Home',
  data() {
    return {
      keyword: '龙岭',
      videoList: [],
      // 当前电视剧
      showIndex: null,
      // 当前集数
      active: {
        index: null,
        item: {}
      },
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0, 3.5, 4], // 播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          // {
          //   type: 'video/mp4', // 这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
          //   src: 'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm' // url地址
          // },
          {
            type: 'application/x-mpegURL', // 这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
            src:
              'https://cdn.letv-cdn.com/2018/12/05/JOCeEEUuoteFrjCg/playlist.m3u8' // url地址，从别的博主那看来的地址，亲测可用
          }
        ],
        hls: true,
        poster: 'http://pic33.nipic.com/20131007/13639685_123501617185_2.jpg', // 你的封面地址
        width: document.documentElement.clientWidth, // 播放器宽度
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true // 全屏按钮
        }
      }
    }
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player// 自定义播放
    }
  },
  async created() {
    this.getVideo({ wd: '' })
  },
  mounted() {

  },
  methods: {
    async getVideo(options) {
      var _this = this
      const res = await testHttpInteractor.getVideo(options)
      this.videoList = res.data
      this.videoList = this.videoList.map(val => {
        val.videoData = _this.setList(val.vod_url)
        return val
      })
      console.log(this.videoList)
    },
    showVideo(index, item) {
      this.showIndex = index
      this.active = {
        index: null,
        item: item.videoData[0]
      }
    },
    setActiveIndex(index, item) {
      this.active = {
        index: index,
        item: item
      }
      this.playerOptions.sources[0].src = this.active.item.videoUrl
      console.log(this.active)
    },
    // 级数字符串转数组
    setList(str) {
      let tmp = str.split('\r\n')
      tmp = tmp.map(val => {
        const tmp2 = val.split('$')
        val = {
          name: tmp2[0],
          videoUrl: tmp2[1]
        }
        return val
      })
      return tmp
    },
    onPlayerPlay($event) {
      console.log('播放', $event)
    },
    onPlayerPause($event) {
      console.log('暂停', $event)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/_function.scss';
	.content {
    // position: relative;
    // top:47;
    // left:0;
    // right: 0;
    // bottom:0;
    margin-top: 47px;
    height:vheight();
    width:100%;
    font-size:0.5rem;
		.select{
			padding:0.05rem;
			display: flex;
			height:0.82rem;
			.uni-input{
				height:0.8rem;
				flex:1;
				border:0.01rem solid #ccc;
				border-radius: 0.05rem;
				margin-right: 0.1rem;
			}
			.select-icon{
				height:0.82rem;
				width:1rem;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
		.video-list{
			.detail-item{
				margin-bottom:0.1rem;
				.detail{
					display: flex;
					position: relative;
					.video-img{
						width:2rem;
						height:2.4rem
					}
					.detail-text{
						height:2.4rem;
						flex:1;
						display: flex;
						flex-direction: column;
						.video-name{
							// height:60upx;
							padding:0.1rem 0;
							font-size: 0.36rem;
							font-weight: 550;
						}
						.text{
							height:0.4rem;
							width:4rem;
							font-size: 0.24rem;
							white-space: nowrap;      /*超出的空白区域不换行*/
							overflow: hidden;         /*超出隐藏*/
							text-overflow: ellipsis;  /*文本超出显示省略号*/
						}
					}
					.show-btn{
						position: absolute;
						right: 0.2rem;
						bottom: 0;
						padding:0;
						font-size: 0.24rem;
						line-height: 0.4rem;
					}
				}
				.video-box{
					padding:0.05;
					uni-video{
						width: 100%;
					}
				}
				.video{
					display: flex;
					flex-wrap: wrap;

					.video-item{
						width:25%;
					}
					.video-item-active{
						.show-btn{
							color:#007AFF;
							background-color: #cccccc;
						}
					}
				}
			}
		}
	}
</style>

