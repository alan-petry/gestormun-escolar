import axios from 'axios';



// const api = axios.create({baseURL : 'http://127.0.0.1:59901'});
// const api = axios.create({baseURL : 'http://186.251.254.146:59900/'});
const api = axios.create({baseURL : 'http://34.203.135.24:59900/'});
// const api = axios.create({baseURL : 'http://34.203.135.24:59901/'});



// api.defaults.headers.common = { Authorization : `Bearer ${localStorage.getItem('app-token')}`};

api.interceptors.request.use(async (config) => {
    if (
      !config.url.endsWith('login') ||
      !config.url.endsWith('GetToken')
    ) {
        const userToken = localStorage.getItem('app-token');
        config.headers.Authorization = `Bearer ${userToken}`;
      }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

api.interceptors.response.use((response) => {
    return response;
  },(error) => {
    if (error.response.status === 401) {     
      alert('Conexão não permitida')
      return window.location.href = '/auth/login';
    }
    if (error.response.status === 404) {     
      alert('Página não encontrada')
      return window.location.href = '/auth/login';
    }

    return Promise.reject(error);
  });

export default api;