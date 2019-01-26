import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
//import Minitruth from './Minitruth'
import { Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-oldschool-dark'
const options = {
  position: 'bottom center',
  timeout: 5000,
  offset: '30px',
  transition: 'scale'
}

ReactDOM.render(
  <AlertProvider template={AlertTemplate} {...options}>
  <App />
  </AlertProvider>
  ,
  document.getElementById('root')
);
