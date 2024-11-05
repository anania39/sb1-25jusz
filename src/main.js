import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

// Load the Google Sign-In API
const script = document.createElement('script')
script.src = 'https://apis.google.com/js/platform.js'
script.async = true
script.defer = true
document.head.appendChild(script)

script.onload = () => {
  // Initialize Google Sign-In
  window.gapi.load('auth2', () => {
    window.gapi.auth2.init({
      client_id: 'YOUR_GOOGLE_CLIENT_ID' // Replace with your actual Google Client ID
    })
  })
}

createApp(App).mount('#app')