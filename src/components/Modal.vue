<template>
  <template v-if="this.isOpen">
    <div class="overlay">
      <div class="modal">
        <div class="modal__desc">
          <slot name="main">placeholder text</slot>
        </div>
        <div class="modal__footer">
          <slot name="button" :close="this.close" :open="this.open"> </slot>
        </div>
      </div>
    </div>
  </template>
</template>
<script>
export default {
  name: "Modal",
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    open() {
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    },
  },
};
</script>
<style lang="scss">
.overlay {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1300;
}
.modal {
  position: relative;
  background-color: #c9c9c9;
  text-align: center;
  width: 550px;
  max-width: 1300px;
  border-radius: 5px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  padding: 5px 10px;

  &__footer {
    margin-top: 10px;
    border-top: 1px solid #000;
    padding-top: 10px;
    display: flex;
    justify-content: space-around;
  }
}
button {
  cursor: pointer;
}
</style>
