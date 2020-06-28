<template>
    <div class="resources-wrap">
        <xui-fasttree ref="tree" class="resource-tree" :options="treeOptions" @init="onInited" @selected-node="selected" @checked="onChecked" style="height:100%;"></xui-fasttree>
    </div>
</template>
<script>
const HikSDK = require("electron").remote.app.$hiksdk;
import Store from "./store.js";

export default {
    props: {
        options: {}
    },
    data() {
        return {
            loadedResources: [],
            loadedResourceMap: {}
        };
    },
    computed: {
        treeOptions() {
            var safeOptions = this.options || {};
            return {
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
                check: {
                    enable: safeOptions.check,
                    type: "multiple",
                    cascade: "C"
                },
                isExpandOnDbClickNode: true,
                isAutoExpandRoot: true,
                nodeHeight: 30,
                levelSpace: 17,
                template(node) {
                    var icon;
                    if (node.isParent) {
                        icon = "";
                    } else {
                        icon = "iconfont iconshexiangji";
                    }
                    return `<div class="resource-tree-node">
                    ${
                        icon
                            ? `<i  style="font-weight:600;font-size:14px;" class="resource-tree-node-icon ${icon}"></i>`
                            : ""
                    }
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
                        return HikSDK.loadAllReources()
                            .then(res => {
                                return (safeOptions.auth
                                    ? Store.getConfig().then(cfg => {
                                          cfg = cfg || {};
                                          return (
                                              cfg.authResources || []
                                          ).reduce((m, item) => {
                                              m[item.id] = true;
                                              return m;
                                          }, {});
                                      })
                                    : Promise.resolve({})
                                ).then(authResource => {
                                    var haveResourceRegion = {};
                                    res &&
                                        res.forEach(item => {
                                            if (item.cameraIndexCode) {
                                                if (
                                                    !safeOptions.auth ||
                                                    authResource[item.id]
                                                ) {
                                                    haveResourceRegion[
                                                        item.parentId
                                                    ] = true;
                                                }
                                            } else {
                                                haveResourceRegion[
                                                    item.parentId
                                                ] = true;
                                            }
                                        });
                                    this.loadedResources = res.filter(item => {
                                        if (item.cameraIndexCode) {
                                            return (
                                                !safeOptions.auth ||
                                                authResource[item.id]
                                            );
                                        } else {
                                            return haveResourceRegion[item.id];
                                        }
                                    });
                                    this.loadedResourceMap = this.loadedResources.reduce(
                                        (res, item) => {
                                            res[item.id] = item;
                                            return res;
                                        },
                                        {}
                                    );
                                    return this.loadedResources;
                                });
                            })
                            .catch(e => {
                                $tip("请求流媒体平台失败：" + e, "error");
                            });
                    } else {
                        return [];
                    }
                }
            };
        }
    },
    methods: {
        selected(node, flag) {
            console.log(node, flag);
            this.$emit("selected", node);
        },
        removeFocus(id) {
            this.$refs.tree.selectNode(id, false);
        },
        refresh() {
            this.$refs.tree.init();
        },
        onChecked(nodes) {
            this.$emit("checked", nodes);
            var resources =
                nodes && nodes.filter(item => !!item.cameraIndexCode);
            this.$emit("checked-resource", resources);
        },
        clearChecked(slient) {
            this.$refs.tree.clearChecked(slient);
        },
        checkNodes(...args) {
            this.$refs.tree &&
                this.$refs.tree.checkNodes.apply(this.$refs.tree, args);
        },
        onInited(rootNode) {
            this.$emit("inited", rootNode);
        },
        getLoadedResources() {
            return this.loadedResources;
        },
        getLoadedResourceById(id) {
            return this.loadedResourceMap[id];
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
    padding-left: 5px;
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
                .resource-tree-node-icon {
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
                margin-left: 0px;
                margin-right: 4px;
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
            color: #fff;
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
