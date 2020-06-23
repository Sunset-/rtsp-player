<template>
    <div class="player-wall">
        <div :class="['player-wall-wrap',currentPlayer==item?'active':'']" v-for="(item,index) in players" :key="index" @click="selectPlayer(item)">
            <rtmp-player :src='item.src'></rtmp-player>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            players: [{
                src : ''
            }, {
                src : ''
            }, {
                src : ''
            }, {
                src : ''
            }],
            currentPlayer : null
        };
    },
    methods : {
        play(options){
            this.currentPlayer.src = options.src;
        },
        selectPlayer(item){
            this.currentPlayer = item;
        }
    },
    mounted(){
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
        &.active{
            border-color:rgb(18, 123, 254);
        }
    }
}
</style>