<template>
  <div class="login-page">

    <div class="login-container">
      <h1>DICT DOCTRACKER</h1>
      <div class="Login-box">
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <input type="text" id="username" v-model="username" placeholder="     Username" required />
        </div>
        <div class="form-group">
          <input type="password" id="password" v-model="password" placeholder="    Password" required />
        </div>
        <button type="submit">LOGIN</button>
      </form>
    </div>
    </div>

    <div class="logo-container">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    handleLogin() {
      // Basic login logic (you can replace this with actual authentication logic)
      if (this.username === 'admin' && this.password === 'password') {
        alert('Login successful!');
        this.$router.push('/home');
      } else {
        alert('Invalid username or password');
      }
    },
  },
};
</script>

<style>
h1{
  font-size: 40px;
  color: #ffff;
}
body{
  font-family: 'Poppins', sans-serif;
  background-color: #275598;
}

.login-page {
  display: flex;
  height: 100vh;
  background-color: #275598;

}

.login-container {
  background-color: #275598;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center ;
  align-items: center;
  text-align: center;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
  width: 100%;
  text-align: center;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  border-radius: 20px;
  height: 40px;
  width: 300px;
  padding: 8px; 
  background-color:#d9d9d9;
  margin-top: 10px;
  font-size: 20px;
  font-weight: 700;
  outline: none;
  border: none;
}
button {
  height: 45px;
  margin-top: 20px;
  padding: 10px;
  border-radius: 25px;
  width: 60%;
  background-color: #FBD35A;
  color: #4961A6;
  border: none;
  cursor: pointer;
  font-weight: 800;
  font-size: 15px;
}

button:hover {
  background-color: #ff5757;
}

.logo-container {
  background-color: #275598;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.Login-box{
  width: 450px;
  height: 350px;
  background-color: #ffff;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: center;
}

.logo {
  max-width: 100%;
  max-height: 100%;
}
</style>
