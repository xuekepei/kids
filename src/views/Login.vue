<template>
    <n-form class="login-form-body" ref="formRef" :model="form" :rules="rules">
        <n-form-item>
            <n-input v-model:value="form.username" placeholder="用户名"/>
        </n-form-item>
        <n-form-item>
            <n-input v-model:value="form.password" type="password" placeholder="密码"/>
        </n-form-item>

        <div style="display: flex; justify-content: center; margin-top: 20px">
            <n-button attr-type="button" type="primary" @click="login">登录</n-button>
        </div>

    </n-form>
</template>

<script>
import { ref } from 'vue'
import { NForm, NFormItem, NInput, useMessage } from 'naive-ui'
import { authApi } from '@/api'
import router from '../router'
import store from '@/store'

export default {
    components: {
        NForm,
        NFormItem,
        NInput,
    },
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Login',
    setup() {
        const formRef = ref(null)
        const form = ref({
            username: '',
            password: '',
        })
        const message = useMessage()
        window.$message = message
        const login = (e) => {
            e.preventDefault()
            if (!form.value.username) {
                message.error('请输入用户名')
                return
            }
            if (!form.value.password) {
                message.error('请输入密码')
                return
            }

            authApi.login(form.value).then(res => {
                const jwt = res.data.token
                store.dispatch('setToken', jwt)

                message.success('登录成功')
                router.replace({ name: 'Admin' })
            })
        }
        return {
            formRef,
            form,
            rules: {
                username: {
                    required: true, message: '请输入用户名', trigger: 'blur'
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
    padding: 0 5px;
    justify-content: center;
    justify-items: center;
}
</style>