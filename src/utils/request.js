import axios from "axios";
    
const userSignin = JSON.parse(localStorage.getItem('persist:root')).userSignin;
const accessToken = JSON.parse(userSignin).accessToken;
const request = axios.create({
    baseURL: 'http://localhost:5000/',
    // headers: {
        authorization: `Bearer ${accessToken}` 
    // }
});

export default request;
