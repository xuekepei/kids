<template>
  <div>
    <NUpload :default-upload="false" :show-file-list="false" accept="image/*" ref="uploder" @change="uploadImage">
		<NButton icon="pi pi-check">图片选择 </NButton>
	</NUpload>

    <NModal v-model:show="cropperDialogOpen" class="weshow-cropper-dialog">
		<template #header>
			<div>标题</div>
		</template>
      <vue-cropper ref="cropper" class="weshow-cropper" :aspect-ratio="aspectRatio" :src="imgSrc" preview=".preview"/>
      <template #footer>
        <NButton icon="pi pi-times" class="p-button-text" @click="cropperDialogOpen = false">
			取消
		</NButton>
        <NButton icon="pi pi-check" @click="toCrop">
			确认
		</NButton>
      </template>
    </NModal>
  </div>
</template>
<script>
import VueCropper from "vue-cropperjs";
import {NUpload, NModal, NButton} from "naive-ui";
import { ref } from "@vue/reactivity";

export default {
  components: { VueCropper, NModal, NUpload, NButton },
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
    const cropperDialogOpen = ref(false);
    const cropper = ref(null);
    const imgSrc = ref("");
    const uploder = ref(null);
    const uploadImage = (event) => {
		
		const file = event.file.file;
		console.log(event)
		imgSrc.value = URL.createObjectURL(file);
		cropperDialogOpen.value = true;
    };

    const toCrop = () => {
      let config = {
        maxWidth: 450,
        maxHeight: 450,
      };
      if (props.fixedMode) {
        config = { width: props.width, height: props.height };
      }
      emit(
        "crop",
        cropper.value.getCroppedCanvas(config).toDataURL("image/jpeg", 0.8)
      );
      cropperDialogOpen.value = false;
    };
    return { cropper, cropperDialogOpen, imgSrc, uploadImage, toCrop, uploder };
  },
};
</script>
<style scoped>
.weshow-cropper {
  max-height: 60vh;
}
.weshow-cropper-dialog {
  width: 90%;
  max-width: 600px;
}
</style>
