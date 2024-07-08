<template>
    <div class="time-section">
      {{ currentTime }}
    </div>
  </template>
  
  <script>
  import { ref, onMounted, onUnmounted } from 'vue';
  
  export default {
    name: 'TimeSection',
    setup() {
      const currentTime = ref(new Date().toLocaleTimeString());
  
      const updateCurrentTime = () => {
        currentTime.value = new Date().toLocaleTimeString();
      };
  
      onMounted(() => {
        const interval = setInterval(updateCurrentTime, 1000);
        onUnmounted(() => {
          clearInterval(interval);
        });
      });
  
      return {
        currentTime
      };
    }
  };
  </script>
  
  <style scoped>
  .time-section {
    font-size: 1.5rem;
    color: white;
  }
  </style>
  