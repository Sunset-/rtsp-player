<template>
    <div v-show="showShim" class="login-shim">
        <div class="login-shim-form">
            <label>管理密码：</label><xui-input v-model="pwd" type="password" placeholder="请输入管理密码"></xui-input>
            <div>
                <xui-button color="primary" @click="login" text="确定"></xui-button>
            </div>
        </div>
    </div>
</template>
<script>

import Store from "./store.js";

export default {
    data(){
        return {
            pwd : "",
            showShim : true
        }
    },
    methods : {
        login(){
            Store.getConfig().then(config=>{
                if(!config.adminPwd&&this.pwd=="admin123"||config.adminPwd==this.pwd){
                    this.showShim = false;
                }else{
                    $tip("管理密码错误","warn");
                }
            })
        },
        show(){
            this.pwd = "";
            this.showShim = true;
        }
    }
}
</script>
<style lang="less">
    .login-shim{
        position: absolute;
        top:0px;
        left:0px;
        right:0px;
        bottom:0px;
        z-index:10000;
        background:#222;
        .login-shim-form{
            margin: 100px auto;
            text-align: center;
            &>label{
                color:#FFF;
            }
            &>*{
                display: inline-block;
                vertical-align: middle;
            }
        }
    }
</style>