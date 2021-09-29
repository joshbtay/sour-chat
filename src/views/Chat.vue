<template>
<div class="chat" @mouseup.left="mouseUp" >
	<canvas id="drawing" width="500" height="500" @mousedown.left="mouseDown" @mousemove="mouseMove"></canvas>
	<v-swatches v-model="color"
		:swatches = "swatches"
		row-length="6"
		popover-x="left"
		show-fallback
		fallback-input-type="color"
		></v-swatches>
		
		<div class="slidecontainer">
		size
		<input type="range" min="1" max="100" value="10" v-model="size" class="slider" id="size">
		</div>
	<br>
	<div v-if="comments_len" class="wrapper" id="scrollbox">
	<div class="comment-box">
		<div v-for="comment in comments" v-bind:key="comment._id" class="comment" :style="move(comment)">
			<img v-if="comment.owner != $root.$data.user.username" v-bind:src="get_avatar(comment)" class="avatar-mini" @error="setProfileImage"/>
			<p class="comment-text" :style="comment_text(comment)">{{comment.text}}</p>
			<img v-if="comment.owner == $root.$data.user.username" v-bind:src="get_avatar(comment)" class="avatar-mini" @error="setProfileImage"/>
		</div>
	</div>
	</div>
	<input class="write-comment" placeholder="message" v-model="comment" @keyup.enter="send_comment"/>
	<button class="login-button unselectable" @click="send_comment">send</button>
	<br>
</div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios';
import VSwatches from 'vue-swatches';
import 'vue-swatches/dist/vue-swatches.css';
export default {
name: 'chat',
mounted() {
	var c = document.getElementById('drawing');
	this.canvas = c.getContext('2d');
	this.canvas.lineCap = 'round';
	console.log("Starting connection to WebSocket Server")
	this.connection = new WebSocket("ws://127.0.0.1:8000/")
        this.connection.onmessage = function(event) {
		this.receive(event.data);
        }.bind(this)
        this.connection.onopen = function(event) {
                console.log(event);
        }
},
data() {
	let username = this.$root.$data.user.username;
	let avatar = this.$root.$data.user.avatar;
	return {
		connection: null,
		settings: false,
		publish: false,
		pass: false,
		passphrase: "",
		comments: [],
		comment:"",
		avatars: { [username]: avatar},
		scrolled: false,
		last_comment: "",
		isDrawing: false,
		lastPoint: null,
		diameter: 10,
		color: '#444',
		size: 10,
		previous: null,
		swatches: [
                        ['#FF696D', '#FFA15C', '#FFED71', '#98EF76', '#77CCF6', '#E4A4EA' ],
                        ['#EA3E40', '#FF8023', '#F7E03D', '#7BDC55', '#299BD6', '#BB69C0' ],
                        ['#C92022', '#DE5D00', '#EBC600', '#43AF17', '#1E6FAA', '#773F82' ],
                        ['#000', '#444', '#999', '#ccc', '#fff', '#4F392B', ]
		],
		canvas: null,
	}
},
computed: {
},
components: { VSwatches },
methods: {
	setProfileImage(event) {
		event.target.src= '/media/avatars/default.png'
	},
	comments_len(){
		return this.comments.length != 0;
	},
	mouseDown(event){
		this.isDrawing = true;
		var rect = event.target.getBoundingClientRect();
		var xcoord = event.clientX - rect.left;
		var ycoord = event.clientY - rect.top;
		this.lastPoint = { x: xcoord, y: ycoord };
		this.canvas.beginPath();
		if (this.connection.readyState !== WebSocket.CLOSED) {
			
			this.connection.send(JSON.stringify({
				head: true,
				color: this.color,
				size: this.size,
				x: xcoord,
				y: ycoord,
			}));
		}
	},
	mouseUp(){
		this.isDrawing = false;
	},
	receive(message){
		const packet = JSON.parse(message);
		if(packet.message){
			this.receive_comment(packet);
			return;
		}
		if (packet.head){
			this.previous = {x: packet.x, y: packet.y};
			return;
		}
		this.canvas.beginPath();
		this.canvas.strokeStyle=packet.color;
		this.canvas.lineWidth = packet.size;
		this.canvas.moveTo(this.previous.x, this.previous.y);
		this.canvas.lineTo(packet.x, packet.y);
		this.canvas.stroke();
		this.previous = {x: packet.x, y: packet.y};
	},
	mouseMove(event){
		if(!this.isDrawing){
			return;
		}
		if(this.connection.readyState === WebSocket.CLOSED){
			this.$parent.make_toast("Error sending data to server")
		}
		this.canvas.beginPath();
		var rect = event.target.getBoundingClientRect();
		var xcoord = event.clientX - rect.left;
		var ycoord = event.clientY - rect.top;
		var currentPoint = { x: xcoord, y: ycoord };
		this.canvas.strokeStyle=this.color;
		this.canvas.lineWidth = this.size;
		this.canvas.moveTo(this.lastPoint.x, this.lastPoint.y);
		this.canvas.lineTo(currentPoint.x, currentPoint.y);
		this.canvas.stroke();
		this.lastPoint = currentPoint
		if (this.connection.readyState !== WebSocket.CLOSED) {
			this.connection.send(JSON.stringify({
				head: false,
				color: this.color,
				size: this.size,
				x: xcoord,
				y: ycoord,
			}));

		}
	},
	
	async test(){
		try{
			let response = await axios.get('https://www.reddit.com/r/movies/hot/.json')
			console.log(response.data.data)
		} catch(error) {
			console.log(error)
		}
	},
	get_avatar(comment){
		if (!(comment.owner in this.avatars)){
			//get image, put in avatars
		}
		return '/media/avatars/' + this.avatars[comment.owner]
	},
	comment_text(comment) {
		if(comment.owner == this.$root.$data.user.username){
		return {
		"background-color": "#43c7f1",
		"border-radius": "10px 10px 2px 10px",
		}
		}
		else{
		return {
		"background-color": "#FF8080",
		"border-radius": "10px 10px 10px 2px",
		}
		}
	},
	move(comment) {
		if(comment.owner == this.$root.$data.user.username){
		return {
		"margin-left": "auto",
		"margin-right": "0",
		"text-align": "right",
		}
		}
		else{
		return {
		"margin-right": "auto",
		"text-align": "left",
		}
		}
	},
	at_bottom(){
		let elem = document.querySelector('#comment-end');
		let box = document.querySelector('#scrollbox');
		var rect = elem.getBoundingClientRect();
		var parent = box.getBoundingClientRect();
		return rect.bottom < parent.bottom;
	},
	send_comment() {
		if(this.comment.length == 0){
			return
		}
		let commentInfo = {
			text: this.comment,
			_id: this.uuidv4(),
			owner: this.$root.$data.user.username,
		}
		this.comments.push(commentInfo);
		if (this.connection.readyState !== WebSocket.CLOSED) {
			this.connection.send(JSON.stringify({
				message: this.comment,
			}));

		}
		this.comment = ""
	},
	receive_comment(packet) {
		let commentInfo = {
			text: packet.message,
			_id: this.uuidv4(),
			owner: 'other',
		}
		this.comments.push(commentInfo);
	},
	uuidv4() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	},
},
created() {
        this.$root.$data.bgcolor = "#ff8080";
        this.$root.$data.fgcolor = "white";
        this.$root.$data.grey = "white";
        this.$root.$data.route = "/posts";
        this.$root.$data.pinker = "#d14982";
},
}
</script>


