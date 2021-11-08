<template>
	<n-spin v-if="loading">
      	<template #description>你不知道你有多幸运</template>
    </n-spin>
    <div v-if="!loading" @click="onNext">
       
        <div class="learn-word-card">
            <n-card :title="word.word">
                <template #cover>
                    <img :src="word.image_url" />
                </template>
                <template #footer>
                    <div class="learn-word-title">
                        <h3>{{word.hiragana}}</h3>
                    </div>
                </template>
                 
            </n-card>
        </div>

		<div class="leart-word-control-body">
			<NButton class="leart-word-control-button" @click="playAudio(word.audio_url)">Play</NButton>
		</div>
        
    </div>
</template>

<script>
import {ref ,onMounted} from "vue"
import { NSpin, NCard } from 'naive-ui';
import {authApi} from '@/api'
export default {
	name: 'Learn',
	props: {
		msg: String,
	},
	components:{
		NSpin,
        NCard
	},
	setup(){
		let word = ref({})
		let wordIndex = 0;
		let audioPlay = new Audio()
		var wordList=[];
		let loading = ref(false)
		onMounted(()=>{
			loading.value = true
			authApi.allWords().then((res)=>{
				loading.value = false
				if (res.status == 200) {
					wordList = res.data
					wordIndex = Math.floor(Math.random() * (wordList.length - 1))+1
					updateWord()
				}
			}).catch(()=>{
				loading.value = false
			})
		});
		const onNext = ()=> {
			
			if (wordIndex<wordList.length-1) {
				wordIndex+=1
			} else {
				wordIndex = 0
			}
			updateWord()
		
		};
		const updateWord =() =>{
			let newWord = wordList[wordIndex]
			word.value = newWord
			playAudio(word.value.audio_url)
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
			wordIndex,
			wordList,
			word,
			onNext,
			playAudio,
			updateWord,
			loading
		};
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
