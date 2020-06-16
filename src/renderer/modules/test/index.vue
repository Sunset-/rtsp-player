<template>
    <div>
        test
        <xui-button color="primary" @click="go">跳转</xui-button>
    </div>
</template>
<script>
export default {
    methods: {
        go() {
            this.$router.push("/")
        }
    }
};
</script>