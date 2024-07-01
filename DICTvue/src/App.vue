<!-- App.vue -->
<template>
    <div id="app">
      <Login />
    </div>
  </template>
  
  <script>
  import Login from './pages/login.vue'; // Adjust path based on your actual file structure
  
  export default {
    name: 'App',
    components: {
      Login
    }
  };
  </script>
  
  <style>
  /* Add your global styles here */
  </style>
  