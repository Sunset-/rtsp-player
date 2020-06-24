<template>
    <xui-modal ref="modal" title="资源权限及报警映射" :maskClose="false" width="800">
        <div style="width:800px;height:400px;background:#FFF;position:relative;">
            <div class="alarm-resource-panel">
                <home-resources ref="resources" @inited="treeInited" :options="treeOptions" @checked-resource="onChecked"></home-resources>
            </div>
            <div class="alarm-relation-panel">
                <div v-for="item in resources" :key="item.id">
                    {{item.name}}
                </div>
                <xui-toolbar :options="toolbarOptions"></xui-toolbar>
            </div>
        </div>
    </xui-modal>
</template>
<script>
import HomeResources from "./resources";
import Store from "./store.js";

export default {
    components: {
        HomeResources
    },
    data() {
        return {
            isTreeInited: false,
            resources: [],
            treeOptions: {
                check: true
            },
            toolbarOptions: {
                tools: [
                    {
                        label: "保存",
                        color: "success",
                        operate: () => {
                            this.save();
                        }
                    },
                    {
                        label: "取消",
                        color: "info",
                        operate: () => {
                            this.$refs.modal.close();
                        }
                    }
                ]
            }
        };
    },
    methods: {
        open() {
            this.$refs.modal.open();
            if (this.isTreeInited) {
                this.initChecked();
            }
        },
        treeInited() {
            this.isTreeInited = true;
            this.initChecked();
        },
        initChecked() {
            Store.getConfig().then(config => {
                var authResources = config.authResources || [];
                this.$refs.resources.clearChecked();
                this.$refs.resources.checkNodes(
                    authResources.map(item => item.id)
                );
            });
        },
        save() {
            Store.getConfig().then(config => {
                config.authResources = this.resources.map(item => ({
                    id: item.id
                }));
                Store.setConfig(config).then(res => {
                    $tip("保存成功", "success");
                    this.$emit("refresh");
                    this.$refs.modal.close();
                });
            });
        },
        onChecked(resources) {
            this.resources = resources;
        },
        cancel() {
            this.$refs.modal.close();
        }
    }
};
</script>
<style lang="less">
@import "~@/style/variable.less";

.alarm-resource-panel {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 250px;
    bottom: 0px;
    background: #252526;
    box-sizing: border-box;
    border-right: 1px solid #707e8e;
}
.alarm-relation-panel {
    position: absolute;
    top: 0px;
    left: 250px;
    bottom: 0px;
    right: 0px;
}
</style>