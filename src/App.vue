<template>
<div class="box" @click="close">
  <div :style="navbar" id="nav">
    <div id="nav-left">
      <router-link to="/" :style="just_color" class="navlinks logo-text unselectable">sour chat</router-link>
    </div>
    <div id="nav-mid">
      <router-link :style="grey" to="/posts" class="navlinks tab unselectable">posts</router-link>
      <router-link :style="grey" to="/" class="navlinks tab unselectable">chats</router-link>
      <a :style="grey" class="navlinks tab unselectable" @click="create">new</a>
    </div>
    <router-link class="username" v-if="this.$root.$data.user" to="/" :style="just_color">
    <div id="nav-right">
      <img v-bind:src="'/media/avatars/' + this.$root.$data.user.avatar" class="profile-icon" :style="profile_border"/>
      <p>{{this.$root.$data.user.username}}</p>
    </div>
    </router-link>
    <div v-else id="nav-right">
      <button :style="fg" class="login-button unselectable" @click="toggle">log in</button>
    </div>
  </div>
<div class="content">
  <transition name="fade" mode="out-in">
	<router-view/>
  </transition>
  <div :style="modal" id="modal" class="modal">
  </div>
  <transition name="fade" mode="out-in">
  <div class="login-form" v-if="login" :style="login_form">
	<h1 v-if="!signup" class="login-title unselectable">log in</h1>
	<h1 v-else class="login-title unselectable">sign up</h1>
	<div class="login-inputs">
	<input v-if="!signup" placeholder="username or email" v-model="username"/>
	<input v-else placeholder="username" v-model="username"/>
	<input v-if="signup" placeholder="email" type="email" v-model="email">
	<input v-if="!signup" placeholder="password" type="password" v-model="password" v-on:keyup.enter="submit_login"/>
	<input v-else placeholder="password" type="password" v-model="password"/>
	<input v-if="signup" placeholder="confirm password" type="password" v-model="confirm_password" v-on:keyup.enter="submit_login"/>
	</div>
	<button class="login-button unselectable" @click="submit_login">submit</button>
	<p class="signup" v-if="!signup" @click="signup_switch">sign up</p>
	<p class="signup" v-else @click="signup_switch">log in</p>
  </div>
  </transition>
</div>
<div class="toast unselectable" :style="toastStyle">
<p>{{toast}}</p>
</div>
</div>
</template>

<script>

