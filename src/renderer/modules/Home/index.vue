<template>
    <div class="MODULE-Home">
        <webview src="https://www.adobe.com/software/flash/about/" plugins></webview>
        <home-components ref="components" class="BOX home-components-wrap"></home-components>
        <div class="BOX home-component-frame">
            <div class="report-header">
                <span>RTSP地址：</span>
                <input v-model="rtmpUrl">
                <button type="button" @click="play()">连接webrtc</button>
                <button type="button" @click="play(demo1)">湖南台直播</button>
            </div>
            <div class="BOX home-component-content" style="overflow-y:scroll;">
                <div class="video-panels">
                    <video-player v-for="vp in videos" :key="vp.id" :rtmp="vp.rtmp" @close="remove(vp)"></video-player>
                </div>
                <canvas id="canvas_9990" style="width:200px;"></canvas>
            </div>
        </div>
    </div>
</template>
<script>
import HomeComponents from "./components";
import Store from "./store.js";
import VideoPlayer from "./rtmpPlayer.vue";

export default {
    components: {
        HomeComponents,
        VideoPlayer
    },
    computed: {},
    data() {
        return {
            toolbarOptions: {
                tools: [
                    {
                        label: "还原",
                        icon: "xui-icon xui-icon-refresh",
                        color: "white",
                        operate: () => {
                            this.open();
                        }
                    }
                ]
            },
            rtmpUrl: "rtmp://58.200.131.2:1935/livetv/hunantv",
            demo1: "rtmp://58.200.131.2:1935/livetv/hunantv",
            videos: []
        };
    },
    methods: {
        play(url) {
            var rtmp = url || this.rtmpUrl;
            if (!rtmp) {
                return;
            }
            this.videos.push({
                id: Date.now(),
                rtmp: rtmp
            });
        },
        remove(v) {
            this.videos = this.videos.filter(cv => cv.id != v.id);
        }
    }
};
</script>
<style lang="less">
@import "~@/style/variable.less";

.MODULE-Home {
    @sidebar-width: 200px;
    .home-components-wrap {
        width: @sidebar-width;
        right: auto;
        background: @color-background-side;
        box-sizing: border-box;
        border-right: 1px solid @color-border;
    }
    .report-title {
        font-size: 20px;
    }
    .report-subtitle {
        display: inline-block;
        padding-left: 10px;
        font-size: 12px;
    }

    .home-component-frame {
        left: @sidebar-width;
        background: @color-background-major;
        color: @color-content;
        .report-header {
            width: 100%;
            background: #e7eaed;
            border-bottom: 1px solid #e7eaed;
            box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.05);
            border-collapse: separate !important;
            padding: 0px 10px;
            line-height: 45px;
            box-sizing: border-box;
        }
        .home-component-content {
            padding: 10px;
            top: 45px;
            background: #fff;
        }
    }
}
.video-panel {
    box-sizing: border-box;
    max-width: 100%;
    width: 500px;
    height:400px;
    border: 2px solid #ccc;
}
.demos {
    border-top: 1px solid #565656;
    margin-top: 5px;
    padding-top: 5px;
    padding-bottom: 5px;
}
.demos button {
    margin: 2px;
}
.video-panel video {
    width: 100%;
    height:100%;
}
.video-panels > div {
    display: inline-block;
}
</style>