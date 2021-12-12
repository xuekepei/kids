import {createAPI} from "./create-api";
import auth from "./module/auth";

// import store from "../store";

const api = createAPI();

export const authApi = auth(api);