import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

let data = {
	bgcolor: 'white',
	fgcolor: '#ff687d',
	grey: 'rgba(0,0,0,.5)',
	route: '/',
	pinker: '#ff687d',
	login: false,
	user: {
		username: 'sourdude',
		avatar: "me.jpg"
	},
}

new Vue({
	router,
	data,
	render: h => h(App)
}).$mount('#app')

