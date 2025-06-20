import axios from "axios";
axios.defaults.withCredentials = true

/*Api do backend*/
const BACKEND_URL = 'http://localhost:3000/';

const backendInstance = axios.create({ baseURL: BACKEND_URL });

export const api = backendInstance;


/*Api da CDN*/ 
export const CDN_URL = 'http://localhost:5000';

const cdnInstance = axios.create({ baseURL: CDN_URL });

export const cdn = cdnInstance;