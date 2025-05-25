import axios from "axios";

const BASE_URL = 'http://localhost:3000/';

const instance = axios.create({ baseURL: BASE_URL });


export const api = instance;