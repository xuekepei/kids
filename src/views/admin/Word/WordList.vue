<template>
    <n-spin v-if="loading">
        <template #description>你不知道你有多幸运</template>
    </n-spin>
    <div style="padding: 0 20px;" v-else>
        <n-space vertical align="end">
            <n-button @click="newWord">新增</n-button>
        </n-space>
        <n-data-table
            :columns="columns"
            :data="itemList"
            :pagination="true"
            :bordered="false"
        ></n-data-table>
    </div>

    <WordSearch ref="wordSearchRef"></WordSearch>
</template>

<script>
import {onMounted, ref} from 'vue'
import {NDataTable, NImage, NList, NListItem, NSpin} from 'naive-ui'
import {authApi} from '@/api'
import WordSearch from '@/components/WordSearch'

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Manage',
    props: {
        msg: String,
    },
    components: {
        NSpin,
        NList,
        NListItem,
        NImage,
        WordSearch,
        NDataTable
    },
    setup() {
        let audioPlay = new Audio()
        let itemList = ref([])
        let loading = ref(false)
        let autoPlay = ref(false)
        let autoPlayTimer = null
        let autoPlayNum = ref(3)
        const wordSearchRef = ref()
        const columns = ref([{
                title: 'No',
                key: 'id'
            }, {
                title: '图片',
                key: 'image_url'
            }, {
                title: 'Word',
                key: 'word'
            }]
        )
        onMounted(() => {
            loading.value = true
            authApi.allWords().then((res) => {
                loading.value = false
                if (res.status === 200) {
                    itemList.value = res.data
                }
            }).catch(() => {
                loading.value = false
            })
        })
        const playAudio = (url) => {
            return new Promise((resolve, reject) => {
                if (!url || url === '') {
                    reject()
                    return
                }
                if (audioPlay) {
                    if (!audioPlay.paused) {
                        audioPlay.pause()
                        audioPlay = null
                    }
                }
                audioPlay = new Audio(url)
                audioPlay.addEventListener('ended', () => {
                    resolve()
                })
                audioPlay.addEventListener('pause', () => {
                    resolve()
                })
                audioPlay.play()
            })
        }
        const newWord = () => {
            wordSearchRef.value.show()
        }
        const editWord = (item) => {
            wordSearchRef.value.show(item)
        }

        return {
            itemList,
            playAudio,
            loading,
            autoPlay,
            autoPlayTimer,
            autoPlayNum,
            newWord,
            editWord,
            wordSearchRef,
            columns
        }
    }
}
</script>

<style scoped>
h3 {
    margin: 0px 0 0;
}

.learn-word-title {
    padding: 0px 0px;
    flex-direction: row;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
}

.learn-word-card {
    padding: 30px;
}

.learn-word-control-body {
    margin-top: 30px;
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.learn-word-control-button {
    margin-left: 20px;
    width: 70px;
    height: 40px;
}
</style>