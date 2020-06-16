<template>
    <div class="video-panel">
        <div class="close" @click="close">关闭</div>
        <video ref="video"></video>
    </div>
</template>
<script>
var iceServer = {
    iceServers: [
        {
            url: "stun:stun.l.google.com:19302"
        }
    ]
};

export default {
    props: {
        rtsp: {}
    },
    data() {
        return {
            pc: null
        };
    },
    methods: {
        init() {
            var self = this;

            var pc = (this.pc = new RTCPeerConnection(iceServer));
            pc.onnegotiationneeded = handleNegotiationNeededEvent;
            let log = msg => {
                console.log(msg);
            };

            pc.ontrack = function(event) {
                log(event.streams.length + " track is delivered");
                var el = self.$refs.video;
                el.srcObject = event.streams[0];
                el.muted = true;
                el.autoplay = true;
                el.controls = true;
            };

            pc.oniceconnectionstatechange = e => {
                log(pc.iceConnectionState);
            };
            function handleNegotiationNeededEvent() {
                // 生成提议
                pc.createOffer(
                    function(aSessionDescription) {
                        pc.setLocalDescription(aSessionDescription);
                        $.ajax({
                            url: "http://172.16.133.123:9977/api/recive",
                            type: "POST",
                            data: {
                                url: self.rtsp,
                                data: Base64.encode(aSessionDescription.sdp)
                            }
                        }).then(res => {
                            pc.setRemoteDescription(
                                new RTCSessionDescription({
                                    type: "answer",
                                    sdp: atob(res)
                                })
                            );
                            //send ping becouse PION not handle RTCSessionDescription.close()
                            // var sendChannel = pc.createDataChannel('foo');
                            // sendChannel.onclose = () => console.log('sendChannel has closed');
                            // sendChannel.onopen = () => {
                            //     console.log('sendChannel has opened');
                            //     sendChannel.send('ping');
                            //     setInterval(() => {
                            //     sendChannel.send('ping');
                            //     }, 1000)
                            // }
                            // sendChannel.onmessage = e => log(`Message from DataChannel '${sendChannel.label}' payload '${e.data}'`);
                        });
                        // 现在可以将会话描述（提议offer）发送给对等端，以便对等端
                        // a)、将提议传递给setRemoteDescription
                        // b)、调用createAnswer
                    },
                    function(a, b, c) {
                        alert(JSON.stringify(a));
                    }
                );
            }

            pc.addTransceiver("video", {
                direction: "sendrecv"
            });
        },
        close() {
            if (this.pc) {
                this.pc.close();
                this.$emit("close");
            }
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
</style>