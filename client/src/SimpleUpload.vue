<template>
  <form @submit.prevent="sendFile" enctype="multipart/form-data">
    <div v-if="message" class="field">
      <div :class="`notification ${error ? 'is-danger' : 'is-success'} is-light`">
        <button type="button" class="delete" @click="clearMessage"></button>
        {{message}}
      </div>
    </div>
    <div class="field">
      <div class="file is-link is-boxed">
        <label class="file-label">
          <input
            class="file-input"
            type="file"
            name="file"
            id="file"
            @change="selectFile"
            ref="file"
          />
          <span class="file-cta">
            <span class="file-icon">
              <i class="fas fa-cloud-upload-alt"></i>
            </span>
            <span class="file-label">Upload image</span>
          </span>
          <span v-if="file" class="file-name">{{ file.name }}</span>
        </label>
      </div>
    </div>
    <div class="field">
      <button class="button is-primary" type="submit">Upload</button>
    </div>
  </form>
</template>

<script>
import axios from "axios";
export default {
  name: "SimpleUpload",
  data() {
    return {
      file: "",
      message: "",
      error: false,
    };
  },
  methods: {
    selectFile() {
      let file = this.$refs.file.files[0]
      let MAX_FILE_SIZE = 200000
      const tooLarge = file.size > MAX_FILE_SIZE
      console.log(file)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
      if (!allowedTypes.includes(file.type) && tooLarge) {
        this.message = tooLarge ? `Files under ${MAX_FILE_SIZE / 1000}Kb are allowed` : 'Only image files are allowed'
        this.error = true
      } else {
        this.message = ''
        this.file = file;
        this.error = false
      }
      
    },
    async sendFile() {
      const fd = new FormData();
      fd.append("file", this.file);
      try {
        await axios.post("/api/upload", fd);
        this.message = "File has been uploaded";
        this.file = "";
        this.error = false;
      } catch (err) {
        console.log(err);
        this.message = err.response.data.error;
        this.error = true;
      }
    },
    clearMessage() {
      this.message = "";
    },
  },
};
</script>
