<template>
<div class="posts">
	<gallery :photos="photos" />
	<p v-if="error">{{error}}</p>	
</div>
</template>

<script>
// @ is an alias to /src
import Gallery from '@/components/Gallery.vue';
export default {
name: 'Posts',
components: {
	Gallery,
},
data() {
	return {
		photos: [{"_id":"60d29a59251be5f7028d6568","user":{"_id":"60d2994c251be5f7028d6564","firstName":"asdf","lastName":"adfsa","username":"sour","__v":0},"path":"/images/5a4e356e6b04818de461c8199f21c646","title":"ye","description":"","created":"2021-06-23T02:20:09.575Z","__v":0},{"_id":"60d29a4e251be5f7028d6567","user":{"_id":"60d2994c251be5f7028d6564","firstName":"asdf","lastName":"adfsa","username":"sour","__v":0},"path":"/images/d9aa3b3fcb781e34e10fa86cdc38d8b3","title":"main","description":"","created":"2021-06-23T02:19:58.564Z","__v":0},{"_id":"60d299b2251be5f7028d6566","user":{"_id":"60d2994c251be5f7028d6564","firstName":"asdf","lastName":"adfsa","username":"sour","__v":0},"path":"/images/9c9c33942afcc2c38ec7a0140aab5f61","title":"dylan","description":"","created":"2021-06-23T02:17:22.448Z","__v":0},{"_id":"60d29987251be5f7028d6565","user":{"_id":"60d2994c251be5f7028d6564","firstName":"asdf","lastName":"adfsa","username":"sour","__v":0},"path":"/images/4f99c3d2d53eca5daee8c8ba22377d58","title":"ryan","description":"","created":"2021-06-23T02:16:39.220Z","__v":0},{"_id":"60726c813dfbac354e11373d","user":{"_id":"607267b156e3442baf50ad45","firstName":"josh","lastName":"taylor","username":"joshbt","__v":0},"path":"/images/eee252b013008a2b06a0498dfeebd393","title":"rock in my shoe","description":"photo","created":"2021-04-11T03:26:57.801Z","__v":0}],
		error: '',
	}
},
created() {
	this.$root.$data.bgcolor = "#ff8080";
	this.$root.$data.fgcolor = "white";
	this.$root.$data.grey = "white";
	this.$root.$data.route = "/posts";
	this.$root.$data.pinker = "#d14982";
},
methods: {
}
}
</script>

<style scoped>



.posts{
	padding-top: 50px;
}




</style>
