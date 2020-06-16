<template>
    <xui-fasttree v-if="treeOptions" ref="tree" class="dag-tree" :options="treeOptions" @init="onInited" @selected-node="onSelected" @checked="onChecked" @cancel-checked="onCancelChecked"></xui-fasttree>
</template>

<script>
import Store from "./store";

export default {
    props: {
        options: {},
        url : ""
    },
    data() {
        return {
            treeOptions: null,
            nodeDatas: []
        };
    },
    computed: {
        safeOptions() {
            return this.options || {};
        }
    },
    methods: {
        init() {
            this.treeOptions = null;
            setTimeout(() => {
                this.initTreeOptions();
            }, 0);
        },
        initTreeOptions() {
            var safeOptions = this.safeOptions;
            if (Object.keys(safeOptions).length != 0) {
                var tree = safeOptions.tree || "EQUIPMENT-ORG";
                var treeType = 1;
                if (tree.indexOf("ORG") != -1) {
                    treeType = 1;
                } else if (tree.indexOf("DICT") != -1) {
                    treeType = 2;
                } else if (tree.indexOf("NODES") != -1) {
                    treeType = 3;
                } else if (tree.indexOf("CHANNEL") != -1) {
                    treeType = 4;
                } else {
                    treeType = 99;
                }
                var orgType = 1;
                if (tree.indexOf("EQUIPMENT") != -1) {
                    orgType = 1;
                } else if (tree.indexOf("ADMINISTRATOR") != -1) {
                    orgType = 0;
                } else if (tree.indexOf("TOLLGATE") != -1) {
                    orgType = 2;
                }
                var isOrgTree = ~tree.indexOf("ORG");
                var treeOptions = {
                    rootId: "0",
                    key: {
                        id: "id",
                        parentId: "parentId",
                        name: "name",
                        title: "name"
                    },
                    focus: Sunset.isObject(safeOptions.select)
                        ? safeOptions.select
                        : {
                              enable: safeOptions.select
                          },
                    check: {
                        enable: safeOptions.check,
                        type: "multiple",
                        cascade: "PC"
                    },
                    levelSpace: 20,
                    nodeHeight: 30,
                    doubleClickInterval: 0,
                    isAutoExpandRoot: true,
                    isExpandOnDbClickNode: true,
                    template: node => {
                        var icon;
                        if (node.nodeType == "2" || node.nodeType == "3") {
                            icon = "iconfont iconshushebei1";
                        }
                        return `<div class="dag-tree-node ${
                            safeOptions.nodeClass
                                ? safeOptions.nodeClass(node)
                                : ""
                        } ">
                    <i  style="${
                        node.isLive ? "color:#4CAF50" : ""
                    }" class="dag-tree-node-icon ${icon}"></i>
                    <span style="${
                        node.isLive ? "color:#4CAF50" : ""
                    }" class="dag-tree-node-label">${node.name}${
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
                    search: keyword => {
                        return Store.search(this.url,keyword, orgType);
                    },
                    isParent(node) {
                        if (treeType == 4) {
                            return (
                                node.nodeType == 1 ||
                                node.nodeType === void 0 ||
                                node.nodeType == 2 ||
                                node.nodeType == 3
                            );
                        } else if (treeType == 3) {
                            return node.parentId == 0;
                        } else {
                            return (
                                node.nodeType == 1 || node.nodeType === void 0
                            );
                        }
                    }
                };
                if (safeOptions.toolbar) {
                    treeOptions.toolbar = [
                        {
                            title: "添加",
                            icon: "iconfont iconxinzeng",
                            operate: (record, v, m, s) => {
                                console.log(record, v, m, s);
                                this.add(record, v);
                            }
                        },
                        {
                            title: "编辑",
                            icon: "iconfont iconbianjixiugai",
                            operate: (record, v) => {
                                this.edit(record, v);
                            }
                        },
                        {
                            title: "删除",
                            icon: "iconfont iconshanchu",
                            operate: record => {
                                this.remove(record);
                            }
                        }
                    ];
                }
                var attachFilter = safeOptions.filter || {};
                if (safeOptions.async) {
                    treeOptions.nodes = () =>
                        (this.nodeDatas = this.loadNodes(
                            Store.asyncTree(this.url,
                                Object.assign(
                                    {
                                        ids: ["0"],
                                        orgType: orgType,
                                        nodeType: isOrgTree
                                            ? "1"
                                            : orgType == 1
                                            ? "1,2"
                                            : orgType == 2
                                            ? "1,3"
                                            : "1"
                                    },
                                    attachFilter
                                ),
                                safeOptions.nodeFilter ? false : true
                            )
                        ));
                } else {
                    if (treeType == 99) {
                        // 获取子孙
                        treeOptions.loadPosterity = nodeId => {
                            return this.loadNodes(
                                Store.loadPosterity(this.url,nodeId, orgType)
                            );
                        };
                        // 获取祖先
                        treeOptions.loadAncestors = ids => {
                            return this.loadNodes(
                                Store.loadAncestors(this.url,ids, orgType)
                            );
                        };
                    }

                    treeOptions.datasource = parentNode => {
                        let ids = {
                            ids: [parentNode && parentNode.id]
                        };
                        return (this.nodeDatas = this.loadNodes(
                            Store.tree(this.url,
                                Object.assign(
                                    {
                                        orgType: orgType,
                                        nodeType: isOrgTree
                                            ? "1"
                                            : orgType == 1
                                            ? "1,2"
                                            : orgType == 2
                                            ? "1,3"
                                            : "1"
                                    },
                                    ids.ids[0] != null ? ids : {},
                                    attachFilter
                                )
                            )
                        ));
                    };
                    // 获取下级
                }
                this.treeOptions = treeOptions;
            }
        },
        loadNodes(promise) {
            if (promise instanceof Array) {
                if (Sunset.isFunction(this.safeOptions.nodeFilter)) {
                    promise = promise.filter(this.safeOptions.nodeFilter);
                }
                return promise;
            } else {
                return promise.then(res => {
                    if (Sunset.isFunction(this.safeOptions.nodeFilter)) {
                        res = res.filter(this.safeOptions.nodeFilter);
                    }
                    return res;
                });
            }
        },
        edit(record, v) {
            this.$emit("edit", record, v);
        },
        add(record, v) {
            this.$emit("add", record, v);
        },
        remove(record) {
            this.$emit("remove", record);
        },
        refresh() {
            this.$refs.tree && this.$refs.tree.refresh();
        },
        getAllSelected() {
            return this.$refs.tree.tree.selectIds;
        },
        selectNode(id) {
            this.$refs.tree.selectNode(id, true);
        },
        onSelected(node, parents) {
            this.$emit("selected", node, parents);
        },
        onChecked(nodes) {
            this.$emit("checked", nodes, this.nodeDatas);
            var resources = nodes && nodes.filter(item => item.nodeType != 1);
            this.$emit("checked-resource", resources, this.nodeDatas);
        },
        onCancelChecked(nodes) {
            this.$emit("cancelChecked", nodes);
        },
        clearSelectNode(id) {
            this.$refs.tree.selectNode(id, false);
        },
        clearSelected() {
            this.$refs.tree.clearSelected();
        },
        clearChecked(slient) {
            this.$refs.tree.clearChecked(slient);
        },
        checkNode(...args) {
            this.$refs.tree.checkNode.apply(this.$refs.tree, args);
        },
        search(...args) {
            this.$refs.tree &&
                this.$refs.tree.search.apply(this.$refs.tree, args);
        },
        checkNodes(...args) {
            this.$refs.tree.checkNodes.apply(this.$refs.tree, args);
        },
        refreshNode(node) {
            this.$refs.tree.refreshNode(node);
        },
        removeNode(id) {
            this.$refs.tree.removeNode(id);
        },
        onInited(rootNode) {
            var safeOptions = this.options || {};
            if (safeOptions.selectedRoot) {
                if (rootNode) {
                    this.$refs.tree.selectNode([rootNode.id], true);
                }
                this.$emit("selected", rootNode);
            }
            this.$emit("inited", rootNode);
        }
    },
    mounted() {
        this.init();
    }
};
</script>
<style lang="less">
@import "~@/style/variable.less";

@node-height : 30px;

.dag-tree {
    height: 100%;
    //fast tree
    &.xui-fasttree {
        width: 100%;
        .xui-fasttree-nodes {
            width: 100%;
        }
        .xui-fasttree-node-empty {
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
                background: fade(@color-normal-active, 15%);
                color: @color-primary;
                .dag-tree-node {
                    & > span {
                        font-weight: bold;
                        color: @color-primary;
                    }
                }
                .xui-fasttree-toggle {
                    &:before {
                        color: @color-primary;
                    }
                    &.expand {
                        &:before {
                            color: @color-primary;
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
            &.add-icon .dag-tree-node {
                padding-left: 14px;
            }
            .xui-fasttree-toggle-empty {
                position: relative;
                display: inline-block;
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
                margin-left: 7px;
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
                        // left: 50%;
                        // width: 0px;
                        // height: 0px;
                        // border-style: solid;
                        // border-width: 5px;
                        // color: currentColor;
                        // border-color: transparent transparent transparent currentColor;
                        // transform: translate(-25%, -50%) rotate(0deg);
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
                    // left: 50%;
                    // width: 0px;
                    // height: 0px;
                    // border-style: solid;
                    // border-width: 5px;
                    // color: currentColor;
                    // border-color: transparent transparent transparent currentColor;
                    // transform: translate(-25%, -50%) rotate(0deg);
                }

                &:after {
                    // content: "\E6BA";
                    // visibility: visible;
                    // font-size: 12px;
                    // font-family: "iconfont" !important;
                    // color: @color-subcolor;
                    // border-radius: 50%;
                    // width: 10px;
                    // height: 10px;
                    // float: left;
                    // font-size: 10px;
                    // position: relative;
                    // text-indent: -9999em;
                    // border-top: 2px solid fade(@color-primary, 20%);
                    // border-right: 2px solid fade(@color-primary, 20%);
                    // border-bottom: 2px solid fade(@color-primary, 20%);
                    // border-left: 2px solid @color-primary;
                    // -webkit-animation: toggleRotate 1.1s infinite linear;
                    // animation: toggleRotate 1.1s infinite linear;
                }
            }
            .xui-fasttree-nodewrap {
                display: table-cell;
                width: 100%;
                border-bottom: 1px dashed transparent;
            }
            //checked
            .xui-fasttree-checker {
                border: 1px solid @color-subcolor;
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
            &:after {
                content: "暂无数据。";
                padding: 10px 10px;
                color: #777;
                line-height: 20px;
                display: block;
            }
        }
    }

    .dag-tree-node {
        height: @node-height;
        line-height: @node-height;
        display: inline-table;
        vertical-align: middle;
        //label
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        .dag-tree-node-label {
            font-size: 14px;
            vertical-align: middle;
            display: inline-block;
        }
        //icon
        .dag-tree-node-icon {
            margin: 0px 2px 0px 3px;
            vertical-align: middle;
            color: @color-primary;
            font-size: 14px;
            padding: 0px 3px;
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