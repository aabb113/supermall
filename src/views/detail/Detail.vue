<template>
  <div id="detail">
    <detail-nav-bar @titleClick="titleClick" ref="nav"></detail-nav-bar>
    <scroll class="content" ref="scroll" @scroll="contentScroll" :probeType="3" >
    <detail-swiper :topImages="topImages"></detail-swiper>
    <detail-base-info :goods="goods"></detail-base-info>
    <detail-shop-info :shop="shop"></detail-shop-info>
    <detail-goods-info :detail-info="detailInfo" @imgLoad="imageLoad"></detail-goods-info>
    <detail-params-info ref="param" :param-info="paramInfo"></detail-params-info>
    <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
    <good-list ref="recommend" :goods="recommend"></good-list>
    </scroll>
    <detail-bottom-bar></detail-bottom-bar>
  </div>
</template>

<script>
import DetailNavBar from '../detail/childComps/DetailNavBar.vue';
import DetailSwiper from './childComps/DetailSwiper.vue';
import DetailBaseInfo from "./childComps/DetailBaseInfo.vue";
import DetailShopInfo from "./childComps/DetailShopInfo.vue";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo.vue";
import DetailParamsInfo from "./childComps/DetailParamsInfo.vue";
import DetailCommentInfo from "./childComps/DetailCommentInfo.vue";
import GoodList from 'components/content/goods/GoodsList'
import DetailBottomBar from "./childComps/DetailBottomBar.vue";


import Scroll from 'components/common/scroll/Scroll'

import { getDetail,Goods,Shop,GoodsParam,getRecommend } from "network/detail.js";
import { itemListenerMixin } from "../../common/mixin";
import { debounce } from "../../common/utils";

export default {
    components: { 
        DetailNavBar, 
        DetailSwiper,
        DetailBaseInfo,
        DetailShopInfo, 
        Scroll,
        DetailGoodsInfo,
        DetailParamsInfo,
        DetailCommentInfo,
        GoodList,
        DetailBottomBar,

    },
    name:"Detail",
    mixins:[itemListenerMixin],
    data(){
        return{
            iid:null,
            topImages:[],
            goods:{},
            shop:{},
            detailInfo:{},
            paramInfo:{},
            commentInfo:{},
            recommend:[],
            themeTopY:[0,1111],
            getThemeTopY:null,
            currentIndex: 0,
        }
    },
    created(){
        //???????????????iid
        this.iid=this.$route.params.iid
        //??????iid??????????????????
        
        getDetail(this.iid).then(res=>{
            const data=res.result
            this.topImages=data.itemInfo.topImages 
            console.log(res);
            //??????????????????
            this.goods=new Goods(data.itemInfo,data.columns,data.shopInfo.services)
            //????????????????????????
            this.shop=new Shop(data.shopInfo)
            //????????????????????????
            this.detailInfo=data.detailInfo
            //??????????????????
            this.paramInfo=new GoodsParam(data.itemParams.info,data.itemParams.rule)
            //??????????????????
            if (data.rate.cRate!==0) {
                this.commentInfo=data.rate.list[0]
            }
        })

        
        //?????????????????????
        getRecommend().then(res=>{
            console.log(res);
            this.recommend=res.data.list
        })

        this.getThemeTopY=debounce(()=>{
            this.themeTopY=[]
            this.themeTopY.push(0)
            this.themeTopY.push(this.$refs.param.$el.offsetTop)
            this.themeTopY.push(this.$refs.comment.$el.offsetTop)
            this.themeTopY.push(this.$refs.recommend.$el.offsetTop)
            this.themeTopY.push(Number.MAX_VALUE)
            console.log(11111);
        },100)

    },
    methods:{
        imageLoad(){
            this.$refs.scroll.refresh();
            this.getThemeTopY();
        },
        titleClick(index){
            console.log(this.themeTopY);
            this.$refs.scroll.scrollTo(0,-this.themeTopY[index],0)
        },
        contentScroll(position){
            this.isShowBackTop = (-position.y) > 500;
				const positionY = -(position.y);
				let _lenth = this.themeTopY.length;
				for(let i=0; i<_lenth-1; i++){
					if(this.currentIndex !== i && (positionY >= this.themeTopY[i] && positionY < this.themeTopY[i+1])){
						this.currentIndex = i;
						this.$refs.nav.currentIndex = this.currentIndex;
					}
				}
        },
    },
    destroyed(){
        this.$bus.$off('itemImgLoad',this.itemListener)
    },
}
</script>

<style scoped>
#detail{
    position: relative;
    z-index: 10;
    background-color: #fff;
    height: 100vh;
}
.content {
    overflow: hidden; 
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

</style>