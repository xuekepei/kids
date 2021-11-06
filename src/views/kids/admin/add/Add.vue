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

                    <n-button class="add-content-body-search-button" :loading="searchLoading" @click="search">查询</n-button>
                    
                </div>

                <div class="add-content-body-add" v-if="current===2">
                    <n-grid :x-gap="12" :y-gap="8" :cols="2">
                        <n-grid-item v-for="item in searchResult" :key="item" @click="select(item)">
                            <n-card class="add-content-body-add-card" :class="{selected:(selectWord != null && selectWord.word == item.word)}" :title="item.word">
                                {{item.katakana}}
                            </n-card>
                        </n-grid-item>  
                    </n-grid>

                    <n-space class="add-content-body-search-button" justify="space-between">
                        <n-button @click="current = 1">上一步</n-button>
                        <n-button @click="add">添加</n-button>
                        <div></div>
                    </n-space>

                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {ref} from "vue"
import { NInput, NSpace, NSteps, NStep, NButton, NGrid, NGridItem, NCard} from 'naive-ui';
import {authApi} from '@/api'

export default {
    components:{
        NInput,
        NSpace,
        NSteps,
        NStep,
        NButton,
        NGridItem,
        NGrid,
        NCard
    },
    setup() {
        const currentRef = ref(1);
        const searchResult = ref([]);
        const wordKey = ref("");
        const selectWord = ref(null)
        var audioPlay = new Audio()
        const searchLoading = ref(false)

        const search = () =>{
            if (!wordKey.value) { 
                return
            }
            searchLoading.value = true
            authApi.search(wordKey.value).then((res)=>{
                searchLoading.value = false
                if (res.status === 200) {
                    searchResult.value = res.data
                    if (searchResult.value.length > 0) {
                        currentRef.value = 2
                    }
                }
                console.log(res)
            })
        };
        const add = () =>{

        };

        const select = (word) =>{
            selectWord.value = word
            playAudio(selectWord.value.audio_url)
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
            searchLoading
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
    margin: 10px 0px;
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