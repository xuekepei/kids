<template>
    <div class="add-background">
        <div class="add-body">
            <n-space vertical>
                <n-steps :current="current" :status="currentStatus">
                    <n-step title="查询" />
                    <n-step title="添加" />
                </n-steps>
            </n-space>
            <div class="add-content-body">
                <div class="add-content-body-search" v-if="current === 1">
                    <n-space vertical>
                        <n-input v-model:value="wordKey" placeholder="输入单词"></n-input>
                    </n-space>

                    <n-button class="add-content-body-search-button" :loading="requestLoading" @click="search">查询</n-button>
                    
                </div>

                <div class="add-content-body-add" v-if="current===2">
                    <n-grid :x-gap="12" :y-gap="8" :cols="2">
                        <n-grid-item v-for="item in searchResult" :key="item" @click="select(item)">
                            <n-card class="add-content-body-add-card" :class="{selected:(selectWord != null && selectWord.word == item.word)}" :title="item.word">
                                {{item.katakana}}
                            </n-card>
                        </n-grid-item>  
                    </n-grid>

                    <Cropper :aspectRatio="16 / 16" @crop="getCover" />

                    <n-space class="add-content-body-search-button" justify="space-between">
                        <n-button @click="current = 1">上一步</n-button>
                        <n-button :loading="requestLoading" @click="add">添加</n-button>
                        <div></div>
                    </n-space>

                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {ref, reactive} from "vue"
import { NInput, NSpace, NSteps, NStep, NButton, NGrid, NGridItem, NCard} from 'naive-ui';
import {authApi} from '@/api'
import Cropper from "@/components/Cropper.vue";

export default {
    components:{
        NInput,
        NSpace,
        NSteps,
        NStep,
        NButton,
        NGridItem,
        NGrid,
        NCard,
        Cropper
    },
    setup() {
        const currentRef = ref(1);
        const searchResult = ref([]);
        const wordKey = ref("");
        const selectWord = ref(null)
        var audioPlay = new Audio()
        const requestLoading = ref(false)

		const wordForm = reactive({
			word: "",
			hiragana: "",
			imageBase64: "",
			mp3Url: "",
		});

        const search = () =>{
            if (!wordKey.value) { 
                return
            }
            requestLoading.value = true
            authApi.search(wordKey.value).then((res)=>{
                requestLoading.value = false
                if (res.status === 200) {
                    searchResult.value = res.data
                    if (searchResult.value.length > 0) {
                        currentRef.value = 2
                    }
                }
                // console.log(res)
            }).catch(()=>{
				requestLoading.value = false
			})
        };
        const add = () =>{
			if (wordForm.imageBase64 == "" || wordForm.word == "") {
				return
			}
			requestLoading.value = true
            authApi.add("1",wordForm).then((res)=>{
                requestLoading.value = false
                if (res.status === 200) {
                    setTimeout(()=>{
						currentRef.value = 1
					},1000)  
                }
                // console.log(res)
            }).catch(()=>{
				requestLoading.value = false
			})
        };

        const select = (word) =>{
			if (selectWord.value && word.word != selectWord.value.word) {
				wordForm.imageBase64 = ""
			}

            selectWord.value = word
			wordForm.word = word.word
			wordForm.hiragana = word.katakana
			wordForm.mp3Url = word.audio_url
            playAudio(word.audio_url)
        };
        const playAudio = (url) =>{
			return new Promise((resolve,reject) =>{
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
				audioPlay.addEventListener('ended',()=>{
					resolve()
				})
				audioPlay.addEventListener('pause',() =>{
					resolve()
				})
				audioPlay.play()
			})
		};
        const getCover = (base64) => {
        // form.coverImage = base64;
			wordForm.imageBase64 = base64
            console.log(base64)
        };

        return {
            currentStatus : ref('process'),
            current:currentRef,
            searchResult,
            search,
            add,
            select,
            wordKey,
            selectWord,
            playAudio,
            requestLoading,
            getCover
        };
    },
}
</script>

<style scoped>
.add-background {
    height: 100%;
}
.add-body {
    margin: auto;
    display: flex;
    flex-direction: column;
    max-width: 500px;
    min-height: 100%;
    padding:10px 5px;
}
.add-content-body {
    margin: 10px 10px;
    justify-content: center;
    justify-items: center;
}

.add-content-body-search {
    justify-content: center;
    margin: 20px;
}

.add-content-body-search-button {
    margin-top: 20px;
}

.add-content-body-add {

}

.add-content-body-add-card {
    /* border: solid 1px white; */
}
.add-content-body-add-card.selected {
    border: solid 2px green;
}
</style>