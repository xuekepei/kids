<template>
    <n-spin v-if="loading">
        <template #description>你不知道你有多幸运</template>
    </n-spin>
    <n-list v-else>
        <n-list-item v-for="word in wordList">
            <n-space justify="space-between">
                <n-image width="100" :src="word.image_url" preview-disabled @click="playAudio(word.audio_url)"/>
                <n-space vertical class="learn-word-title" align="start">
                    <h3>{{ word.word }}</h3>
                    <h4>{{ word.hiragana }}</h4>
                </n-space>
                <n-space vertical align="end">
                    <h3>编辑</h3>
                </n-space>
            </n-space>
        </n-list-item>
    </n-list>
</template>

<script>
import {ref, onMounted} from "vue"
import {NSpin, NCard, NSwitch, NList, NListItem, NImage} from 'naive-ui';
import {authApi} from '@/api'

export default {
    name: 'Manage',
    props: {
        msg: String,
    },
    components: {
        NSpin,
        NCard,
        NSwitch,
        NList,
        NListItem,
        NImage
    },
    setup() {
        let wordIndex = 0;
        let audioPlay = new Audio()
        let wordList = ref([]);
        let loading = ref(false)
        let autoPlay = ref(false);
        let autoPlayTimer = null;
        let autoPlayNum = ref(3);
        onMounted(() => {
            loading.value = true
            authApi.allWords().then((res) => {
                loading.value = false
                if (res.status == 200) {
                    wordList.value = res.data
                    wordIndex = Math.floor(Math.random() * (wordList.value.length - 1)) + 1
                    updateWord()
                }
            }).catch(() => {
                loading.value = false
            })
        });
        const onNext = (auto) => {
            if (!auto) {
                if (autoPlay.value) {
                    return
                }
            }

            if (wordIndex < wordList.value.length - 1) {
                wordIndex += 1
            } else {
                wordIndex = 0
            }
            updateWord()

        };
        const updateWord = () => {
            let newWord = wordList.value[wordIndex]
        };
        const playAudio = (url) => {
            return new Promise((resolve, reject) => {
                if (!url || url == "") {
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
        };
        const autoPlayAction = () => {
            autoPlay.value = !autoPlay.value
            if (autoPlay.value) {
                startNextWordTimer()
            } else {
                stopNextWordTimer()
            }
        };
        const startNextWordTimer = () => {
            autoPlayNum.value = 3
            autoPlayTimer = setInterval(() => {
                autoPlayNum.value -= 1
                if (autoPlayNum.value == 0) {
                    stopNextWordTimer()
                    onNext(true)
                }
            }, 1000)
        };
        const stopNextWordTimer = () => {
            clearInterval(autoPlayTimer)
            autoPlayTimer = null
            // autoPlayNum.value = 3
        };
        return {
            wordIndex,
            wordList,
            onNext,
            playAudio,
            updateWord,
            loading,
            autoPlay,
            autoPlayAction,
            autoPlayTimer,
            autoPlayNum,
            startNextWordTimer,
            stopNextWordTimer
        };
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