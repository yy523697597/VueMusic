<template>
    <div class="player">
        <div class="normal-player" v-show="fullScreen">
            播放器页面
        </div>
        <div class="mini-player" v-show="!fullScreen"></div>
    </div>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {
    computed: {
        ...mapGetters([
            'currentIndex',
            'fullScreen',
            'playing'
        ])
    }
}
</script>

