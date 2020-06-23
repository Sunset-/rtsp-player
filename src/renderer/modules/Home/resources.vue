<template>
    <div class="resources-wrap">
        <xui-fasttree ref="tree" class="resource-tree" :options="options" @selected-node="selected" style="height:100%;"></xui-fasttree>
    </div>
</template>
<script>
import Store from "./store.js";

export default {
    data() {
        return {
            options: {
                rootId: "null",
                key: {
                    id: "id",
                    parentId: "parentId",
                    name: "name",
                    title: "name"
                },
                focus: {
                    enable(node) {
                        return !!node.cameraIndexCode;
                    },
                    multiple: true,
                    focusOn: "dbclick"
                },
                isExpandOnDbClickNode: true,
                isAutoExpandRoot: true,
                nodeHeight: 30,
                levelSpace : 17,
                template(node) {
                    var icon;
                    if (node.isParent) {
                        icon = "";
                    }else{
                        icon = "iconfont iconshexiangji";
                    }
                    if (node.nodeType == 2) {
                        if (node.type == 1) {
                            icon = "iconfont iconshexiangji";
                        } else if (node.type == 2) {
                            icon = "iconfont iconcheliangzhuapaiji";
                        } else if (node.type == 3) {
                            icon = "iconfont iconwifi";
                        } else if (node.type == 11) {
                            icon = "iconfont iconrenlianzhuapaiji";
                        } else if (node.type == 6) {
                            icon = "iconfont iconGPS";
                        } else if (node.type == 4) {
                            icon = "iconfont icondianziweilan";
                        } else if (node.type == 5) {
                            icon = "iconfont iconRFID";
                        } else if (node.type == 7) {
                            icon = "iconfont icongaokongxiangji";
                        } else if (node.type == 14) {
                            icon = "iconfont iconweikakou";
                        } else if (node.type == 15) {
                            icon = "iconfont iconqiakou";
                        } else if (node.type == 16) {
                            icon = "iconfont icondianzijingcha";
                        } else if (node.type == 20) {
                            icon = "iconfont iconwifitanzhen";
                        } else if (node.type == 21) {
                            icon = "iconfont iconganzhishebei";
                        } else if (node.type == 22) {
                            icon = "iconfont iconjinggai";
                        } else if (node.type == 23) {
                            icon = "iconfont iconmenjin";
                        } else if (node.type == 24) {
                            icon = "iconfont iconxiaoqushexiangtou";
                        } else {
                            icon = "iconfont iconshushebei1";
                        }
                    }
                    return `<div class="resource-tree-node">
                    ${icon?`<i  style="font-weight:600;font-size:14px;" class="resource-tree-node-icon ${icon}"></i>`:''}
                    <span style="${
                        node.isLive ? "color:#4CAF50" : ""
                    }" class="resource-tree-node-label">${node.name}${
                        node.nodeType == 1 &&
                        treeType != 4 &&
                        !isOrgTree &&
                        Sunset.isNumber(node.resourceCount) &&
                        !safeOptions.nodeFilter
                            ? ` (${node.resourceCount})`
                            : ""
                    }</span>
                    </div>`;
                },
                isParent(node) {
                    return node.isParent;
                },
                datasource: parentNode => {
                    if (!parentNode) {
                        return Store.loadAllReources().then(res => {
                            return res;
                        });
                        return [
                            {
                                id: `1`,
                                parentId: "0",
                                name: `node_1`
                            }
                        ];
                    } else {
                        return [];
                    }
                }
            }
        };
    },
    methods: {
        selected(node,flag) {
            console.log(node,flag)
            this.$emit("selected", node);
        },
        removeFocus(id) {
            this.$refs.tree.selectNode(id, false);
        }
    },
    mounted() {}
};
</script>
<style lang="less">
@import "~@/style/variable.less";
.resources-wrap {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    overflow-x: auto;
    padding-left:5px;
}
@node-height: 30px;

