<template>
  <div class="allSight">
    <Table border :columns="tableTitle" :data="tableData"></Table>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: "allSight",
  data(){
    return {
      tableTitle:[
        {
          title:"景点序号",
          key:"index"
        },
        {
          title:"景点名称",
          key:"name"
        },
        {
          title:"相邻节点及相应距离",
          key:"nearby"
        }
      ],
      tableData:[

      ]
    }
  },
  methods:{
    getInformation(){
      let that=this;
      axios.get("http://127.0.0.1:8999/sight/all",{
      }).then(function(response){
          const returnedData=JSON.parse(response.data);
          // 现在整理节点--(如何?) 
          let havedSight=[]
          let temSight=[]
          let sightindex=1;
          // let oldFirst=returnedData[0].startNode
          // console.log(oldFirst.length)
          // let newFirst=oldFirst.substring(1,oldFirst.length)
          // console.log(newFirst)
          // returnedData[0].startNode=newFirst;
          returnedData.forEach(element=> {
            const startNode=element["startNode"];
            const endNode=element["endNode"];
            const weight=element["weigthValue"];
            console.log("北门"=="北门")
            if(havedSight.length===0 || havedSight.indexOf(startNode)<0){
                temSight.push({index:sightindex,name:startNode,nearby:endNode+"("+weight+")   "})
                havedSight.push(startNode)
                sightindex+=1;
            }
            else{
              temSight.forEach(element=>{
                if(element["name"]===startNode){
                  element["nearby"]=element["nearby"]+endNode+"("+weight+")  "
                }
              })
            }
          });
          that.tableData=temSight
      }).catch(function(error){
        console.log(error)
      })
    }
  },
  mounted(){
    this.getInformation()
  }
};

</script>
<style scoped>
.allSight{
  
}
</style>
