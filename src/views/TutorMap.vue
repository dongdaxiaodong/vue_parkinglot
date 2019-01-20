<template>
    <div>
       <h3>
           导游路线图
       </h3>
       <Form>
           <FormItem label="选择起始点">
               <Select v-model="modelStart" style="width:300px">
        <Option v-for="node in nodes" :value="node" :key="node">{{ node }}</Option>
    </Select>
           </FormItem>
           <FormItem label="确定按钮">
               <Button @click="tutor">确定</Button>
           </FormItem>
       </Form> 
       <div :hidden="resultDiv">
        <p>起点为{{modelStart}}的导游路线为</p>
         <Steps :current="16">
        <Step :title="answer" v-for="answer in answerNodes"></Step>
        
    </Steps>
        </div>
       

        
    </div>
</template>
<script>
import axios from 'axios'
export default {
    name:"TutorMap",
    data(){
        return {
            resultDiv:"hidden",
            modelStart:"",
            nodes:[],
            answerNodes:[]
        }
    },
    methods:{
        tutor(){
            const start=this.modelStart;
            const that=this
            let url="http://127.0.0.1:8999/sight/hami?start="+start
            axios.get(url).then(function(res){
                const tutorData=JSON.parse(res.data);
                that.answerNodes=tutorData;
                that.resultDiv=null;
                console.log(tutorData)
            })
        },
        getNodesName(){
            const that=this;
            axios.get("http://127.0.0.1:8999/sight/allNames",{}).then(function(res){
                that.nodes=JSON.parse(res.data);
            })
        }
    },
    mounted(){
        this.getNodesName()
    }
}
</script>
