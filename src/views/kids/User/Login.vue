<template>
    <n-form class="login-form-body" ref="formRef" :model="formValue" :rules="rules">
        <n-form-item>
            <n-input v-model:value="formValue.username" placeholder="用户名" />
        </n-form-item>
        <n-form-item>
            <n-input v-model:value="formValue.password" type="password" placeholder="密码" />
        </n-form-item>
        <n-form-item>
            <n-button attr-type="button" type="primary" @click="login">登录</n-button>
        </n-form-item>
    </n-form>
</template>

<script>
import { ref } from 'vue'
import { NForm, NFormItem, NInput, useMessage } from 'naive-ui'
import { authApi } from '@/api'
import router from '../../../router'
import store from '@/store'

export default {
    components: {
        NForm,
        NFormItem,
        NInput,
    },
    name: "Login",
    setup() {
        const formRef = ref(null)
        const formValue = ref({
            username: '',
            password: '',
        })
        const message = useMessage()
        window.$message = message
        const login = (e) => {
           e.preventDefault()
            if (!formValue.value.username) {
                message.error('请输入用户名')
                return
            }
            if (!formValue.value.password) {
                message.error('请输入密码')
                return
            }

            authApi.login(formValue.value).then(res => {
                const jwt = res.data.token
                store.dispatch('setToken', jwt)
                localStorage.setItem('token', jwt)
                message.success('登录成功')
                router.replace({
                    path: "/add",
                })
            })



        }
        return {
            formRef,
            formValue,
            rules: {
                username: {
                    required: true, message: '请输入用户名', trigger: "blur"
                },
                password: {
                    required: true, message: '请输入密码'
                },
            },
            login,
        }
    }
}
</script>

<style scoped>
.login-form-body {
    margin: auto;
    display: flex;
    flex-direction: column;
    max-width: 500px;
    min-height: 100%;
    padding: 0px 5px;
    justify-content: center;
    justify-items: center;
}
</style>