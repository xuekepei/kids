<template>
    <n-spin v-if="loading">
        <template #description>你不知道你有多幸运</template>
    </n-spin>
    <div v-if="!loading">
        <div class="word-detail-title">
            <!-- <h2></h2> -->
            <h2>{{ word.word }}</h2>
            <h3>{{ word.hiragana }}</h3>
            <NSwitch v-model:value="nextAutoPlay">
                <template #checked>自动播放</template>
                <template #unchecked>静音</template>
            </NSwitch>
        </div>

        <div class="word-detail-image-body">
            <div class="word-detail-image-box" v-for="item in word.values" :key="item">
                <img class="word-detail-image" :class="{failed:item.status == 1 ,success:item.status == 2}"
                     :src="item.image_url" @click="clickWord(item)"/>
            </div>
        </div>

        <div class="word-detail-control-body">
            <NButton class="word-detail-control-button" @click="playAudio(word.audio_url)">Play</NButton>
        </div>

    </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { NSwitch, NSpin } from 'naive-ui'
import { authApi } from '@/api'

export default {
    name: 'WordDetail',
    props: {
        msg: String,
    },
    components: {
        NSwitch,
        NSpin
    },
    setup() {
        let word = ref({})
        let wordIndex = 0
        let nextAutoPlay = ref(false)
        let audioPlay = new Audio()
        var wordList = []
        let loading = ref(false)
        onMounted(() => {
            loading.value = true
            authApi.allWords().then((res) => {
                loading.value = false
                if (res.status === 200) {
                    // console.log(res.data)
                    wordList = res.data
                    wordIndex = Math.floor(Math.random() * (wordList.length - 1)) + 1
                    updateWord()
                }
            }).catch(() => {
                loading.value = false
            })
        })
        const randomSort = () => {
            return Math.random() > 0.5 ? -1 : 1
        }
        const clickWord = (item) => {
            if (word.value.id !== item.id) {
                item.status = 1
                playAudio('https://objectstorage.ap-tokyo-1.oraclecloud.com/n/nrdsxugarz32/b/bucket-20211103-1156/o/kids%2Fmp3%2Ferror.mp3').then(() => {
                    item.status = 0
                }).catch(() => {
                    item.status = 0
                })
                return
            }
            item.status = 2
            setTimeout(() => {
                onNext()
                item.status = 0
            }, 500)
        }
        const onNext = () => {

            if (wordIndex < wordList.length - 1) {
                wordIndex += 1
            } else {
                wordIndex = 0
            }
            updateWord()

        }
        const updateWord = () => {
            let newWord = wordList[wordIndex]
            if (!newWord.values) {
                newWord.values = []
                newWord.status = 0
                newWord.values.push(newWord)
                while (newWord.values.length < 4) {
                    let index = Math.floor(Math.random() * (wordList.length - 1)) + 1
                    let valueWord = wordList[index]
                    if (valueWord.id !== newWord.id && !newWord.values.some(e => e.id === valueWord.id)) {
                        valueWord.status = 0
                        newWord.values.push(valueWord)
                    }
                }
                newWord.values.sort(randomSort)
            }
            word.value = newWord
            if (nextAutoPlay.value) {
                playAudio(word.value.audio_url)
            }
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
        return {
            wordIndex,
            wordList,
            word,
            clickWord,
            playAudio,
            nextAutoPlay,
            updateWord,
            loading
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
    margin: 10px 0 0;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
}

.word-detail-title {
    flex-direction: row;
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
}

.audio-play {
    background: #42b983;
    width: 10px;
    height: 10px;
}

.word-detail-image-body {
    margin-top: 30px;
    display: grid;
    grid-template-columns:repeat(2, minmax(0, 1fr));
    grid-gap: 10px;
}

.word-detail-image-box {
    height: 0;
    padding-bottom: 100%;
    position: relative;
}

.word-detail-image {
    position: absolute;
    margin: auto;
    display: block;
    object-fit: contain;
    width: 100%;
    height: 100%;
    border: solid 3px white;
}

.word-detail-image.failed {
    border: solid 3px red;
}

.word-detail-image.success {
    border: solid 3px green;
}

.word-detail-control-body {
    margin-top: 30px;
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.word-detail-control-button {
    margin-left: 20px;
    width: 70px;
    height: 40px;
}
</style>
