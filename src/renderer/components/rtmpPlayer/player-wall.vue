<template>
    <div class="player-wall">
        <div :class="['player-wall-wrap',currentPlayer==item?'active':'']" v-for="(item,index) in players" :key="index" @mousedown="selectPlayer(item)">
            <rtmp-player ref="player" :resource="item.resource" @close="stop(item)"></rtmp-player>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            players: [
                {
                    title : "",
                    resource : null
                },
                {
                    title : "",
                    resource : null
                },
                {
                    title : "",
                    resource : null
                },
                {
                    title : "",
                    resource : null
                }
            ],
            currentPlayer: null
        };
    },
    methods: {
        play(resource) {
            var player = null;
            if (!this.currentPlayer.resource) {
                player = this.currentPlayer;
            } else if (!(player = this.players.filter(item => !item.resource)[0])) {
                player = this.currentPlayer;
            }
            player.resource = resource;
            this.currentPlayer = player;
        },
        stop(item) {
            var resource = item.resource;
            item.resource = null;
            this.$emit("stop",resource)
        },
        selectPlayer(item) {
            this.currentPlayer = item;
        },
        alarm(resource){
            //playing
            for(var i=0;i<this.players.length;i++){
                if(this.players[i].resource&&this.players[i].resource.id==resource.id){
                    this.$refs.player[i].alarm();
                    return;
                }
            }
            //open new
            this.play(resource);
            this.$nextTick(()=>{
                for(var i=0;i<this.players.length;i++){
                    if(this.players[i].resource&&this.players[i].resource.id==resource.id){
                        this.$refs.player[i].alarm();
                        return;
                    }
                }
            });
        }
    },
    mounted() {
        this.currentPlayer = this.players[0];
    }
};
</script>
<style lang="less">
.player-wall {
    font-size: 0px;
    .player-wall-wrap {
        width: 50%;
        height: 50%;
        font-size: 14px;
        box-sizing: border-box;
        display: inline-block;
        vertical-align: top;
        border: 1px solid #444;
        &.active {
            border-color: orange;
        }
    }
}
</style>