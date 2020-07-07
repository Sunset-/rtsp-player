<template>
    <xui-modal ref="modal" title="系统配置" :maskClose="false" width="800">
        <div style="width:800px;height:500px;background:#FFF;position:relative;">
            <login-shim ref="shim"></login-shim>
            <xui-form ref="form" :options="formOptions" @submit="saveConfig" @cancel="cancel"></xui-form>
        </div>
    </xui-modal>
</template>
<script>
import Store from "./store.js";
import LoginShim from "./loginshim.vue";

export default {
    components: {
        LoginShim
    },
    data() {
        return {
            formOptions: {
                cols: 2,
                fields: [
                    {
                        group: "管理员",
                        label: "管理密码",
                        name: "adminPwd",
                        widget: "input",
                        placeholder: "请输入管理密码",
                        validate: {
                            required: true
                        }
                    },
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
                        label: "拉流方式",
                        name: "streamType",
                        widget: "input",
                        default: "rtmp",
                        placeholder: "请输入拉流方式",
                        validate: {
                            required: true
                        }
                    },
                    {
                        label: "流有效期",
                        name: "streamTimeout",
                        widget: "input",
                        default: "240",
                        placeholder: "请输入流有效期（秒）",
                        validate: {
                            required: true
                        }
                    },
                    {
                        group: "报警平台对接",
                        label: "报警库IP",
                        name: "alarmDbIp",
                        widget: "input",
                        placeholder: "请输入报警库IP",
                        validate: {
                            required: false,
                            ip: true
                        }
                    },
                    {
                        label: "报警库端口",
                        name: "alarmDbPort",
                        widget: "input",
                        placeholder: "请输入报警库端口",
                        validate: {
                            required: false,
                            port: true
                        }
                    },
                    {
                        label: "库名称",
                        name: "alarmDbName",
                        widget: "input",
                        placeholder: "请输入库名称",
                        validate: {
                            required: false
                        }
                    },
                    {
                        label: "用户名",
                        name: "alarmDbUser",
                        widget: "input",
                        placeholder: "请输入用户名",
                        validate: {
                            required: false
                        }
                    },
                    {
                        label: "密码",
                        name: "alarmDbPassword",
                        widget: "input",
                        placeholder: "请输入密码",
                        validate: {
                            required: false
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
            this.$refs.shim.show();
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