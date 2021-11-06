<template>
  <div class="detail-background">
    <div class="word-detail-body ">
        <div class="word-detail-title">
			<!-- <h2></h2> -->
			<h2>{{word.word}}</h2>
			<NSwitch v-model:value="nextAutoPlay">
				<template #checked>自动播放</template>
				<template #unchecked>静音</template>
			</NSwitch>
        </div>
        
        <div class="word-detail-image-body">
            <div class="word-detail-image-box" v-for="item in word.values" :key="item">
                <img class="word-detail-image" :class="{failed:item.status == 1 ,success:item.status == 2}" :src="'/image/'+item.name+'.jpg'" @click="clickWord(item)"/>
            </div>
        </div>

		<div class="word-detail-control-body">
			<NButton class="word-detail-control-button" @click="playAudio(word.name)">Play</NButton>
		</div>
        
    </div>
  </div>
</template>

<script>
import {ref ,onMounted} from "vue"
import { NSwitch } from 'naive-ui';
export default {
	name: 'WordDetail',
	props: {
		msg: String,
	},
	components:{
		NSwitch
	},
	setup(){
		let word = ref({})
		let wordIndex = 0;
		let nextAutoPlay = ref(false)
		let audioPlay = new Audio()
		const wordList=[{name:1,word:'あき'},{name:2,word:'あめ'},{name:3,word:'いぬ'},
						{name:4,word:'あり'},{name:5,word:'いか'},{name:6,word:'いちご'},
						{name:7,word:'うま'},{name:8,word:'うさぎ'},{name:9,word:'うちわ'},
						{name:10,word:'えほん'},{name:11,word:'えび'},{name:12,word:'えき'}];
		onMounted(()=>{
			wordIndex = Math.floor(Math.random() * (wordList.length - 1))+1
			updateWord()
		});
		const randomSort= ()=>{
			return Math.random() > 0.5 ? -1 : 1;
		};
		const clickWord = (item) => {
			if(word.value.name != item.name) {
				item.status = 1
				playAudio('error').then(()=>{
					item.status = 0
				}).catch(()=>{
					item.status = 0
				})
				return
			}
			item.status = 2
			setTimeout(()=>{
				onNext()
				item.status = 0
			},500)
		};
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
			if (!newWord.values) {
				newWord.values = []
				newWord.values.push({name:newWord.name,status:0})
				while (newWord.values.length < 4) {
					let num = Math.floor(Math.random() * (wordList.length - 1))+1
					if (num != newWord.name && !newWord.values.some(e => e.name === num)) {
						newWord.values.push({name:num,status:0})
					}
				}
				newWord.values.sort(randomSort)
			}
			word.value = newWord
			if (nextAutoPlay.value) {
				playAudio(word.value.name)
			}
		};
		const playAudio = (name) =>{
			return new Promise((resolve,reject) =>{
				if (!name || name == "") {
					reject()
					return
				}
				let url = '/mp3/'+name+'.mp3'
				if (audioPlay) {
					if (!audioPlay.paused) {
						audioPlay.pause()
						audioPlay = null
					}
				}
				audioPlay = new Audio(url)
				audioPlay.addEventListener('ended',()=>{
					console.log('播放完毕')
					resolve()
				})
				audioPlay.addEventListener('pause',() =>{
					console.log('取消播放')
					resolve()
				})
				audioPlay.play()
			})
		};
		return {
			wordIndex,
			wordList,
			word,
			clickWord,
			playAudio,
			nextAutoPlay,
			updateWord
		};
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
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
.detail-background {
    height: 100%;
}
.word-detail-body {
    margin: auto;
    display: flex;
    flex-direction: column;
    max-width: 500px;
    min-height: 100%;
    padding:0px 5px;
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
    position:relative;
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
/* .word-detail-failed {
	border: solid 3px red;
}

.word-detail-success {
	border: solid 3px green;
} */
</style>