export default {
	name: 'App',
	methods: {
		create(){
			console.log(this.$root._router.app)
			if (!this.$root.$data.user){
				this.$root.$data.login = true;
				this.creating = true;
				this.make_toast("Please log in to create a new chat");
			}
			
			if (this.$root.$data.user){
				const username = this.$root.$data.user.username;
				const id = this.newurl;
				this.$router.push({ name: 'chat', params: { username, id } });
			}
		},
		toggle(){
			this.$root.$data.login = !this.$root.$data.login;
		},
		close: function(event){
			let modal = document.getElementById('modal');
			if (event.target == modal){
				this.$root.$data.login = false;
				this.creating = false;
			}
		},
		submit_login(){
			let validuser = "_-.ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
			let validpassword = "~!@#$%^&*()_+{}|:\"<>?`-=[]\\;',./ ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
			if(this.signup){
				if(!this.username){
					this.make_toast("Please enter a username");
					return;
				}
				if(this.username.length > 40)
				for(let i = 0; i < this.username.length; i++){
					if(!validuser.includes(this.username.charAt(i))){
						this.make_toast("Usernames may only contain A-Z, a-z, 0-9, and . _ -");
						return;
					}
				}
				if(!this.email){
					this.make_toast("Please enter your email");
					return;
				}
				//email validator
				var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if(!re.test(this.email)){
					this.make_toast("Please enter a valid email");
					return;
				}
				if(!this.password){
					this.make_toast("Please enter a password")
					return;
				}
				if(this.password.length < 6){
					this.make_toast("Passwords must contain at least 6 characters")
					return;
				}
				for(let i = 0; i < this.password.length; i++){
                                        if(!validpassword.includes(this.password.charAt(i))){
                                                this.make_toast("Passwords can only contain A-Z, a-z, 0-9, and standard characters");
                                                return;
                                        }
                                }
				if(!this.confirm_password){
					this.make_toast("Please confirm your password")
					return;
				}
				if(this.password != this.confirm_password){
					this.make_toast("Passwords do not match");
					return;
				}
			}
			else{
				if(!this.username){
					this.make_toast("Please enter your username");
					return;
				}
				else if(!this.password){
					this.make_toast("Please enter your password");
					return;
				}
				
			}
			//replace with backend call
			console.log("TEST CODE ONLY")
			if(this.username){
				this.$root.$data.user = {
					username: this.username,
					avatar: 'me.jpg',
				}
			}
			
			//empty vars
			this.username = "";
			this.email = "";
			this.password = "";
			this.confirm_password = "";
			//if success
			if(this.$root.$data.user){
				this.$root.$data.login = false;
			}
			
			if(this.creating && this.$root.$data.user){
				this.creating = false;
				this.create()
			}
		},
		signup_switch(){
			this.signup = !this.signup;
		},
		make_toast(message, color, bg){
			if(typeof bg === "undefined"){
				bg = "rgba(50, 50, 50, .7)"
			}
			if(typeof color === "undefined"){
				color = "white"
			}
			this.toast_color = color;
			this.toast_bg = bg;
			this.toast = message;
			this.toastView = true;
			this.message_i++;
			let current_i = this.message_i;
			setTimeout(function() {
				if(this.message_i == current_i){
					this.toastView = false
				}
				}.bind(this), 3000);
		},
	},
	computed: {
		navbar(){
			return {
				"background-color": this.$root.$data.bgcolor,
				"color": this.$root.$data.fgcolor,
			}
		},
		fg(){
			return {
				"color": this.$root.$data.bgcolor,
				"background-color": this.$root.$data.fgcolor
			}
		},
		just_color(){
			return {
				"color": this.$root.$data.fgcolor,
			}
		},
		grey(){
			return {
				"color": this.$root.$data.grey,
			}
		},
		route(){
			return this.$root.$data.route
		},
		login(){
			return this.$root.$data.login
		},
		modal(){
			if(this.$root.$data.login){
				return{
					"visibility": "visible",
        				"background-color": "rgba(0,0,0,0.2)",
				        "backdrop-filter": "blur(10px)",
				}
			}
			else{
				return{
					"visibility": "hidden",
        				"background-color": "rgba(0,0,0,0)",
				        "backdrop-filter": "blur(0)",
				}
			}
			
		},
		login_form(){
			if(this.$root.$data.login){
				return{
					"visibility": "visible",
        				"background-color": "rgba(250,250,250,1)",
					"transform": "translate(-50%, -50%)",
					"filter": "drop-shadow(0 0 8px var(--shadow))"
	
				}
			}
			else{
				return{
					"visibility": "hidden",
        				"background-color": "rgba(0,0,0,0)",
					"transform": "translate(-50%, 0)",
					"filter": "drop-shadow(0 0 8px rgba(0,0,0,0))"
				}
			}
			
		},
		profile_border(){
			return {
				"border": "solid 2px rgba(220, 220, 220, 1)",
			}
		},
		toastStyle(){
			if (this.toastView)
			return {
				"opacity": "1",
				"bottom": "132px",
				"color": this.toast_color,
				"background": this.toast_bg,
			}
			else
			return {
				"opacity": "0",
				"bottom": "100px",
				"color": this.toast_color,
				"background": this.toast_bg,
			}
		},
	},
	data() {
		return {
			//user: false,
			username: "",
			password: "",
			confirm_password: "",
			email: "",
			signup: false,
			isprivate: false,
			newurl: "example",
			toast: "",
			toastView: false,
			creating: false,
			toast_color: "",
			toast_bg: "",
			message_i: 0,
		}
	}
};
</script>

<style>


html, body{
	height: 100%;
	margin: 0;
	width: 100%
}

p, h1, h2, h3, h4, h5, input, button, a{
	font-family: 'Open-sans', sans-serif;
	text-decoration: none;
}

.box {
	display: flex;
	flex-flow: column;
	height: 100%;
}

:root {
	--main-color:#ff8080;
	--shadow: rgba(0,0,0,.3);
	--dark-grey: rgba(0,0,0,.5);
}

#nav{
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	background-color: white;
}

