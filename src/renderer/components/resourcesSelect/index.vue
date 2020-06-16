<template>
    <div class='relevance_content'>
        <div class='modal_tree'>
            <div class='tree'>
                <xui-input class="common-input-search resource-search" placeholder="请输入关键字检索" v-model="keyword" @change="searchTree"></xui-input>
                <xui-tabs class="manner-button dag-orgtype" v-model="resourceType" :options="resourceTabOptions"></xui-tabs>
                <div class='tree-wrap'>
                    <div class="transmit-tree-wrap">
                        <dag-tree @inited='equipmentTreeInited' :url="url" v-show="resourceType=='EQUIPMENT'" ref="equipmentTree" :options="equipmentTreeOptions" @checked-resource="onCheckedEquipments" @cancelChecked='onCancelCheckedEquipments'></dag-tree>
                        <dag-tree @inited='tollgateTreeInited' :url="url" v-show="resourceType=='TOLLGATE'" ref="tollgateTree" :options="tollgateTreeOptions" @checked-resource="onCheckedTollgates" @cancelChecked='onCancelCheckedTollgates'></dag-tree>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
/**
 * options
 * @param equipmentTreeOptions 设备树参数
 * @param tollgateTreeOptions 卡口树参数
 * @param searchFilter 是否有搜索内容
 */