.resource-tree {
    height: 100%;
    //fast tree
    &.xui-fasttree {
        width: 100%;
        .xui-fasttree-nodes {
            width: 100%;
        }
        .xui-fasttree-node-empty {
            display: none;
            height: @node-height;
            line-height: @node-height;
            &:before {
                content: "暂无数据。";
                padding-left: 5px;
                color: #777;
                display: block;
            }
        }
        .xui-fasttree-node {
            width: 100%;
            display: table;
            box-sizing: border-box;
            padding-right: 10px;
            font-size: 0px;

            .xui-fasttree-nodetoolbar {
                .xui-fasttree-operate {
                    font-size: 14px;
                    margin-left: 5px;
                    color: @color-primary;
                }
            }
            &:hover,
            &.hover {
                background: fade(@color-normal-hover, 15%);
                .np-node-label {
                    font-weight: bold;
                    color: @color-primary;
                }
                .xui-fasttree-nodetoolbar {
                    .xui-fasttree-operate.hover {
                        display: inline-block;
                    }
                }
            }
            &.selected {
                background: fade(orange, 15%);
                color: orange;
                .resource-tree-node-icon{
                    color: orange;
                }
                .resource-tree-node {
                    & > span {
                        font-weight: bold;
                        color: orange;
                    }
                }
                .xui-fasttree-toggle {
                    &:before {
                        color: orange;
                    }
                    &.expand {
                        &:before {
                            color: orange;
                        }
                    }
                }
            }
            &.loading {
                @keyframes toggleRotate {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
                @-webkit-keyframes toggleRotate {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
                .xui-fasttree-toggle::before {
                    visibility: hidden;
                }
                .xui-fasttree-toggle::after {
                    visibility: visible;
                }
            }
            &.add-icon .resource-tree-node {
                padding-left: 14px;
            }
            .xui-fasttree-toggle-empty {
                display: none;
                position: relative;
                vertical-align: middle;
                width: 13px;
                height: 13px;
                text-align: center;
                border: 1px solid transparent;
                border-radius: 2px;
                margin-right: 0px;
                margin-left: 6px;
                margin-top: 0px;
                visibility: hidden;
            }
            .xui-fasttree-toggle {
                position: relative;
                display: inline-block;
                vertical-align: middle;
                width: 14px;
                height: 14px;
                margin-left: 0px;
                margin-right: 3px;
                &::after {
                    visibility: hidden;
                }
                &:hover {
                    color: @color-primary;
                }
                &.expand {
                    &:before {
                        content: "\E6BA";
                        visibility: visible;
                        font-size: 12px;
                        font-family: "iconfont" !important;
                        color: @color-subcolor;
                        position: absolute;
                        left: 0;
                        top: 2px;
                    }
                }
                &:before {
                    content: "\E6AE";
                    visibility: visible;
                    font-size: 12px;
                    font-family: "iconfont" !important;
                    color: @color-subcolor;
                    position: absolute;
                    left: 0;
                    top: 2px;
                }
            }
            .xui-fasttree-nodewrap {
                display: table-cell;
                width: 100%;
            }
            //checked
            .xui-fasttree-checker {
                border-radius: 2px;
                &.checked {
                    &.multiple {
                        border: 1px solid @color-primary;
                        background: @color-primary;
                        &:before {
                            content: "";
                            display: inline-block;
                            vertical-align: top;
                            background: transparent;
                            border-style: solid;
                            border-width: 1px;
                            width: 7px;
                            height: 3px;
                            border-color: transparent transparent #fff #fff;
                            transform: rotate(-60deg);
                            -webkit-transform: rotate(-60deg);
                            margin-top: 2px;
                        }
                    }
                    &.single {
                        &:before {
                            background: lighten(@color-primary, 8%);
                        }
                    }
                }
                &.multiple.half-check {
                    border: 1px solid @color-primary;
                    background: #fff;
                    &:before {
                        content: "";
                        display: block;
                        background: @color-primary;
                        width: 100%;
                        height: 100%;
                        transform: rotate(0deg);
                        left: 10%;
                        top: 10%;
                        margin: 0px;
                        border: 2px solid #fff;
                        box-sizing: border-box;
                    }
                }
            }
            //content
            .xui-fasttree-nodecontent {
                position: relative;
                display: block;
                overflow: hidden;
            }
            //toolbar
            .xui-fasttree-nodetoolbar {
                float: right;
                margin-top: 8px;
                margin-left: 5px;
                display: block;
                & > * {
                    vertical-align: top;
                    margin: 0px 2px;
                }
                .mvtb-icon-ip {
                    top: 1px;
                }
                .xui-fasttree-operate.hover {
                    display: none;
                }
            }
        }
        //empty
        .xui-fasttree-empty {
            display: none;
            &:after {
                content: "暂无数据。";
                padding: 10px 10px;
                color: #777;
                line-height: 20px;
                display: block;
            }
        }
    }

    .resource-tree-node {
        height: @node-height;
        line-height: @node-height;
        display: inline-table;
        vertical-align: middle;
        //label
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #fff;

        .resource-tree-node-label {
            font-size: 14px;
            vertical-align: middle;
            display: inline-block;
        }
        //icon
        .resource-tree-node-icon {
            margin: 0px 2px 0px 3px;
            vertical-align: middle;
            color: #FFF;
            font-size: 14px;
            padding-right: 3px;
        }
        .online-style {
            color: #299cff;
        }
        .offline-style {
            color: #adadad;
        }
        .icon-style {
            margin-right: 5px;
            margin-left: 5px;
        }
        .i-b_jgh2 {
            color: #f98d2d;
        }
        .i-root,
        .i-group {
            font-size: 14px;
            margin-left: 5px;
            color: #5cb3fe;
        }
        //label
        .np-node-labelwrap {
            display: block;
            line-height: 29px;
            position: relative;
            display: table-cell;
            width: 100%;
        }
        .np-node-label {
            position: absolute;
            left: 0px;
            top: 0px;
            bottom: 0px;
            right: 0px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}
</style>
