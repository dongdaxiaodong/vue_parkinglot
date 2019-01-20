<template>
    <div>
     <Card style="width:800px">
        <p>最短路径和路线查询</p>
        <Form rel="formValidate" :label-width="250">
            <FormItem label="起始景点:">
                <Select v-model="modelStart" style="width:200px">
        <Option v-for="node in nodes" :value="node" :key="node">{{ node }}</Option>
    </Select>
            </FormItem>
            <FormItem label="目的地景点:">
            <Select v-model="modelEnd" style="width:200px">
        <Option v-for="node in nodes" :value="node" :key="node">{{ node }}</Option>
    </Select>
            </FormItem>
            <FormItem>
                <Button @click="shortestPath">计算路径</Button>
            </FormItem>
            
        </Form>
        <div :hidden="resultDiv">
        <p>从{{startName}}到{{endName}}的最短路径长度为{{length}}</p>
         <Steps :current="10">
        <Step :title="answer" v-for="answer in answerNodes"></Step>
        
    </Steps>
        </div>
    </Card>    
    </div>    
</template>

<script>
// todo--初始应该在前端检测是否输入正确
import axios from 'axios'
export default {
    name:"ShortestFind",
    data(){
        return {
            modelStart:"",
            modelEnd:"",
            nodes:[],
            answerNodes:[],
            formValidate:{
                start:"",
                end:"",
                
            },
            startName:"",
            endName:"",
            length:"",
            resultDiv:"hidden"
            
        }
    },
    methods:{
        shortestPath(){
            const startNode=this.formValidate.start;
            const endNode=this.formValidate.end;
            const that=this;
            axios.get("http://127.0.0.1:8999/sight/shortestPath",{
                params:{
                    start:that.modelStart,
                    end:that.modelEnd
                }
            }).then(function(res){
                const route=res.data.split("*")[0];
                let path=res.data.split("*")[1];
                that.startName=that.modelStart
                that.endName=that.modelEnd
                that.length=route;
                that.answerNodes=path.split(" ");
                that.resultDiv=null;
            })
        },
        getNodesName(){
            const that=this;
            axios.get("http://127.0.0.1:8999/sight/allNames",{}).then(function(res){
                console.log(JSON.parse(res.data))
                that.nodes=JSON.parse(res.data);
            })
        }
    },
    mounted(){
        this.getNodesName()
    }
    
}
</script>