export default {
    props: {
        options: {},
        url: ""
    },
    data() {
        return {
            keyword: "",
            equipments: [],
            tollgates: [],
            waitEqCheckedIds: [],
            waitTlCheckedIds: [],
            viewportOptions: {
                recordHeight: 35
            },
            resourceType: "EQUIPMENT",
            equipmentTreeOptions: {
                check: true,
                // async: true,
                tree: "EQUIPMENT"
            },
            tollgateTreeOptions: {
                check: true,
                // async: true,
                tree: "TOLLGATE"
            },
            resourceTabOptions: {
                data: [
                    {
                        text: "采集设备",
                        value: "EQUIPMENT"
                    },
                    {
                        text: "卡口",
                        value: "TOLLGATE"
                    }
                ]
            }
        };
    },
    computed: {
        resources() {
            return this.equipments.concat(this.tollgates);
        }
    },
    watch: {
        resourceType() {
            this.$nextTick(() => {
                this.$refs.equipmentTree.refresh();
                this.$refs.tollgateTree.refresh();
            });
        }
    },
    methods: {
        init() {
            this.equipments = [];
            this.tollgates = [];
            this.resourceType = "EQUIPMENT";
            this.equipmentTreeOptions = Object.assign(
                this.equipmentTreeOptions,
                this.options.equipmentTreeOptions
            );
            this.tollgateTreeOptions = Object.assign(
                this.tollgateTreeOptions,
                this.options.tollgateTreeOptions
            );
            this.$nextTick(() => {
                this.$refs.equipmentTree.init();
                this.$refs.tollgateTree.init();
            });
        },
        // 根据关键字检索
        searchTree: Sunset.debounce(function(keyword) {
            this.$refs.equipmentTree.search(keyword);
            this.$refs.tollgateTree.search(keyword);
        }, 200),
        equipmentTreeInited(rootNode) {
            let ids = this.equipments.map(item => {
                return item.id;
            });
            ids.push.apply(ids, this.waitEqCheckedIds || []);
            this.waitEqCheckedIds = [];
            this.$refs.equipmentTree.checkNodes(ids);
            this.$emit("equipmentTreeInited", rootNode);
        },
        tollgateTreeInited(rootNode) {
            let ids = this.tollgates.map(item => {
                return item.id;
            });
            ids.push.apply(ids, this.waitTlCheckedIds || []);
            this.waitTlCheckedIds = [];
            this.$refs.tollgateTree.checkNodes(ids);
            this.$emit("tollgateTreeInited", rootNode);
        },
        // 设备选择
        onCheckedEquipments(nodes, nodeDatas) {
            this.equipments = nodes;
            this.$emit("onCheckedEquipments", this.equipments);
        },
        // 卡口选择
        onCheckedTollgates(nodes, nodeDatas) {
            this.tollgates = nodes;
            this.$emit("onCheckedTollgates", this.tollgates);
        },
        // 设备取消选择
        onCancelCheckedEquipments(nodes) {
            let ids = nodes.map(item => {
                return item.id;
            });
            this.equipments = this.equipments.filter(item => {
                return ids.indexOf(item.id) == -1;
            });
            this.$emit("onCancelCheckedEquipments", nodes);
        },
        // 卡口取消选择
        onCancelCheckedTollgates(nodes) {
            let ids = nodes.map(item => {
                return item.id;
            });
            this.tollgates = this.tollgates.filter(item => {
                return ids.indexOf(item.id) == -1;
            });
            this.$emit("onCancelCheckedTollgates", nodes);
        },
        //  全部取消选择的设备
        removeAll() {
            if (this.options.searchFilter) {
                this.equipments = [];
                this.tollgates = [];
            }
            this.$refs.equipmentTree.clearChecked();
            this.$refs.tollgateTree.clearChecked();
            this.$nextTick(() => {
                this.refresh();
            });
        },
        // 删除单个
        removeTree(item) {
            let k = item.nodeType == 2 ? "equipmentTree" : "tollgateTree";
            this.$refs[k].checkNode(item.id, false);
            if (this.options.searchFilter) {
                let key = item.nodeType == 2 ? "equipments" : "tollgates";
                this[key] = this[key].filter(f => {
                    return f.id != item.id;
                });
            }
            this.$emit("remove", item, k);
        },
        checkNodes(ids) {
            this.waitEqCheckedIds = ids;
            this.waitTlCheckedIds = ids;
            this.$refs.equipmentTree.checkNodes(ids);
            this.$refs.tollgateTree.checkNodes(ids);
            this.$nextTick(() => {
                this.refresh();
            });
        },
        refresh() {
            this.$refs.equipmentTree.refresh();
            this.$refs.tollgateTree.refresh();
        },
        //保存
        save(data) {
            this.$emit("save", data);
        },
        unique(arr1, arr2) {
            var idMap = {};
            for (var i = 0, item; (item = arr1[i++]); ) {
                idMap[item.id] = true;
            }
            for (var i = 0, item; (item = arr2[i++]); ) {
                if (!idMap[item.id]) {
                    arr1.push(item);
                }
            }
            return arr1;
        }
    },
    mounted() {
        this.init();
    }
};
</script>
<style lang="less">
@import "~@/style/variable.less";
.relevance_content {
    position: relative;
    height: 100%;
    overflow: hidden;
    .modal_tree {
        position: absolute;
        box-sizing: border-box;
        top: 0px;
        left: 0px;
        width: 100%;
        bottom: 0px;
        .tree {
            padding: 10px 10px 0px 10px;
            position: absolute;
            top: 0;
            left: 0px;
            right: 0px;
            bottom: 0px;
            border:1px solid @color-border;
            .resource-search {
                margin: 0 0 10px;
                width: 100%;
            }
            .tree-wrap {
                position: absolute;
                bottom: 0px;
                left: 0px;
                right: 0px;
                top: 90px;
                .transmit-tree-wrap {
                    position: absolute;
                    top: 0;
                    left: 12px;
                    right: 0px;
                    bottom: 0px;
                }
            }
        }
    }
    .select-result {
        position: absolute;
        right: 0px;
        top: 0px;
        bottom: 0px;
        width: 50%;
        padding: 5px;
        margin: 10px;
        min-height: 100px;
        border-radius: 3px;
        line-height: 32px;
        background: @color-background;
        .list_title {
            border-bottom: 1px solid @color-divider;
            margin: 5px 10px;
            font-weight: 600;
            .mainColor {
                color: @color-primary;
            }
            .removeAll {
                float: right;
                color: "#00c1de";
                cursor: pointer;
                background: @color-background;
            }
        }
        .scroll-container {
            height: 450px;
            .list_data {
                width: 320px;
                cursor: pointer;
                padding: 0 15px;
                position: relative;
                .list-data-text {
                    width: 300px;
                    overflow: hidden;
                    height: 35px;
                }
                .list-data-icon {
                    position: absolute;
                    right: 16px;
                    top: 0;
                }
                &.active {
                    background: fade(@color-primary, 15%);
                    color: @color-primary;
                }
                &:hover {
                    background: fade(@color-primary, 5%);
                    color: @color-primary;
                }
            }
        }
    }
}
</style>
