<template>
    <div id="main">
      <div id="left">
        <h1 id="header">Oops!</h1>
        <h2 id="subheader">The page you are looking for does not exist.</h2>
        <p><br><br>Maybe you would rather go here?</p>
        <div id="redirectbuttons">
            <button @click="handleLogout" id="logout">Log-in</button>
            <button @click="handleProjects" id="projects">Projects</button>
        </div>
      </div>
      <div id="right">
        <img :src="err404" alt="404CatImage" id="404img" />
      </div>
    </div>
  </template>
  
<script>
  import { logout } from '@/firebaseConfig';
  import { useRouter } from 'vue-router';
  import err404 from "@/assets/404-cat.png"

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
        };
    },
    data() {
        return {
            err404,
        };
    }
  }
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

#main {
    background-color: skyblue;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 200px;
}

#left {
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    justify-content: center;
    gap: 20px;
}

#header {
    font-size: 10vh;
}

#subheader {
    font-size: 3vh;
    font-weight: 500;
}

p {
    font-size: 2.5vh;
}

#redirectbuttons {
    display: flex;
    gap: 20px;
}

img {
    width: 700px;
}

button {
    background-color: #42498c;
    width: 135px;
    height: 45px;
    border-radius: 25px;
    color: #dddada;
    font-size: 15px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    margin-top: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

#logout {
    background-color: #dd1243;
}

#logout:hover {
    background-color: #b01036;
}

#projects:hover {
    background-color: #30357f;
}

/* Media Queries for Responsiveness */
@media (max-width: 768px) {
  #main {
    flex-direction: column;
    gap: 50px;
    text-align: center;
  }

  #header {
    font-size: 9vh;
  }

  #subheader {
    font-size: 3vh;
  }

  p {
    font-size: 2.5vh;
  }

  img {
    width: 90%;
    height: auto;
  }

  button {
    width: 120px;
    height: 45px;
    font-size: 15px;
  }
}

@media (max-width: 992px) {
  #main {
    gap: 100px;
    padding: 20px;
  }

  #header {
    font-size: 8vh;
  }

  #subheader {
    font-size: 3vh;
  }

  p {
    font-size: 2.5vh;
  }

  img {
    width: 100%;
    height: auto;
  }

  button {
    width: 120px;
    height: 45px;
    font-size: 15px;
  }
}

@media (max-width: 1200px) {
  #main {
    gap: 150px;
    padding: 20px;
  }

  #header {
    font-size: 9vh;
  }

  #subheader {
    font-size: 3vh;
  }

  p {
    font-size: 2.5vh;
  }

  img {
    width: 100%;
    height: auto;
  }

  button {
    width: 130px;
    height: 45px;
    font-size: 15px;
  }
}

</style>