import axios from "axios";

const axiosInstance = axios.create({
      baseURL:"https://cravings-server.onrender.com",
    withCredentials:true,
})

export default axiosInstance;
