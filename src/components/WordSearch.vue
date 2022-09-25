<template>
    <n-modal v-model:show="showModal" preset="dialog" :show-icon="false">
        <template #header>
            <n-space style="margin-top:20px" vertical>
                <n-steps :current="current" :status="currentStatus">
                    <n-step title="查询"/>
                    <n-step title="添加" v-if="!editMode"/>
                    <n-step title="编辑" v-else/>
                </n-steps>
            </n-space>
        </template>
        <div class="add-content-body">
            <div class="add-content-body-search" v-if="current === 1">
                <n-form ref="searchFormRef" :model="searchForm" :rules="searchFormRules">
                    <n-form-item label="单词" path="word">
                        <n-input v-model:value="searchForm.word" placeholder="输入单词"></n-input>
                    </n-form-item>
                </n-form>

                <n-button class="add-content-body-search-button" :loading="requestLoading" @click="searchAction">查询
                </n-button>

            </div>

            <div class="add-content-body-add" v-if="current===2">
                <n-form ref="uploadFormRef" :model="searchForm" :rules="uploadFormRules">
                    <n-form-item label="单词" path="word">
                        <n-grid :x-gap="12" :y-gap="8" :cols="2">
                            <n-grid-item v-for="item in searchResult" :key="item" @click="select(item)">
                                <n-card class="add-content-body-add-card"
                                        :class="{selected:(searchForm.word === item.word)}"
                                        :title="item.word">
                                    {{ item.katakana }}
                                </n-card>
                            </n-grid-item>
                        </n-grid>
                    </n-form-item>
                    <n-form-item>
                        <img class="word-edit-image" :src="searchForm.imageBase64" :alt="searchForm.word"
                             v-if="searchForm.imageBase64">
                        <Cropper :aspectRatio="16 / 16" @crop="getCover"/>
                    </n-form-item>
                    <n-form-item>
                        <n-select v-model:value="selectLetter" :options="letterOptions" placeholder="选择单词分类"/>
                    </n-form-item>
                </n-form>

                <n-space class="add-content-body-search-button" justify="space-between">
                    <n-button @click="current = 1">上一步</n-button>

                    <n-button :loading="requestLoading" v-if="!editMode" @click="addAction">添加</n-button>
                    <n-button :loading="requestLoading" v-else @click="editAction">添加</n-button>
                    <!-- <div></div> -->
                </n-space>

            </div>
        </div>
    </n-modal>
</template>

<script>
import { ref, onMounted } from 'vue'
import { NInput, NSteps, NStep, NGrid, NGridItem, NCard, NSelect, NModal, NForm, NFormItem, useMessage } from 'naive-ui'
import { authApi } from '@/api'
import Cropper from '@/components/Cropper'

export default {
    name: 'VueSearch',
    props: {},
    components: {
        NInput,
        NSteps,
        NStep,
        NGridItem,
        NGrid,
        NCard,
        NModal,
        NSelect,
        NForm,
        NFormItem,
        Cropper
    },
    setup() {
        const showModal = ref(false)
        const currentRef = ref(1)
        const searchResult = ref([])
        var audioPlay = new Audio()
        const requestLoading = ref(false)
        const selectLetter = ref(null)
        const letterOptions = ref([])
        const message = useMessage()
        const editMode = ref(false)
        const searchFormRef = ref(null)
        const searchForm = ref({
            word: '',
            hiragana: '',
            imageBase64: '',
            audioUrl: '',
        })
        const searchFormRules = {
            word: {
                required: true,
                message: '请输入单词',
                trigger: 'blur'
            }
        }
        const uploadFormRef = ref(null)
        const uploadFormRules = {
            word: {
                required: true,
                message: '请输入单词',
                trigger: 'blur'
            }
        }
        onMounted(() => {
            authApi.letters().then((res) => {
                if (res.status === 200) {
                    const options = []
                    res.data.forEach((item) => {
                        options.push({
                            label: item.hiragana,
                            value: item.letter_id.toString()
                        })
                    })
                    letterOptions.value = options
                }
            })
        })

        const newForm = () => {
            searchForm.value = {
                word: null
            }
        }
        const editForm = (item) => {
            searchForm.value = {
                id: item.id,
                word: item.word,
                hiragana: item.hiragana,
                audio_url: item.audio_url,
                imageBase64: item.image_url,
                letter_id: item.letter_id,

            }
        }

        const searchAction = (e) => {
            e.preventDefault()
            searchFormRef.value.validate((errors) => {
                if (errors) {
                    return
                }
                search()
            })
        }
        const search = () => {
            requestLoading.value = true
            authApi.search(searchForm.value.word).then((res) => {
                requestLoading.value = false
                searchResult.value = res.data
                if (searchResult.value.length > 0) {
                    currentRef.value = 2
                }
            }).catch(() => {
                requestLoading.value = false
            })
        }
        const addAction = () => {
            if (!selectLetter.value) {
                message.error('请选择字母')
                return
            }

            requestLoading.value = true
            authApi.add(selectLetter.value, searchForm.value).then((res) => {
                requestLoading.value = false
                if (res.status === 200) {
                    message.success('添加成功')
                    newForm()
                    setTimeout(() => {
                        showModal.value = false
                        currentRef.value = 1
                    }, 2000)
                }
                // console.log(res)
            }).catch(() => {
                message.error('添加失败,请稍后重试')
                requestLoading.value = false
            })
        }
        const editAction = () => {
            if (!selectLetter.value) {
                message.error('请选择字母')
                return
            }

            requestLoading.value = true
            authApi.add(selectLetter.value, searchForm.value).then((res) => {
                requestLoading.value = false
                if (res.status === 200) {
                    message.success('添加成功')
                    newForm()
                    setTimeout(() => {
                        showModal.value = false
                        currentRef.value = 1
                    }, 2000)
                }
                // console.log(res)
            }).catch(() => {
                message.error('添加失败,请稍后重试')
                requestLoading.value = false
            })
        }

        const select = (word) => {
            console.log(selectLetter.value)
            if (word.word !== searchForm.value.word) {
                searchForm.value.imageBase64 = ''
            }

            searchForm.value.word = word.word
            searchForm.value.hiragana = word.katakana
            searchForm.value.audioUrl = word.audio_url
            playAudio(word.audio_url)
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
        const getCover = (base64) => {
            searchForm.value.imageBase64 = base64
            console.log(base64)
        }

        const show = (item) => {
            if (item) {
                editMode.value = true
                searchResult.value = []
                editForm(item)
                search()
            } else {
                editMode.value = false
                newForm()
                currentRef.value = 1
            }

            showModal.value = true
        }

        return {
            currentStatus: ref('process'),
            current: currentRef,
            searchForm,
            searchFormRef,
            searchFormRules,
            uploadFormRef,
            uploadFormRules,
            searchResult,
            searchAction,
            addAction,
            editAction,
            editMode,
            select,
            playAudio,
            requestLoading,
            getCover,
            selectLetter,
            letterOptions,
            showModal,
            show
        }
    }
}
</script>

<style scoped>
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

.word-edit-image {
    max-height: 200px;
    max-width: 200px;
}
</style>