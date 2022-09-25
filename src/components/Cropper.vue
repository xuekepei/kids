<template>
    <div>
        <NUpload :default-upload="false" :show-file-list="false" accept="image/*" ref="uploader" @change="uploadImage">
            <NButton icon="pi pi-check">图片选择</NButton>
        </NUpload>

        <NModal title="图片裁切" preset="card" :style="bodyStyle" v-model:show="cropperDialogOpen" class="cropper-dialog">
            <vue-cropper ref="cropper" class="cropper" :viewMode="2" :aspect-ratio="aspectRatio" :src="imgSrc"
                         preview=".preview"/>
            <template #footer>
                <NSpace justify="space-between">
                    <NButton icon="pi pi-times" class="p-button-text" @click="cropperDialogOpen = false">
                        取消
                    </NButton>
                    <NButton icon="pi pi-check" @click="toCrop">
                        确认
                    </NButton>
                </NSpace>
            </template>
        </NModal>
    </div>
</template>
<script>
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
import { NUpload, NModal, NButton, NSpace } from 'naive-ui'
import { ref } from 'vue'

export default {
    components: { VueCropper, NModal, NUpload, NButton, NSpace },
    props: {
        aspectRatio: {
            type: Number,
        },
        width: {
            type: Number,
        },
        height: {
            type: Number,
        },
        fixedMode: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, { emit }) {
        const cropperDialogOpen = ref(false)
        const cropper = ref(null)
        const imgSrc = ref('')
        const uploader = ref(null)
        const uploadImage = (event) => {

            const file = event.file.file
            console.log(event)
            imgSrc.value = URL.createObjectURL(file)
            cropperDialogOpen.value = true
        }

        const toCrop = () => {
            let config = {
                maxWidth: 450,
                maxHeight: 450,
            }
            if (props.fixedMode) {
                config = { width: props.width, height: props.height }
            }
            emit(
                'crop',
                cropper.value.getCroppedCanvas(config).toDataURL('image/jpeg', 0.8)
            )
            cropperDialogOpen.value = false
        }
        return {
            cropper,
            cropperDialogOpen,
            imgSrc,
            uploadImage,
            toCrop,
            uploader,
            bodyStyle: {
                maxWidth: '600px'
            },
        }
    },
}
</script>
<style scoped>
.cropper {
    max-height: 60vh;
}

.cropper-dialog {
    width: 90%;
    max-width: 600px;
}
</style>