.navlinks{
	text-decoration: none;
}



.logo-text{
	margin: 15px 0;
	border-radius: 50px;
	padding: 0 20px;
	color: #ff687d;
	font-size: 50pt;
	font-family: 'Itim', sans-serif;
	transition: all .2s;
	display: inline-block;
}

.logo-text:hover{
	transform: scale(1.02);
}

.unselectable {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.tab{
	display: inline-block;
	position: relative;
	font-family: 'Open sans', sans-serif;
	font-size: 20pt;
	padding: 25px 5%;
	color: var(--dark-grey);
	transition: color 300ms, text-decoration 300ms;
	transition-timing-function: ease-out;
	cursor: pointer;
}

.tab:after{
	content: '';
	position: absolute;
	width: 100%;
	transform: scaleX(0);
	height: 3px;
	bottom: 0;
	left: 0;
	background-color: var(--shadow);
	transform-origin: bottom center;
	transition: transform 0.25s ease-out;
}

.tab:hover{
	color: var(--shadow) !important;
}

.tab:hover:after{
	color: var(--shadow);
	transform: scaleX(.8);
	transform-origin: bottom center;
}

#nav-mid{
	flex-grow: 2;
	display: flex;
	justify-content: center;
}

#nav-left{
	margin-left: 40pt;
}

#nav-right{
	margin-right: 100pt;
	margin-left: 50px;
	display: flex;
	align-items: center;
	transition: all 300ms;
	transition-timing-function: ease-out;
}

#nav-right:hover{
	transform: scale(1.05);
	cursor: pointer;
}

.login-button{
	background-color: var(--main-color);
	padding: 10px 15px;
	border: none;
	border-radius: 30px;
	color: #FFF;
	font-size: 15pt;
	font-family: "Open sans", sans-serif;
	filter: drop-shadow(0 0 2px var(--shadow));
	transition: filter 300ms, background-color 300ms, color 300ms;
	transition-timing-function: ease-out;
	cursor: pointer;
}

.login-button:hover{
	filter: drop-shadow(0 0 4px var(--dark-grey));
}

#app{
	height: 100%;
}

.content{
	flex: 1 1 auto;
}

.fade-enter, .fade-leave-to {
	opacity: 0;
	transform: translateX(2em);
}

.fade-enter-active, .fade-leave {
	transition: all .3s ease;
}

.login-form {
	border-radius: 5px;
	padding: 50px;
	position: absolute;
	left: 50%;
	top: 30%;
	z-index: 500;
	transition: all 400ms;
	text-align: center;
}

.modal {
	position: fixed;
	z-index: 400;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	overflow: auto;
	background-color: rgb(0,0,0);
	background-color: rgba(0,0,0,0.4);
	backdrop-filter: blur(10px);
	transition: all 400ms;
}

.login-form input{
	display: block;
	margin: 20px 0;
	width: 250px;
	font-size: 20px;
	border: 3px solid white;
	padding: 12px 30px;
	filter: drop-shadow(0 0 5px rgba(0,0,0,0.1));
	border-radius: 15px;
	transition: all 300ms;
}

.checkbox{
	display: inline-block !important;
	margin: 0 5px !important;
	padding: 0 !important;
	width: auto !important;
}

.checkbox-label{
	display: inline-block;
}



.login-form input:focus{
    outline: none !important;
    border:3px solid var(--main-color);
    filter: drop-shadow(0 0 5px rgba(0,0,0,0.1));
}

.login-form h1{

	color: var(--main-color);
}

.login-inputs{
	margin: 50px 10px;
}

.signup{
	color: var(--dark-grey);
	cursor: pointer;
	transition: all 200ms;
}

.signup:hover{
	color: var(--shadow)
}

.profile-icon{
	max-height: 60px;
	max-width: 60px;
	margin-right: 20px;
	border-radius: 100px;
	transition: all 200ms;
}


.username{
	font-size: 20px;
	transition: all 200ms;
}

.toast{
	min-width: 250px;
	text-align: center;
	border-radius: 100px;
	padding: 4px 16px;
	position: fixed;
	z-index: 600;
	left: 50%;
	transform: translateX(-50%);
	font-size: 12pt;
	transition: bottom .5s, opacity .5s;
}

</style>
