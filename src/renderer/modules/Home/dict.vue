<template>
    <xui-modal ref="modal" title="字典维护" :maskClose="false" width="800">
        <div style="width:800px;height:400px;background:#FFF;">
            <xui-scroll style="height:350px;">
                <div style="padding:20px;">
                    <label class="dict-label">人员名称：</label>
                    <div style="display:inline-block;width:500px;vertical-align:top;">
                        <div class="dict-item" v-for="(item,index) in persons" :key="item">
                            <span>{{item}}</span>
                            <i class="xui-icon xui-icon-close" @click="removePerson(index)"></i>
                        </div>
                        <div style="padding:20px 0px;">
                            <xui-input :options="inputOptions" v-model="personName" placeholder="请输入人员名称" v-on:keydown.enter="addPerson()"></xui-input>
                        </div>
                    </div>
                </div>
            </xui-scroll>
            <div style="text-align:center;padding:10px 0px;border-top: 1px solid #ccc;">
                <xui-toolbar :options="toolbarOptions"></xui-toolbar>
            </div>
        </div>
    </xui-modal>
</template>
<script>
import Store from "./store.js";

export default {
    data() {
        return {
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
            this.$refs.modal.open();
            Store.getDict().then(dict => {
                this.persons = dict["DICT_PERSON"] || [];
            });
        },
        addPerson() {
            var n = this.personName.trim();
            if (!n) {
                return;
            }
            if (this.persons.filter(item => item == n).length > 0) {
                $tip("已存在", "info");
                return;
            }
            this.persons.push(n);
            this.personName = "";
        },
        removePerson(index) {
            this.persons.splice(index, 1);
        },
        save() {
            Store.getDict().then(dict => {
                dict["DICT_PERSON"] = this.persons || [];
                Store.setDict(dict).then(res => {
                    $tip("保存成功", "success");
                    this.$emit("refresh");
                    this.$refs.modal.close();
                });
            });
        }
    }
};
</script>
<style lang="less">
@import "~@/style/variable.less";

.dict-label {
    display: inline-block;
    width: 100px;
    vertical-align: top;
    padding: 5px;
    text-align: right;
    font-size: 16px;
}

.dict-item {
    border: 1px solid lighten(@color-border, 30%);
    padding: 0px;
    display: inline-block;
    vertical-align: middle;
    border-radius: 2px;
    font-size: 0px;
    margin: 5px 10px 5px 0px;
    i {
        font-size: 12px;
        cursor: pointer;
        padding: 5px 8px;
        &:hover {
            color: @color-primary;
        }
    }
    & > span {
        display: inline-block;
        padding: 5px 10px 5px 10px;
        border-right: 1px solid lighten(@color-border, 30%);
        font-size: 14px;
    }
}
</style>