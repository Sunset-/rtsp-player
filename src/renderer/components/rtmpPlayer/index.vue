<template>
    <div class="rtmp-player">
        <div class="player-title">{{resource&&resource.name||''}}</div>
        <div v-show="alarming" class="player-alarm">
            <img src="/static/img/alarm.gif" />
            <div @click="closeAlarm">关闭告警</div>
        </div>
        <div v-show="resource&&resource.name" class="close" @click="close">关闭</div>
        <div v-show="playUrl&&!playing" class="player-loading">
            <div class="loader-16"></div>
        </div>
        <LivePlayer v-if="playUrl" ref="player" style="width:100%;height:100%;" :videoUrl="playUrl" fluent autoplay live @play="onPlay"></LivePlayer>
    </div>
</template>
<script>
const HikSDK = require("electron").remote.app.$hiksdk;
import LivePlayer from "./liveplayer-component.min.js";
import Store from "../../modules/Home/store.js";

export default {
    components: {
        LivePlayer,
    },
    props: {
        resource: {},
    },
    watch: {
        resource(v, oldV) {
            if (v != oldV) {
                this.reset();
            }
            if (v) {
                this.play(v);
            }
        },
    },
    data() {
        return {
            title: "",
            playUrl: null,
            playing: false,
            alarming: false,
            closeAlarmTime: 0,
            keepTimer: null,
        };
    },
    methods: {
        init() {
            this.playUrl = this.src;
        },
        play(camera) {
            Store.getConfig().then((config) => {
                this.realPlay(camera, config.streamType);
                var interval =
                    (isNaN(config.streamTimeout)
                        ? 240
                        : +config.streamTimeout) * 1000;
                this.keepTimer = setInterval(() => {
                    this.realPlay(camera, config.streamType);
                }, interval);
            });
        },
        realPlay(camera, streamType) {
            HikSDK.getStreamURL(camera.cameraIndexCode, streamType).then(
                (url) => {
                    console.log("stream-url:", url);
                    this.playUrl = url;
                }
            );
        },
        close() {
            this.$emit("close");
            this.reset();
        },
        onPlay() {
            this.playing = true;
        },
        alarm() {
            if (Date.now() - this.closeAlarmTime > 60000) {
                this.alarming = true;
            }
        },
        reset() {
            this.alarming = false;
            this.playing = false;
            this.closeAlarmTime = 0;
            this.playUrl = null;
            clearTimeout(this.keepTimer);
        },
        closeAlarm() {
            this.alarming = false;
            this.closeAlarmTime = Date.now();
        },
    },
    mounted() {
        this.init();
    },
};
</script>
<style lang="less">
.rtmp-player {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #000;
    .player-title {
        position: absolute;
        top: 1px;
        left: 1px;
        padding: 3px 5px;
        font-size: 12px;
        z-index: 10;
        color: #fff;
        &.alarming {
            background: red;
        }
    }
    .close {
        position: absolute;
        top: 1px;
        right: 1px;
        padding: 5px 10px;
        font-size: 14px;
        color: #fff;
        background: #232323;
        z-index: 10;
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
        text-align: center;
    }
    .player-alarm {
        position: absolute;
        width: 60px;
        height: 84px;
        right: 25px;
        bottom: 45px;
        z-index: 10;
        & > img {
            width: 100%;
        }
        & > div {
            background: red;
            color: #fff;
            font-size: 12px;
            padding: 4px 5px;
            cursor: pointer;
            &:hover {
                background: lighten(red, 10%);
            }
        }
    }
    .video-wrapper {
        position: absolute !important;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        padding-bottom: 0px !important;
        .vjs-big-play-button {
            display: none;
        }
    }
}
.loader-16 {
    position: absolute;
    top: 50%;
    margin-top: -30px;
    left: 50%;
    margin-left: -30px;
    font-size: 50px;
    color: orange;
    display: inline-block;
    width: 1em;
    height: 1em;
    vertical-align: middle;
    pointer-events: none;
    -webkit-transform: rotateZ(45deg);
    transform: rotateZ(45deg);
    -webkit-perspective: 1000px;
    perspective: 1000px;
    border-radius: 50%;
}
.loader-16:before,
.loader-16:after {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: inherit;
    height: inherit;
    border-radius: 50%;
    -webkit-animation: 1s spin linear infinite;
    animation: 1s spin linear infinite;
}
.loader-16:before {
    -webkit-transform: rotateX(70deg);
    transform: rotateX(70deg);
}
.loader-16:after {
    -webkit-transform: rotateY(70deg);
    transform: rotateY(70deg);
    -webkit-animation-delay: 0.4s;
    animation-delay: 0.4s;
}
@-webkit-keyframes spin {
    0%,
    100% {
        box-shadow: 0.2em 0px 0 0px currentcolor;
    }
    12% {
        box-shadow: 0.2em 0.2em 0 0 currentcolor;
    }
    25% {
        box-shadow: 0 0.2em 0 0px currentcolor;
    }
    37% {
        box-shadow: -0.2em 0.2em 0 0 currentcolor;
    }
    50% {
        box-shadow: -0.2em 0 0 0 currentcolor;
    }
    62% {
        box-shadow: -0.2em -0.2em 0 0 currentcolor;
    }
    75% {
        box-shadow: 0px -0.2em 0 0 currentcolor;
    }
    87% {
        box-shadow: 0.2em -0.2em 0 0 currentcolor;
    }
}
@keyframes spin {
    0%,
    100% {
        box-shadow: 0.2em 0px 0 0px currentcolor;
    }
    12% {
        box-shadow: 0.2em 0.2em 0 0 currentcolor;
    }
    25% {
        box-shadow: 0 0.2em 0 0px currentcolor;
    }
    37% {
        box-shadow: -0.2em 0.2em 0 0 currentcolor;
    }
    50% {
        box-shadow: -0.2em 0 0 0 currentcolor;
    }
    62% {
        box-shadow: -0.2em -0.2em 0 0 currentcolor;
    }
    75% {
        box-shadow: 0px -0.2em 0 0 currentcolor;
    }
    87% {
        box-shadow: 0.2em -0.2em 0 0 currentcolor;
    }
}
</style>