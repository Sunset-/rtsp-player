<template>
    <div class="MODULE-Home">
        <webview src="https://www.adobe.com/software/flash/about/" plugins></webview>
        <div class="home-header">
            <div class="logo">警视联动</div>
            <span>RTMP地址：</span>
            <input v-model="rtmpUrl" style="width:500px;">
            <button type="button" @click="play()">连接</button>
            <button type="button" @click="play(demo1)">湖南台直播</button>
            <button type="button" @click="request()">请求</button>
        </div>
        <div class="BOX home-sidebar">
            <home-resources ref="resources" @selected="onSelected"></home-resources>
        </div>
        <div class="BOX home-major">
            <player-wall ref="playerWall" class="rtmp-player-wall" @stop="onStop"></player-wall>
        </div>
    </div>
</template>
<script>
import HomeResources from "./resources";
import Store from "./store.js";

export default {
    components: {
        HomeResources
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
            demo1: "rtmp://58.200.131.2:1935/livetv/hunantv"
        };
    },
    methods: {
        play(url) {
            var rtmp = url || this.rtmpUrl;
            if (!rtmp) {
                return;
            }
            this.$refs.playerWall.play({
                src: rtmp
            });
        },
        remove(v) {
            this.videos = this.videos.filter(cv => cv.id != v.id);
        },
        onSelected(camera) {
            Store.getStreamURL(camera.cameraIndexCode).then(url => {
                console.log('stream-url:',url)
                this.$refs.playerWall.play(camera, url || this.demo1);
            });
        },
        onStop(camera) {
            this.$refs.resources.removeFocus(camera.cameraIndexCode);
        },
        request() {
            Store.loadAllReources();
        }
    }
};
</script>
<style lang="less">
@import "~@/style/variable.less";

.MODULE-Home {
    @sidebar-width: 220px;
    @header-height: 45px;
    .home-header {
        width: 100%;
        background: #e7eaed;
        border-bottom: 1px solid #e7eaed;
        box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.05);
        border-collapse: separate !important;
        padding: 0px 10px;
        line-height: @header-height;
        box-sizing: border-box;
        .logo {
            color: orange;
            font-size: 20px;
            display: inline-block;
            padding: 0px 15px;
        }
    }
    .home-sidebar {
        top: @header-height;
        width: @sidebar-width;
        right: auto;
        background: @color-background-side;
        box-sizing: border-box;
        border-right: 1px solid @color-border;
    }

    .home-major {
        top: @header-height;
        left: @sidebar-width;
        background: @color-background-major;
        color: @color-content;
        .rtmp-player-wall {
            position: absolute;
            top: 0px;
            left: 0px;
            right: 0px;
            bottom: 0px;
        }
    }
}
</style>