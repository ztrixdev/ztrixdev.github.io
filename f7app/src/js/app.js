import $ from 'dom7';
import Framework7 from 'framework7/bundle';

import 'framework7/css/bundle';

import '../css/icons.css';
import '../css/app.scss';

import routes from './routes.js';

import App from '../app.f7';


var app = new Framework7({
  name: 'ztrixs asylum', 
  theme: 'ios',
  darkMode: true,
  el: '#app',
  component: App, 
  routes: routes,
});