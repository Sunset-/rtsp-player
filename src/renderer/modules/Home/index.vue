<template>
    <div :class="['MODULE-Home',showSideBar?'show-sidebar':'']">
        <webview src="https://www.adobe.com/software/flash/about/" plugins></webview>
        <div class="home-header">
            <div class="logo">警视联动</div>
            <span class="config-trigger" @click="hideSideBar">
                {{showSideBar?'隐藏资源树':'显示资源树'}}
            </span>
            <span class="config-trigger" @click="editResourceConfig">
                资源配置
            </span>
            <span class="config-trigger" @click="editConfig">
                系统配置
            </span>
        </div>
        <div class="BOX home-sidebar">
            <home-resources ref="resources" :options="treeOptions" @selected="play"></home-resources>
        </div>
        <div class="BOX home-major">
            <player-wall ref="playerWall" class="rtmp-player-wall" @stop="onStop"></player-wall>
        </div>
        <home-config ref="configer" @refresh="configRefresh"></home-config>
        <resource-config ref="resourceConfiger" @refresh="configRefresh"></resource-config>
    </div>
</template>
<script>
import HomeConfig from "./config";
import ResourceConfig from "./resourceConfig";
import HomeResources from "./resources";
import Store from "./store.js";
const HikSDK = require("electron").remote.app.$hiksdk;

import http from "http";

export default {
    components: {
        HomeConfig,
        ResourceConfig,
        HomeResources
    },
    computed: {},
    data() {
        return {
            treeOptions: {
                auth: true
            },
            showSideBar: true,
            rtmpUrl: "rtmp://58.200.131.2:1935/livetv/hunantv",
            demo1: "https://gbs.liveqing.com:10010/sms/34020000002020000001/hls/34020000001110000064_37020100001320000003/34020000001110000064_37020100001320000003_live.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTM2NTk3NTUsInB3IjoiZ3Vlc3QiLCJ0bSI6MTU5MzY1OTQ1NSwidW4iOiJndWVzdCJ9.bcrX0tbBJe_bHyme-VAZDRb64jLLTkTiz3yXYJXfvKg"//"rtmp://58.200.131.2:1935/livetv/hunantv"
        };
    },
    methods: {
        // play(url) {
        //     var rtmp = url || this.rtmpUrl;
        //     if (!rtmp) {
        //         return;
        //     }
        //     this.$refs.playerWall.play({
        //         src: rtmp
        //     });
        // },
        remove(v) {
            this.videos = this.videos.filter(cv => cv.id != v.id);
        },
        play(camera,cb) {
            Store.getConfig().then(config=>{
                this.$refs.playerWall.play(camera);
                cb&&cb();
            });
        },
        onStop(camera) {
            this.$refs.resources.removeFocus(camera.cameraIndexCode);
        },
        editConfig() {
            this.$refs.configer.open();
        },
        editResourceConfig() {
            this.$refs.resourceConfiger.open();
        },
        configRefresh() {
            this.$refs.resources.refresh();
        },
        hideSideBar() {
            this.showSideBar = !this.showSideBar;
        },
        init() {
            setInterval(() => {
                Store.loadAlarmResources()
                    .then(res => {
                        console.log(res);
                        if (res.length == 0) {
                            return;
                        }
                        res.forEach(id => {
                            var camera = this.$refs.resources.getLoadedResourceById(
                                id
                            );
                            if (camera) {
                                this.play(camera,()=>{
                                    this.$refs.resources.selectNode(
                                        camera.id,
                                        true
                                    );
                                    this.$refs.playerWall.alarm(
                                        camera,
                                        url || this.demo1
                                    );
                                })
                            }
                        });
                    })
                    .catch(e => {
                        $tip("数据库连接失败：" + e, "error");
                    });
            }, 5000);
        },
        test() {
            HikSDK.loadAllReources().catch(e => {
                $tip("请求流媒体平台失败：" + e, "error");
            });
            return;
            this.$refs.playerWall.alarm(
                {
                    id: "eddf8458f74d42e9bf4ecfc752dba146"
                },
                "rtmp://58.200.131.2:1935/livetv/hunantv"
            );
            return;
            var httpOpts = {
                host: "61.135.169.125",
                method: "POST",
                port: 443,
                path: "/api/test"
            };
            var bodyData = "";
            return new Promise((resolve, reject) => {
                console.log("---------start");
                var req = http.request(httpOpts, function(res) {
                    console.log("---------sended");
                    res.setEncoding("utf-8");
                    var buff = "";
                    res.on("data", function(chunk) {
                        buff += chunk;
                    });
                    res.on("end", function(chunk) {
                        console.log("end:" + buff);
                        try {
                            var data = JSON.parse(buff);
                            if (data && data.code == "0") {
                                resolve(data.data);
                            } else if (data) {
                                $tip(
                                    `${data.code}:${ERR_CODE[data.code] ||
                                        "未知错误"}`
                                );
                                reject(
                                    `${data.code}:${ERR_CODE[data.code] ||
                                        "未知错误"}`
                                );
                            } else {
                                $tip(`未知错误`);
                                reject("未知错误");
                            }
                        } catch (e) {
                            resolve(buff);
                        }
                    });
                });
            });
            req.setTimeout(5 * 1000);
            if (bodyData) {
                req.write(bodyData);
            }
            req.on("error", function(e) {
                console.error(e);
                reject(e);
            });
            req.write("");
            req.end();
        }
    },
    mounted() {
        this.init();
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
        background: #1f2129;
        border-bottom: 1px solid #444;
        box-shadow: 0px 6px 7px 4px rgba(0, 21, 41, 0.12);
        height: @header-height;
        line-height: @header-height;
        box-sizing: border-box;
        .logo {
            color: orange;
            font-size: 20px;
            display: inline-block;
            padding: 0px 15px;
        }
        .config-trigger {
            float: right;
            padding: 0px 10px;
            -moz-user-select: none; /*火狐*/
            -webkit-user-select: none; /*webkit浏览器*/
            -ms-user-select: none; /*IE10*/
            -khtml-user-select: none; /*早期浏览器*/
            user-select: none;
            cursor: pointer;
            color:#FFF;
            &:hover {
                color: orange;
            }
        }
    }
    &.show-sidebar {
        .home-sidebar {
            display: block;
        }
        .home-major {
            left: @sidebar-width;
        }
    }
    .home-sidebar {
        display: none;
        top: @header-height;
        width: @sidebar-width;
        right: auto;
        background: #1f2129;
        box-sizing: border-box;
        border-right: 1px solid @color-border;
    }

    .home-major {
        top: @header-height;
        left: 0px;
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