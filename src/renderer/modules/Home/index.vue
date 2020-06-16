<template>
    <div class="MODULE-Home">
        <home-components ref="components" class="BOX home-components-wrap"></home-components>
        <div class="BOX home-component-frame">
            <div class="report-header">
                <span class="report-title"></span>
                <span class="report-subtitle">创建于</span>
                <xui-toolbar :options="toolbarOptions" style="float:right;"></xui-toolbar>
            </div>
            <div class="BOX home-component-content" style="overflow-y:scroll;">
                <div style="border:2px solid #ccc;margin:5px;padding:5px;">
                    <div>
                        <span>RTSP地址：</span>
                        <input v-model="rtspUrl">
                        <button type="button" @click="play()">连接webrtc</button>
                    </div>
                    <div class="demos">
                        <button type="button" @click="play(demo1)">门口海康</button>
                        <button type="button" @click="play(demo2)">桌上大华</button>
                    </div>
                </div>
                <div class="video-panels">
                    <video-player v-for="vp in videos" :key="vp.id" :rtsp="vp.rtsp" @close="remove(vp)">
                        <video id="video"></video>
                    </video-player>
                </div>
                <canvas id="canvas_9990" style="width:500px;"></canvas>
            </div>
        </div>
    </div>
</template>
<script>
import HomeComponents from "./components";
import Store from "./store.js";
import VideoPlayer from "./player.vue";

const exec = require("child_process").exec;

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
            rtspUrl:
                "rtsp://admin:DFwl123456@172.16.133.207:554/Streaming/Channels/101?transportmode=unicast&profile=Profile_1",
            demo1:
                "rtsp://admin:DFwl123456@172.16.133.207:554/Streaming/Channels/101?transportmode=unicast&profile=Profile_1",
            demo2:
                "rtsp://admin:DFwl123456@172.16.133.159:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif",
            videos: []
        };
    },
    methods: {
        open(){
// 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
            var workerProcess = exec(`D:\\js_workspace\\rtsp-player\\media.exe`);
            // 不受child_process默认的缓冲区大小的使用方法，没参数也要写上{}：workerProcess = exec(cmdStr, {})
            // 打印正常的后台可执行程序输出
            workerProcess.stdout.on("data", function(data) {
                console.log("stdout: " + data);
            });

            // 打印错误的后台可执行程序输出
            workerProcess.stderr.on("data", function(data) {
                console.log("stderr: " + data);
            });

            // 退出之后的输出
            workerProcess.on("close", function(code) {
                console.log("out code：" + code);
            });

            return;
        },
        play(url) {
            
            var rtsp = url || this.rtspUrl;
            if (!rtsp) {
                return;
            }
            this.videos.push({
                id: Date.now(),
                rtsp: rtsp
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
            height: 45px;
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
}
.video-panels > div {
    display: inline-block;
}
</style>