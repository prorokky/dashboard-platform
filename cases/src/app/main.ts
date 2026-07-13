import { createApp } from "vue";
import "platform-ui/styles/index.css";

import App from "./App.vue";
import { casesPinia } from "../stores/pinia.ts";

const app = createApp(App);

app.use(casesPinia);
app.mount("#app");
