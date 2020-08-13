<template>
  <section class="section">
    <div class="container">
      <SimpleUpload />
    </div>
  </section>
</template>

<script>
import SimpleUpload from "./SimpleUpload.vue";
export default {
  name: "App",
  components: { SimpleUpload },
};
</script>
