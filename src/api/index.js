import { createAPI } from "./create-api";
import auth from "./module/auth";
import store from "../store";
import { useMessage } from "naive-ui";
const message = useMessage()

const api = createAPI();

api.interceptors.request.use(
    config => {
        const needToken = config.needToken || false
        const token = store.getters.token
        if (token && needToken) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        // Do something with request error
        return Promise.reject(error);
    }
)

api.interceptors.response.use (
    response => {
        return response;
    },
    error => {
        window.$message.error(error.response.data.message)
        return Promise.reject(error);
    }
)

export const authApi = auth(api);