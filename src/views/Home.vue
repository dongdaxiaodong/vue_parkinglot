<template>
    <div  style="background:#eee;padding: 20px">
 <Card :bordered="false" class="indexCard" style="width:950px"  id="topCard">
     <h3>
          欢迎使用仙侠谷旅游景区管理系统
       </h3>  
       <p>仙侠谷旅游景区坐落于美丽富饶的辽宁省沈阳市浑南区</p>
       <p>本景区风景秀丽，环境优美，有北门，狮子山等景点近20处，是你休闲放松的好去处</p>
    </Card>

     <Card style="width:950px">
       <h3>
           景区消息通知
       </h3>
       <div>
           <p  class="intro-feature-title" v-for="tip in tips">
            <span>{{tip.index}}.</span>   <span class="rightSpan">{{tip.des}}</span><span>{{tip.time}}</span>
           </p> 
           </div>
        
    </Card>
      
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name:"Home",
    data(){
        return{
            tips:[
                
            ]
        }
    },
    methods:{
        getTips(){
            console.log(this)
            const that=this
            axios.get("http://127.0.0.1:8999/sight/getTips",{}).then(function(response){
                const results=JSON.parse(response.data);
                console.log(results)
                console.log(results[0])
                let i=1;
                results.forEach(element => {
                    that.tips.push({
                        index:i,
                        des:element["title"],
                        time:element["time"]
                    })
                    i+=1;
                });
            })
        }
    },
    mounted(){
       this.getTips()
    }
}
</script>
<style scoped>
.rightSpan{
    margin-right: 20px;
}
#topCard{
    margin-bottom: 50px;
}
h3{
    font-size: 22px;
    margin-bottom: 18px;

}
p{
    margin-bottom: 7px;
}
.intro-feature-title{
    color: #0e83cd;
    font-family: Lato,"Helvetica Neue",Helvetica,Arial,sans-serif;
    font-size: 18px;
}
.indexCard,{
    margin-bottom: 30px;
    margin-left: 120px;
}
</style>

