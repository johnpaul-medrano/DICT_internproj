<template>
  <div v-if="isVisible" class="modal">
    <div class="modal-content">
      <p>Are you sure you want to sign out?</p>
      <button class="confirm-button" @click="confirmSignOut">Yes</button>
      <button class="cancel-button" @click="closeModal">No</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    confirmSignOut() {
      this.$emit("confirm");
    },
  },
};
</script>

<style scoped>
.modal {
  display: flex;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border: 1px solid #888;
  width: 400px;
  height: 160px;
  text-align: center;
  border-radius: 50px;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.confirm-button,
.cancel-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 15px;
  margin: 10px;
  width: 30%;
}

.confirm-button:hover,
.cancel-button:hover {
  background-color: #0056b3;
}

.cancel-button {
  background-color: #6c757d;
}

.cancel-button:hover {
  background-color: #5a6268;
}

p {
  color: black;
  margin-top: 40px;
  margin-bottom: 30px;
  font-size: 18px;
}
</style>
