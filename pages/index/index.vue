<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
	</view>
</template>

<script>
	import request from '@/utils/request.js'
	import uniAxios from '@/utils/uniAxios.js'
	
	export default {
		data() {
			return {
				title: 'Hello',
				data: []
			}
		},
		onLoad() {
			// request.get('https://test.api.zqili.com/app/category/list', {header: {token: '123456789'}}).then(res => {
			// 	console.log(res)
			// }).catch( err => console.log(err))
			// request('https://test.api.zqili.com/app/category/list').then(res => {
			// 	console.log(res)
			// })
			uniAxios.get('app/category/list', {headers: {token: '123456789'}, showLoading: true}).then(res => {
				console.log(res)
			}).catch( err => console.log(err))
		},
		methods: {

		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
