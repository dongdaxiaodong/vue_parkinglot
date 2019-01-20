<template>
  <div>
    <Card class="findSight">
      <h3>查找景点</h3>
     <Form ref="formInline" :label-width="50" class="form" inline>
        <FormItem label="1.名称">
          <Input v-model="formValidate.name" placeholder="非必填"></Input>
        </FormItem>
        <FormItem label="2.描述">
          <Input v-model="formValidate.dec" placeholder="非必填，填入部分描述即可"></Input>
        </FormItem>
        <FormItem label="是否需要休息区">
          <Select v-model="formValidate.leisure">
            <Option value="yes">需要</Option>
            <Option value="no">不需要</Option>
            <Option value="either">均可</Option>
          </Select>
        </FormItem>
        <FormItem label="是否需要厕所">
          <Select v-model="formValidate.toilet">
            <Option value="yes">需要</Option>
            <Option value="no">不需要</Option>
            <Option value="either">均可</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="success" @click="findSight">搜索</Button>
        </FormItem>
    </Form>
    </Card>
    <Card class="rightCard">
      <h3>查找结果</h3>
      <Dropdown  trigger="click">
        <Button href="javascript:void(0)" type="primary">
            选择排序方式
            <Icon type="ios-arrow-down"></Icon>
        </Button>
        <DropdownMenu slot="list">
            <DropdownItem><Button @click="toPopularity">按照欢迎度高低进行排序</Button></DropdownItem>
            <DropdownItem><Button @click="toTurn">按照岔路树高低进行排序</Button></DropdownItem>
        </DropdownMenu>
    </Dropdown>
      <Table border :columns="resultTitle" :data="tableData"></Table>
    </Card>
  </div>
  
</template>

<script>
// @ is an alias to /src
// import findSightCom from "@/components/findSightCom.vue";
import axios from 'axios'
export default {
  name: "FindSight",
  data(){
    return {
      sortKey:1,
      resultTitle:[
        {
          title:"景点序号",
          key:"index"
        },
        {
          title:"景点名称",
          key:"name"
        },
        {
          title:"景点介绍",
          key:"des"
        },
        {
          title:"是否有休闲区",
          key:"leisure"
        },
        {
          title:"是否有厕所",
          key:"toilet"
        },
        {
          title:"景点欢迎度",
          key:"popularity"
        },
        {
          title:"景点岔路数量",
          key:"turn"
        }
      ],
      tableData:[],
      formValidate:{
        name:"",
        dec:"",
        leisure:"",
        toilet:""
      },
      sightInformation:null
    }
  },
  methods:{
    submit(){
      this.subDiv=null;
    },
    toPopularity(){
      console.log("ooookkk")
      this.sortKey=1
      this.findSight()
    },
    toTurn(){
      this.sortKey=2
      this.findSight()
    },
    findSight(){
      if(this.sightInformation!==null){
        const filterLeisure=this.filterByLeisure();

        const filterName=this.filterByName()
        const filterDes=this.filterByDes()
        const filterToilet=this.filterByToilet();
        
        let answerArray=[]
        const copySight=this.sightInformation;
        if(!copySight){
          return;
        }
        for(let i=0;i<copySight.length;i+=1){
           if(filterName.indexOf(copySight[i])>=0 && filterDes.indexOf(copySight[i])>=0 && filterLeisure.indexOf(copySight[i])>=0 && filterToilet.indexOf(copySight[i])>=0){
            answerArray.push(copySight[i]);
          }
        }
        if(this.sortKey===1){
// 按受欢迎程度
        answerArray.sort(this.sortByProperty("popularity"))
        console.log("yes")
        console.log(answerArray)

        }
        else{
          answerArray.sort(this.sortByProperty("turnstiles"))
          console.log(answerArray)
        }
        let index=1;
          this.tableData=[]
        answerArray.forEach(element=>{
          this.tableData.push({
            index:index,
            name:element["sceneName"],
            des:element["description"],
            leisure:(element["hasLeisure"]===true)?"有休息区":"没有休息区",
            toilet:(element["hasToilet"]===true)?"有厕所":"没厕所",
            popularity:element["popularity"],
            turn:element["turnstiles"]
          })
          index+=1;
        })
      }
      else{
        // 否则就请求
        let that=this;
        axios.get("http://127.0.0.1:8999/sight/findSight")
        .then(function(response){
          that.sightInformation=JSON.parse(response.data);
          that.findSight()
        })
      }
    },
    sortByProperty(property){
        function sortfun(obj1,obj2){
          if (obj1[property] < obj2[property]) return 1
          else if (obj1[property] > obj2[property]) return -1
          else if (obj1[property] == obj2[property]) return 0
        }
        return sortfun
    },
    filterByName(){
      let copySightInf=this.sightInformation;
      if(this.formValidate.name===""){
        return copySightInf;
      }
      else{
        let filterNameSight=[];
        copySightInf.forEach(element => {
          if(element["sceneName"].indexOf(this.formValidate.name)>=0){
            filterNameSight.push(element);
          }
        });
        return filterNameSight;
      }
    },
    filterByDes(){
      let copySightInf=this.sightInformation;
      if(this.formValidate.dec===""){
        return copySightInf;
      }
      else{
        let filterDocSight=[]
        copySightInf.forEach(element=>{
          if(element["description"].indexOf(this.formValidate.dec)>=0){
            filterDocSight.push(element);
          }
        })
        return filterDocSight;
      }
    },
    filterByLeisure(){
      let copySightInf=this.sightInformation;
      if(this.formValidate.leisure==="either" || this.formValidate.leisure===""){
        return copySightInf;
      }
      else{
        let filterLeisureSight=[]
        const need=this.formValidate.leisure;
        copySightInf.forEach(element=>{
          if(need==="yes"){
            if(element["hasLeisure"]===true){
            filterLeisureSight.push(element);
          }}
          else{
            if(element["hasLeisure"]===false){
            filterLeisureSight.push(element);
          }
          }
          }
          
        )
        return filterLeisureSight;
      }
    },
    filterByToilet(){
      let copySightInf=this.sightInformation;
      if(this.formValidate.toilet==="either" || this.formValidate.toilet===""){
        return copySightInf;
      }
      else{
        let filterToiletSight=[]
        const need=this.formValidate.toilet;
        copySightInf.forEach(element=>{
          if(need==="yes"){   
          if(element["hasToilet"]===true){
            filterToiletSight.push(element);
          }
          }
          else if(need==="no"){
            
          if(element["hasToilet"]===false){
            filterToiletSight.push(element);
          }
          }
        })
        return filterToiletSight;
      }
    }
  }
};
</script>
<style scoped>
/* .findSight{
  display: inline;
  float:left;
} */
/* .form{
  float: left;
} */
/* .rightCard{
  display: inline;
  float: left;

} */
</style>

