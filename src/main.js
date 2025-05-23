import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';  // Adjust the import path if necessary
import { store } from './store';

const app = createApp(App);

app.use(router);
app.use(store);
app.mount('#app');