<style>

.wrapper{
	overflow-y: auto;
	word-break: break-word;
	margin: auto;
	border: none;
	padding: 5px;
	width: 350px;
	height: 300px;
	border-radius: 5px;
	color: rgba(10,20,40,0);
	transition: all .3s ease;
	display: flex;
	flex-direction: column-reverse;
	background-color: white;
	-moz-box-shadow:    inset 0 0 10px rgba(0, 0, 0, 0.05);
	-webkit-box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
	box-shadow:         inset 0 0 10px rgba(0, 0, 0, 0.05);
}

.chat{
	text-align: center;
}

#drawing{
	background-color: white;
	margin: 30px;
	filter: drop-shadow(0 0 3px rgba(0, 0, 0, .2));
	
}

.comment{
	width: 80%;
	/*border: solid 1px #ddd;*/
}

.comment-text{
	padding: 5px 10px;
	width: fit-content;
	max-width: 70%;
	display: inline-block;
	color: white;
	vertical-align: middle;
	margin-top: 0;
	margin-bottom: 0;
	transition: color 100ms, transform 200ms ease-out;
}

.comment-text:hover{
  transform: translateY(-2px);
}

.comment-text:before {
  content: "";
  position: absolute;
  z-index: -1;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.08);
  -webkit-transform: scaleX(0);
  transform: scaleX(0);
  -webkit-transform-origin: 50%;
  transform-origin: 50%;
  -webkit-transition-property: transform;
  transition-property: transform;
  -webkit-transition: 100ms ease-out;
  transition: 100ms ease-out;
}

.comment-text:hover:before {
  -webkit-transform: scaleX(1);
  transform: scaleX(1);
}


.wrapper:hover{
	color: rgba(10,20,40, .4);
	-moz-box-shadow:    inset 0 0 10px var(--shadow);
	-webkit-box-shadow: inset 0 0 10px var(--shadow);
	box-shadow:         inset 0 0 10px var(--shadow);
}

.avatar-mini{
	max-width: 35px;
	max-height: 35px;
	border-radius: 35px;
	display: inline;
	vertical-align: bottom;
	margin: 0 5px;
}

.wrapper::-webkit-scrollbar,
.wrapper::-webkit-scrollbar-thumb {
  width: 12px;
  border-radius: 13px;
  background-clip: padding-box;
  border: 3px solid transparent;
}

*::-webkit-scrollbar-thumb {        
  box-shadow: inset 0 0 0 10px;
}

.write-comment{
	margin: 20px 0;
        width: 250px;
        font-size: 18px;
        border: 3px solid white;
        padding: 10px 30px;
        filter: drop-shadow(0 0 5px rgba(0,0,0,0.1));
        border-radius: 15px;
        transition: all 300ms;
	margin-right: 20px;
}

.write-comment:focus{
    outline: none !important;
    border:3px solid var(--main-color);
    filter: drop-shadow(0 0 5px rgba(0,0,0,0.1));
}

.test{
	margin: 50px;
	font-size: 30px;
	background-color: #43c7f1;
	color: white;
	border: none;
	border-radius: 40px;
	padding: 20px;
	transition: all .4s ease;
	filter: drop-shadow(0 0 5px rgba(0,0,0,0.3));
	cursor: pointer;
}

.test:hover{
	background-color:#298cab;
}

.vue-swatches__trigger{
	filter: drop-shadow(0 0 3px rgba(0,0,0,0.2));
}

input[type="color"] {
	--webkit-appearance:none;
	border: none;
	width: 42px;
	height: 42px;
	border-radius: 11px;
}
input[type="color"]::-webkit-color-swatch-wrapper {
	padding: 0;
	border-radius: 11px;
}
input[type="color"]::-webkit-color-swatch {
	border: none;
	border-radius: 11px;
}
</style>
