<template>
<div class="index-container">
    <div class="dialog-container">
        <img src="../assets/bind-failure.png" class="success-image" />
        <p class="success-text">绑定失败！</p>
        <div class="bind-btn" @click="$router.push('/')">重新绑定</div>
    </div>
</div>
</template>

<script>
export default {
    name: "index",
    data() {
        return {

        }
    },
    created() {

    },
    methods: {

    }

};
</script>

<style lang="scss" scoped>
.index-container {
    width: 750px;
    height: 100vh;
    background-image: url("../assets/bg.png");
    background-clip: border-box;
    background-size: 100% 100%;
    position: relative;
    & .dialog-container {
        width: 620px;
        height: 933px;
        position: absolute;
        top: 300px;
        left: 50%;
        transform: translateX(-50%);
        background-image: url("../assets/dislog-bg.png");
        background-size: 100% 100%;
        box-sizing: border-box;
        padding: 192px 46px 35px;
        display: flex;
        flex-flow: column nowrap;
        justify-content: flex-start;
        align-items: center;
        .success-image {
            width: 320px;
            height: 338px;
        }
        .success-text {
            width: 100%;
            font-size: 32px;
            font-weight: 400;
            text-align: center;
            color: #333333;
            line-height: 125px;
            margin: 0;
        }
        .bind-btn {
            width: 385px;
            height: 80px;
            background: linear-gradient(97deg,#5fd3fd 8%, #0d7eff 98%);
            text-align: center;
            line-height: 80px;
            font-size: 30px;
            font-weight: 400;
            color: #ffffff;
            margin-top: 9px;
        }
    }
}
</style>
