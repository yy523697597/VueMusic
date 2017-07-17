<template>
    <div class="slider" ref="slider">
        <div class="slider-group" ref="sliderGroup">
            <slot>
            </slot>
        </div>
        <div class="dots">
            <span class="dot" :class="{active:currentPageIndex === index}" v-for="(item,index) of dots"></span>
        </div>
    </div>
</template>
<script>
import { addClass } from 'common/js/dom'
import BScroll from 'better-scroll'
export default {
    name: 'slider',
    props: {
        loop: {
            type: Boolean,
            default: true
        },
        autoPlay: {
            type: Boolean,
            default: true
        },
        interval: {
            type: Number,
            default: 5000
        },
        autoPlay: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            dots: [],
            currentPageIndex: 0
        }
    },
    mounted() {
        // 浏览器每17毫秒刷新一次页面，所以根据经验延迟20毫秒执行操作
        setTimeout(() => {
            // 需要初始化的东西都应该在这里声明
            this._setSliderWidth()
            this._initSlider()
            this._initDots()
            if (this.autoPlay) {
                this._play()
            }
        }, 20)

        // 调整窗口大小时，重新计算slider的宽度
        window.addEventListener('resize', () => {
            this._setSliderWidth(true)
            this.slider.refresh()
        })
    },
    methods: {
        // 设置幻灯片组件的宽度
        _setSliderWidth(isResize) {
            // template中具有ref属性的dom元素，可以通过$ref来访问
            this.children = this.$refs.sliderGroup.children

            let width = 0
            let sliderWidth = this.$refs.slider.clientWidth
            // 为每一个slider子元素添加 slider-item的class
            for (let i = 0; i < this.children.length; i++) {
                let child = this.children[i]
                addClass(child, 'slider-item')

                // 设定每一个轮播图图片宽度为页面宽度
                child.style.width = sliderWidth + 'px'
                width += sliderWidth
            }
            // 如果支持循环，还需要添加两个图片宽度用于无缝循环
            if (this.loop && !isResize) {
                width += 2 * sliderWidth
            }
            this.$refs.sliderGroup.style.width = width + 'px'
        },
        // 初始化幻灯片组件
        _initSlider() {
            // 通过this.$refs.slider去访问真实的sliderDOM节点
            this.slider = new BScroll(this.$refs.slider, {
                scrollX: true,
                scrollY: false,
                // 当快速滑动时是否开启滑动惯性
                momentum: false,
                snap: true,
                // 是否可以无缝循环轮播
                snapLoop: this.loop,
                // 用手指滑动时页面可切换的阈值，大于这个阈值可以滑动的下一页
                snapThreshold: 0.2,
                // 轮播图切换的动画时间
                snapSpeed: 400,
                // 让点击事件生效
                click: true
            })
            // 生命周期函数--滚动结束时触发
            this.slider.on('scrollEnd', () => {
                // getCurrentPage --- 当 snap 为 true 时，获取滚动的当前页，返回的对象结构为 {x, y, pageX, pageY}，其中 x,y 代表滚动横向和纵向的位置；pageX，pageY 表示横向和纵向的页面索引
                let pageIndex = this.slider.getCurrentPage().pageX

                // 如果开启循环，会在前后分别复制一张图片，所以在这里，index应该减一
                if (this.loop) {
                    pageIndex--
                }
                this.currentPageIndex = pageIndex

                if (this.autoPlay) {
                    clearTimeout(this.timer)
                    this._play()
                }
            })
        },
        _initDots() {
            // 因为开启了无缝轮播，多了两张图片，所以在此应该减去这两个多的
            this.dots = new Array(this.children.length - 2)
        },
        _play() {
            let pageIndex = this.currentPageIndex + 1
            if (this.loop) {
                pageIndex += 1
            }
            this.timer = setTimeout(() => {

                this.slider.goToPage(pageIndex, 0, 400)
            }, this.interval)
        }
    },
    // 页面销毁时，手动重置定时器，用来优化性能
    beforeDestroy() {
        clearTimeout(this.timer)
    },
    // activated() {
    //     if (this.autoPlay) {
    //         this._play()
    //     }
    // }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-theme
</style>


