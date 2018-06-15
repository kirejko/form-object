import axios from 'axios';

const token: Element | null = document.head.querySelector('meta[name="csrf-token"]');

if (token instanceof HTMLMetaElement) {
  axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
  axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
} else {
  console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

export default axios;
