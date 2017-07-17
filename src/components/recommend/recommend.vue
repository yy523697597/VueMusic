<template>
    <div class="recommend" ref="recommend">
        <scroll ref="scroll" class="recommend-content" :data="discList">
            <div>
                <div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">
                    <slider>
                        <div v-for="item of recommends">
                            <a :href="item.linkUrl">
                                <img @load="loadImg" :src="item.picUrl" class="needsclick">
                            </a>
                        </div>
                    </slider>
                </div>
    
                <div class="recommend-list">
                    <h1 class="list-title">热门歌单推荐</h1>
                    <ul>
                        <li v-for="item of discList" class="item">
                            <div class="icon">
                                <img width="60" height="60" v-lazy="item.imgurl" :alt="item.dissname">
                            </div>
                            <div class="text">
                                <h2 class="name" v-html="item.dissname"></h2>
                                <p class="desc">播放量：{{(item.listennum/10000).toFixed(1)}} 万</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <loading class="loading-container"></loading>
            </div>
        </scroll>
    </div>
</template>
<script>
import { getRecommend, getDiscList } from 'api/recommend'
import { ERR_OK } from 'api/config'
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'

export default {
    created() {
        this._getRecommend()
        this._getDiscList()
    },
    methods: {
        _getRecommend() {
            getRecommend().then((res) => {
                if (res.code === ERR_OK) {
                    this.recommends = res.data.slider
                }
            })
        },
        _getDiscList() {
            getDiscList().then((res) => {
                if (res.code === ERR_OK) {
                    this.discList = res.data.hotdiss.list
                }
            })
        },
        loadImg() {
            if (!this.checkLoaded) {
                this.checkLoaded = true
                this.$refs.scroll.refresh()
            }
        }
    },
    data() {
        return {
            recommends: [],
            discList: [],
            checkLoaded: false
        }
    },
    mounted() {

    },
    components: {
        Slider,
        Scroll,
        Loading
    }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>