<template>
    <div>
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
        <div class="home">
            <el-divider></el-divider>
            <h3>打卡记录</h3>
            <el-space></el-space>
            <span>总时长：{{totalTime}}</span>
            <el-table :data="tableData" style="width: 100%" border>
                <el-table-column prop="date" label="日期" width="160"></el-table-column>
                <el-table-column label="上班时间">
                    <template #default="scope">
                        <span v-if="scope.row.list.length > 0">{{formatDate(scope.row.list[0].datetime)}}</span>
                        <span v-else>未打卡</span>
                    </template>
                </el-table-column>
                <el-table-column label="下班时间">
                    <template #default="scope">
                        <span v-if="scope.row.list.length > 1">{{formatDate(scope.row.list[1].datetime)}}</span>
                        <span v-else>未打卡</span>
                    </template>
                </el-table-column>
                <el-table-column label="时长">
                    <template #default="scope">
                        <span v-if="scope.row.list.length > 1">{{calculatingTime(scope.row.list)}}</span>
                        <span v-else>未打卡</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>

</template>

<script>
import {onMounted, ref, reactive, computed} from 'vue'
import {authApi} from '@/api'
import {ElMessage} from 'element-plus'
import moment from 'moment'

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Record',
    props: {},
    components: {},
    setup() {
        const loading = ref(false)
        const filter = reactive({
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
        })
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

        const tableData = ref([])
        const getRecordList = () => {

            authApi.getRecordList(filter).then(res => {
                tableData.value = res.data.records
            })
        }

        const formatDate = (date) => {
            return moment(date).format('hh:mm')
        }

        const calculatingTime = (list) => {
            const start = moment(list[0].datetime)
            const end = moment(list[1].datetime)
            // HH:mm
            return end.diff(start, 'hours') + '小时' + end.diff(start, 'minutes') % 60 + '分钟'
        }
        const totalTime = computed(() => {
            let total = 0
            debugger
            console.log(tableData.value)
            if (tableData.value == null) return total.toFixed(2)
            tableData.value.forEach(item => {
                debugger
                if (item.list.length > 1) {
                    const start = moment(item.list[0].datetime)
                    const end = moment(item.list[1].datetime)
                    total += end.diff(start, 'minutes')
                }
            })
            return (total / 60).toFixed(0) + '小时' + total % 60 + '分钟'
        })

        onMounted(() => {
            getRecordList()
        })
        return {
            workRecord,
            loading,
            tableData,
            formatDate,
            calculatingTime,
            totalTime
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
