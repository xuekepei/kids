<template>
    <n-spin v-if="loading">
        <template #description>你不知道你有多幸运</template>
    </n-spin>
    <div style="padding: 0 20px;" v-else>
        <n-space vertical align="end">
            <!--            <n-button @click="newWord">新增</n-button>-->
        </n-space>
        <n-list>
            <n-list-item v-for="(item, index) in itemList" v-bind:key="index">
                <n-space justify="space-between">
                    <n-space vertical>
                        {{ index + 1 }}
                    </n-space>
                    <n-space vertical class="translate-title" align="start">
                        <h4>{{ item.sentence }}</h4>
                        <h5>{{ item.translate }}</h5>
                    </n-space>
                    <n-space vertical align="end">
                        <!--                        <n-button type="tertiary" @click="editWord(item)">-->
                        <!--                            编辑-->
                        <!--                        </n-button>-->
                    </n-space>
                </n-space>
            </n-list-item>
        </n-list>
    </div>

    <WordSearch ref="wordSearchRef"></WordSearch>
</template>

<script>
import { ref, onMounted } from 'vue'
import { NSpin, NList, NListItem } from 'naive-ui'
import { authApi } from '@/api'
import WordSearch from '@/components/WordSearch'

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    props: {
        msg: String,
    },
    components: {
        NSpin,
        NList,
        NListItem,
        WordSearch
    },
    setup() {
        let audioPlay = new Audio()
        let itemList = ref([])
        let loading = ref(false)
        let autoPlay = ref(false)
        let autoPlayTimer = null
        let autoPlayNum = ref(3)
        const wordSearchRef = ref()
        onMounted(() => {
            loading.value = true
            authApi.sentences().then((res) => {
                loading.value = false
                if (res.status === 200) {
                    replaceAnnotations(res.data)
                }
            }).catch(() => {
                loading.value = false
            })
        })
        const replaceAnnotations = (list) => {
            list.forEach(item => {
                item.annotations.forEach(annotation => {
                    item.sentence = item.sentence.replace(annotation.word, annotation.word + '（' + annotation.annotation + '）')
                })
            })
            itemList.value = list
        }
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
        }
    }
}
</script>

<style scoped>
h3 {
    margin: 0;
}

.translate-title {
    padding: 0;
    flex-direction: row;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
}
</style>