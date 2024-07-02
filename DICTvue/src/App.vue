<!-- App.vue -->
<script setup>
import Login from './pages/login.vue'; // Adjust path based on your actual file structure
import { RouterLink, RouterView } from "vue-router";
// export default {
//   name: 'App',
//   components: {
//     Login
//   }
// };
</script>
<template>
    <!-- <div id="app">
      <Login />
    </div> -->
    <RouterView />
</template>
  

  
  <style>
  /* Add your global styles here */
  </style>
  