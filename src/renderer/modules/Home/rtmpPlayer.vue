<template>
    <div class="video-panel">
        <div class="close" @click="close">关闭</div>
        <LivePlayer v-if="playRtmp" ref="player" style="width:100%;height:100%;" :videoUrl="rtmp" fluent autoplay live @play="onPlay"></LivePlayer>
    </div>
</template>
<script>


import LivePlayer from '@liveqing/liveplayer'


export default {
    components : {
        LivePlayer
    },
    props: {
        rtmp: {}
    },
    data() {
        return {
            playRtmp : null,
            playing : false
        };
    },
    methods: {
        init(){
            this.playRtmp = this.rtmp;
        },
        close() {
            this.playRtmp = null;
            this.$emit("close");
        },
        onPlay(){
            this.playing = true
        }
    },
    mounted() {
        this.init();
    }
};
</script>
<style lang="css">
.video-panel {
    position: relative;
}
.close {
    position: absolute;
    top: 0px;
    right: 0px;
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
.player-loading{
    position: absolute;
    top:0px;
    left:0px;
    right:0px;
    bottom:0px;
    z-index: 10;
    background-image: url('/static/img/loading.gif');
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center center;
}
.player-wrapper{
    position: relative;
}
.video-wrapper{
    position: absolute !important;
    top:0px;
    left:0px;
    right:0px;
    bottom:0px;
}
</style>