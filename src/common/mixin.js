import { debounce } from "./utils";

export const itemListenerMixin={
    data(){
        return{
            itemListener:null,
        }
    },
    mounted(){
        const refresh=debounce(this.$refs.scroll.refresh,50)

        this.itemListener=()=>{refresh();}
         this.$bus.$on('itemImageLoad',this.itemListener)  
         console.log('mixin')
    }
}