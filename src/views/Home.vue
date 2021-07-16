<template>
  <div class="home">
	<div class="banner unselectable">
		<br>
		<h1 id="sour-big">sour</h1>
		<br>
		<div class="banner-img">
		<img src="banner.png"/>
		</div>
		<h1 id="chat-big">chat</h1>
		<br>
		<button @click="newChat" class="new-chat">new chat</button>
	</div>
	
  </div>
</template>

<script>
// @ is an alias to /src
export default {
name: 'Home',
methods: {
	newChat(){
		this.$parent.create();
	},
},
created: function() {
	this.$root.$data.bgcolor = 'white'
	this.$root.$data.fgcolor = '#ff8080'
	this.$root.$data.grey = 'rgba(0,0,0,.5)';
	this.$root.$data.route = '/';
	this.$root.$data.pinker = "rgba(1,1,1,0)";
}
}
</script>

<style scoped>

:root{
	--shadow: rgba(0,0,0,.2);
	
	--drop-shadow: drop-shadow(-40px 40px 0 var(--shadow));
}


.home{
	height: 100%;
	background: rgb(255,119,135);
	background: linear-gradient(28deg, rgba(255,119,135,1) 0%, rgba(255,188,132,1) 100%);
}


.banner{
	margin: 0;
	text-align: center;
}

.banner-img{
	height: 300px;
	width: 300px;
	margin-left: auto;
	margin-right: auto;
	background-color: white;
	filter: drop-shadow(-40px 40px 0 var(--shadow));
	transition: transform 300ms, filter 300ms;
}

.banner-img img{
	border-radius: 5px;
}

.banner-img:hover{
	transform: translateY(-2px);
	filter: drop-shadow(-40px 42px 0 var(--shadow));
}

h1#chat-big, h1#sour-big{
	margin: 0;
	display: inline-block;
	color: #ffeb84;
	position: relative;
	z-index: 100;
	font-family: "Itim", sans-serif;
	font-weight: normal;
	font-size: 160px;
	transition: transform 300ms;
}

#sour-big{
	transform: translate(-150px, 70px);
}
#sour-big:hover{
	transform: translate(-150px, 67px);
}

#chat-big{
	transform: translate(150px, -70px);
}
#chat-big:hover{
	transform: translate(150px, -73px);
}

.new-chat{
	background-color: white;
	color: #ff8080;
	border: none;
	font-size: 25pt;
	border-radius: 50px;
	font-family: "Open sans", sans-serif;
	padding: 20px 60px;
	border: solid white 4px;
	filter: drop-shadow(0 0 4px var(--shadow));
	transition: color 300ms, background-color 300ms, filter 300ms;
}

.new-chat:hover{
	cursor: pointer;
	filter: drop-shadow(0 0 8px rgba(0,0,0,.4));
}

</style>
