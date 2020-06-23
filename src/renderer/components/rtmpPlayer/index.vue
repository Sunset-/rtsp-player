<template>
    <div class="rtmp-player">
        <div class="close" @click="close">关闭</div>
        <LivePlayer v-if="playRtmp" ref="player" style="width:100%;height:100%;" :videoUrl="playRtmp" fluent autoplay live @play="onPlay"></LivePlayer>
    </div>
</template>
<script>
import LivePlayer from "./liveplayer-component.min.js";

export default {
    components: {
        LivePlayer
    },
    props: {
        src: {}
    },
    watch:{
        src(v){
            if(v){
                this.playRtmp = v;
            }
        }
    },
    data() {
        return {
            playRtmp: null,
            playing: false
        };
    },
    methods: {
        init() {
            this.playRtmp = this.src;
        },
        close() {
            this.playRtmp = null;
            this.$emit("close");
        },
        onPlay() {
            this.playing = true;
        }
    },
    mounted() {
        this.init();
    }
};
</script>
<style lang="less">
.rtmp-player {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #2c3033;
    .close {
        position: absolute;
        top: 1px;
        right: 1px;
        padding: 5px 10px;
        font-size: 14px;
        color: #fff;
        background: #232323;
        z-index: 9999;
        cursor: pointer;
    }
    .close:hover {
        background: #09c;
    }
    .player-loading {
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        z-index: 10;
        background-image: url("/static/img/loading.gif");
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center center;
    }
    .video-wrapper{
        position: absolute !important;
        top:0px;
        left:0px;
        right:0px;
        bottom:0px;
    }
}
</style>