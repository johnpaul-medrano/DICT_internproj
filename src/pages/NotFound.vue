<template>
    <div>
      <h1>404 Not Found</h1>
      <p>Oops!</p>
      <p>The page you are looking for does not exist.</p>
      <p>Go here instead:</p>
      <button @click="handleLogout">Log-in</button>
      <button @click="handleProjects">Projects</button>
    </div>
  </template>
  
<script>
  import { logout } from '@/firebaseConfig';
  import { useRouter } from 'vue-router';

  export default {
    name: 'NotFound',
    setup() {
        const router = useRouter();

        const handleLogout = async () => {
            try {
                await logout();
                router.push("/");
            } catch (error) {
                console.log("Error during logout:", error);
            }
        }

        const handleProjects = async () => {
            router.push("/projects");
        }

        return {
            handleLogout,
            handleProjects,
        }
    }
  }
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

</style>