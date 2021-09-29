<template>
<div>
<div class="gallery">
	<div class="image" v-for="photo in photos" v-bind:key="photo._id">
		<img :src="photo.path" class="image-link" />
		<div class="photoInfo">
			<p class="photoTitle">{{photo.title}}</p>
			<p class="photoUser">{{photo.user.username}}</p>
		</div>
	
	</div>
</div>

</div>
</template>

<script>
import moment from 'moment';

export default {
	name: 'Gallery' ,
	props: {
		photos: Array
	},
	methods: {
		formatDate(date) {
			if (moment(date).diff(Date.now(), 'days') < 15)
				return moment(date).fromNow();
			else
				return moment(date).format('d MMMM YYYY');
		}
	}
}
</script>

<style scoped>
.image-link{
	width: 250px;
	height: 250px;
	border-radius: 1px;
	border: solid 1px #ddd;
	transition: 200ms;
}

.image-link:hover{
	transform: scale(1.05);
}


.image{
	width: 250px;
	display: inline-block;
	text-align: center;
	
}

.gallery{
	margin: 0 250px;
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, max-content));
	grid-gap: 50px;
	justify-content: center;
	padding: initial;
}

</style>
