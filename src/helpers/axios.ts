import axios from 'axios';
import promiseFinally = require('promise.prototype.finally');

promiseFinally.shim();

const token: Element | null = document.head.querySelector('meta[name="csrf-token"]');

if (token instanceof HTMLMetaElement) {
  axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
  axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
} else {
}

export default axios;
