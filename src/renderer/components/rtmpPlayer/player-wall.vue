<template>
    <div class="player-wall">
        <div :class="['player-wall-wrap',currentPlayer==item?'active':'']" v-for="(item,index) in players" :key="index" @mousedown="selectPlayer(item)">
            <rtmp-player :src='item.src' @close="stop(item)"></rtmp-player>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            players: [
                {
                    src: "",
                    resource : null
                },
                {
                    src: "",
                    resource : null
                },
                {
                    src: "",
                    resource : null
                },
                {
                    src: "",
                    resource : null
                }
            ],
            currentPlayer: null
        };
    },
    methods: {
        play(resource,src) {
            var player = null;
            if (!this.currentPlayer.src) {
                player = this.currentPlayer;
            } else if (!(player = this.players.filter(item => !item.src)[0])) {
                player = this.currentPlayer;
            }
            player.resource = resource;
            player.src = src;
            this.currentPlayer = player;
        },
        stop(item) {
            var resource = item.resource;
            item.src = null;
            item.resource = null;
            this.$emit("stop",resource)
        },
        selectPlayer(item) {
            this.currentPlayer = item;
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
        border: 1px solid rgb(255, 255, 255);
        &.active {
            border-color: rgb(18, 123, 254);
        }
    }
}
</style>