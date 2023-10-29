<template>
    <div v-loading="loading">
        <el-button class="button" type="primary" @click="workRecord(true)" circle>
            <span>
                <i class="el-icon-time"></i>
                上班
            </span>
        </el-button>

        <el-space></el-space>

        <el-button class="button" type="warning" @click="workRecord(false)" circle>
            下班
        </el-button>

    </div>
</template>

<script>
import {onMounted, ref} from 'vue'
import {authApi} from '@/api'
import {ElMessage} from 'element-plus'

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Record',
    props: {},
    components: {},
    setup() {
        const loading = ref(false)
        const workRecord = (work) => {
            loading.value = true
            const data = {
                type: work ? '01' : '02'
            }
            authApi.workRecord(data).then(() => {
                loading.value = false
                ElMessage.success(work ? '上班打卡成功' : '下班打卡成功')
            }).catch(() => {
                loading.value = false
                ElMessage.error(work ? '上班打卡失败' : '下班打卡失败')
            }).final(() => {
                loading.value = false
            })
        }

        onMounted(() => {

        })
        return {
            workRecord,
            loading
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
    margin: 0 0 0;
}

.button {
    min-height: 120px;
    min-width: 120px;
}

.container {
    display: flex;
    flex-direction: column;
}
</style>
