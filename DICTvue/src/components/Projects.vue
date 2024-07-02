<template>

    <div class="Project-page">
      <button class="logout-button" @click="handleLogout"><i class="fas fa-arrow-left"></i></button>
      <div class="project-container">
        
        <h1>PROJECTS</h1>
        <div class="project-box">
            <button type="submit">WORKFORCE (DWIA)</button>
            <button type="submit">SPARKS</button>
          <button type="submit">TECH4ED / DTC</button>
      </div>
      </div>
  
      <div class="logo-container">
        <img src="@/assets/logo.png" alt="Logo" class="logo" />
      </div>

    </div>

  </template>
  
  <script>
export default {
  name: 'Projects',
  methods: {
    handleLogout() {
      if (confirm('Are you sure you want to logout?')) {
        this.$router.push('/');
        window.onbeforeunload = () => "You have unsaved changes. Are you sure you want to leave?";
      } else {
      }
    },
  },
};
  </script>
  
  <style scoped src="./Projects.css"></style>