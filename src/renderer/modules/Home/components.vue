<template>
    <div>
       
    </div>
</template>
<script>


export default {
    data() {
        return {
         
        };
    },
    methods: {
       
    },
    mounted() {
    }
};
</script>
<style lang="less">
@import "~@/style/variable.less";

.component-item {
    position: relative;
    width: calc(100% - 10px);
    background: @color-background-component;
    margin: 0px auto 10px auto;
    padding: 10px;
    border: 1px solid @color-border;
    border-top: 4px solid @color-success;
    border-radius: 2px;
    box-sizing: border-box;
    cursor: pointer;
    padding-top: 25px;
    text-align: left;
    font-size: 12px;
    &.active {
        background: @color-background-gray;
    }
    &.unknow {
        border-top: 4px solid @color-border;
        &:before {
            background: @color-border;
        }
    }
    &.success {
        border-top: 4px solid @color-success;
        &:before {
            background: @color-success;
        }
    }
    &.primary {
        border-top: 4px solid @color-primary;
        &:before {
            background: @color-primary;
        }
    }
    &.warn {
        border-top: 4px solid @color-warning;
        &:before {
            background: @color-warning;
        }
    }
    &:before {
        content: attr(title);
        max-width: 140px;
        height: 20px;
        line-height: 20px;
        position: absolute;
        left: 0px;
        top: -2px;
        color: #fff;
        font-size: 11px;
        padding: 0px 5px;
        background: @color-success;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    & > p {
        padding: 5px 0px;
        color: @color-title;
        font-size: 14px;
    }
    & > div {
        padding-top: 10px;
        color: @color-subcolor;
    }
    .remove-trigger {
        position: absolute;
        right: 5px;
        top: 5px;
        color: @color-subcolor;
        &:hover {
            color: @color-primary;
        }
    }
    .edit-trigger {
        position: absolute;
        right: 25px;
        top: 5px;
        color: @color-subcolor;
        &:hover {
            color: @color-primary;
        }
    }
}

.sidebar-foot {
    position: absolute;
    left: 0px;
    bottom: 0px;
    height: 40px;
    right: 0px;
    text-align: right;
    line-height: 40px;
    border-top: 1px solid @color-border;
    padding: 0px 5px;
    & > span {
        display: inline-block;
        vertical-align: middle;
        color: #fff;
        padding-top: 2px;
        float: left;
    }
}
.scroll-content.xui-virtualized-content {
    width: 100%;
}
.xui-dropdown.xui-dropdown-style {
    .xui-dropdown-option {
        text-align: left;
    }
}
</style>
