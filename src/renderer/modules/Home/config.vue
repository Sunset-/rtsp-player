<template>
    <xui-modal ref="modal" title="系统配置" :maskClose="false" width="800">
        <div style="width:800px;height:400px;background:#FFF;">
            <xui-form ref="form" :options="formOptions" @submit="saveConfig" @cancel="cancel"></xui-form>
        </div>
    </xui-modal>
</template>
<script>
import Store from "./store.js";

export default {
    data() {
        return {
            formOptions: {
                cols: 2,
                fields: [
                    {
                        group: "海康平台对接",
                        label: "平台地址",
                        name: "mediaPlatformAddress",
                        widget: "input",
                        monopolize: true,
                        style: "width:620px;",
                        placeholder: "请输入海康平台地址，例172.16.100.100:443",
                        validate: {
                            required: true,
                            ipport: true
                        }
                    },
                    {
                        label: "海康认证AK",
                        name: "hikAK",
                        widget: "input",
                        placeholder: "请输入海康认证AK",
                        validate: {
                            required: true
                        }
                    },
                    {
                        label: "海康认证SK",
                        name: "hikSK",
                        widget: "input",
                        placeholder: "请输入海康认证SK",
                        validate: {
                            required: true
                        }
                    },
                    {
                        group: "报警平台对接",
                        label: "报警库DSN",
                        name: "alarmDbDsn",
                        widget: "input",
                        monopolize: true,
                        style: "width:620px;",
                        placeholder:
                            "例如：sqlserver://sa:pwd123456@172.16.100.100:1433/instance?database=mydb",
                        validate: {
                            required: true
                        }
                    }
                ]
            },
            persons: ["张三", "李四", "王五"],
            inputOptions: {
                append: "添加",
                clearable: false,
                appendClick: () => {
                    this.addPerson();
                }
            },
            personName: "",
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
            Store.getConfig().then(config => {
                this.$refs.modal.open();
                this.$refs.form.reset(config);
            });
        },
        saveConfig(config) {
            Store.setConfig(config).then(res => {
                $tip("保存成功", "success");
                this.$emit("refresh");
                this.$refs.modal.close();
            });
        },
        cancel() {
            this.$refs.modal.close();
        }
    }
};
</script>
<style lang="less">
@import "~@/style/variable.less";

.xui-form {
    .group-title {
        font-weight: bold;
    }
}
</style>