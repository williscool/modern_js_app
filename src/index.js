import 'babel-polyfill';
import './styles/main.css';
import { APP_CONTAINER_SELECTOR } from './config';

document.addEventListener('DOMContentLoaded', () => {
  const containerRoot = document.querySelector(APP_CONTAINER_SELECTOR);
  containerRoot.innerHTML = '<h1>Hello from Webpack!</h1>';
});
