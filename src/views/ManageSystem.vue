<template>
    <div>
        <Menu mode="horizontal" :theme="theme1" active-name="1" @on-select="getName">
        <MenuItem name="1">
            <Icon type="ios-paper" />
            景点管理
        </MenuItem>
        <MenuItem name="2">
            <Icon type="ios-people" />
            路径管理
        </MenuItem>
        <MenuItem name="3">
            <Icon type="ios-stats" />
            发布消息
        </MenuItem>
    </Menu>
    <div style="width:700px" :hidden="manage.node">
        <Card class="leftDiv" style="width:400px">
            <h3>
                添加新景点
            </h3>
            <Form :model="formAdd" :label-width="100">
        <FormItem label="输入新景点名称">
            <Input v-model="formAdd.name" placeholder="Enter something..."></Input>
        </FormItem> 
        <FormItem label="输入新景点的描述信息">
            <Input v-model="formAdd.des" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem label="选择新景点的欢迎度">
            <Slider v-model="formAdd.popularity" :min="0" :max="100"></Slider>
        </FormItem>
        <FormItem label="选择是否有休息区">
            <i-switch v-model="formAdd.leisure" ></i-switch>
        </FormItem>
        <FormItem label="选择是否有厕所">
         <i-switch v-model="formAdd.toilet"></i-switch>
            </FormItem>
            <FormItem label="选择新景点岔路数">
                <Slider v-model="formAdd.turn" :min="0" :max="20"></Slider>
            </FormItem>
        </Form>
        <Button :size="buttonSize"  type="primary" shape="circle" @click="nodeAdd">
            <Icon type="md-add" />
        </Button>
        </Card>
        <Card class="rightDiv" style="width:300px">
            <h3>
                删除旧节点
            </h3>
            <Form>
                <FormItem label="选择要删除的景点名称">
                     <Select v-model="nodeDelete.name">
            <Option v-for="node in nodeList" :value="node" :key="node">{{ node }}</Option>
          </Select>
                </FormItem>
                <FormItem label="输入该景点名称">
                    <Input v-model="nodeDelete.checkName" placeholder="一旦删除无法恢复"></Input>
                </FormItem>
                <FormItem>
                    <Button type="error" @click="nodedelete">确认删除</Button>
                </FormItem>
            </Form>

        </Card>
    </div>
    <div style="width:700px" :hidden="manage.path">
        <Card class="leftDiv" style="width:400px">
            <h3>
                添加或更新路径
            </h3>
            <p>注意:如果两景区间路径长度为0，则说明两景区间没有路径</p><br>
            <Form>
                <FormItem label="选择一个景区(两景区间顺序随意)">
 <Select v-model="pathUploadStart">
            <Option v-for="node in nodeList" :value="node" :key="node">{{ node }}</Option>
          </Select>
                </FormItem>
                
                <FormItem label="选择另一个景区">
 <Select v-model="pathUploadEnd">
            <Option v-for="node in nodeList" :value="node" :key="node">{{ node }}</Option>
          </Select>
                </FormItem>
                <FormItem label="两景区间路径(为0则两者间没有路)">
                    <Input :disabled="path.dis" v-model="path.len"></Input>
                    <Button @click="pathCheck" :type="path.buttype">{{path.but}}</Button>
                </FormItem>
            </Form>
        </Card>
        <Card class="rightDiv" style="width:300px">
            <h3>
                删除路径
            </h3>
            <Form>
                <FormItem label="选择一个景区(两景区间顺序随意)">
 <Select v-model="pathDeleteStart">
            <Option v-for="node in nodeList" :value="node" :key="node">{{ node }}</Option>
          </Select>
                </FormItem>
                
                <FormItem label="选择另一个景区">
 <Select v-model="pathDeleteEnd">
            <Option v-for="node in nodeList" :value="node" :key="node">{{ node }}</Option>
          </Select>
                </FormItem>
                <Button @click="deletePath" type="error">删除!</Button>
            </Form>
        </Card>
    </div>
    <div style="width:700px" :hidden="manage.inf">
        <Card style="500px">
       
           <Form>
               <FormItem label="输入新通告">
                   <Input placeholder="新通告" v-model="tip" type="textarea"></Input>
               </FormItem>
           </Form>
           <Form>
               <FormItem label="选择时间">
                   <Row>
        <Col span="12">
            <DatePicker type="date" placeholder="Select date" style="width: 200px" format="yyyy-MM-dd HH:mm:ss" v-model="myDate"></DatePicker>
        </Col>
    </Row>
    </FormItem>
    <FormItem>
        <Button type="success" @click="serveTip">确认添加</Button>
    </FormItem>
           </Form>
        </Card>
    </div>
    </div>
</template>

<script>
import axios from 'axios'


export default {
    name:"ManageSystem",
    data(){
        return{
            tip:"",
            myDate:"",
            pathDeleteStart:"",
            pathDeleteEnd:"",
            path:{
                len:"未选择起始和结束点",
                but:"添加或修改路径",
                dis:true,
                buttype:"info",
                oldLen:""
            },
            nodePathList:[],
            pathUploadStart:"",
            pathUploadEnd:"",
            nodeDelete:{
                    name:"",
                    checkName:""
            },
            nodeList:[],
            buttonSize:"large",
            theme1:"light",
            manage:{
                node:null,
                path:"hidden",
                inf:"hidden"
            },
            formAdd:{
                name:"",
                des:"",
                popularity:20,
                leisure:true,
                toilet:true,
                turn:8,
            }
        }
    },
    methods:{
        pathCheck(){
            if(this.path.but.length==7){
            this.path.dis=null;
            this.path.but="提交添加的路径或修改的路径"
            this.path.buttype="success"
            }
            else{
                const start=this.pathUploadStart
                const end=this.pathUploadEnd
                const newWeight=this.path.len;
                const oldWeight=this.path.oldLen
                const that=this;
                let url="http://127.0.0.1:8999/manage/uploadPath?"+"start="+start+"&end="+end+"&oldWeight="+oldWeight+"&newWeight="+newWeight;
                axios.get(url).then(function(response){
                        if(response.data=="1"){
                            that.$Message.info("添加路径成功");
                        }
                        else{
                            that.$Message.info("修改路径长度成功");
                        }
                        that.path.len="未选择起始和结束点"
                        that.path.but="添加或修改路径"
                        that.path.dis=true;
                        that.path.buttype="info"
                        that.path.oldLen=""
                        that.pathUploadStart=""
                        that.pathUploadEnd=""
                        that.getNodePath()
                })
            }

        },
        serveTip(){
            const title=this.tip
            const date=new Date().toLocaleString()
            let url="http://127.0.0.1:8999/manage/saveTip?"+"title="+title+"&date="+date
            axios.get(url).then(function(response){
                this.$Message.info("添加新通知成功")
            })
        },
        nodedelete(){
            if(this.nodeDelete.name!=this.nodeDelete.checkName || this.nodeDelete.name=="" ||this.nodeDelete.checkName==""){
                this.$Message.info("请确认清楚将要删除的景点")
            }
            else{
                const deleteNode=this.nodeDelete.name;
                let url="http://127.0.0.1:8999/manage/deleteSight?"+"name="+deleteNode;
                axios.get(url).then(function(response){
                    this.nodeDelete.name=""
                    this.nodeDelete.checkName=""
                    this.$Message.info("删除成功");

                })
            }
        },
        nodeAdd(){
            const newNodeName=this.formAdd.name;
            const newNodeDes=this.formAdd.des;
            const newNodesPopularity=this.formAdd.popularity;
            const leisure=(this.formAdd.leisure==true)?"1":"0"
            const toilet=(this.formAdd.toilet==true)?"1":"0"
            const turn =this.formAdd.turn
            const that=this;
            let url="http://127.0.0.1:8999/manage/addSight?"+"name="+newNodeName+"&des="+newNodeDes+"&popularity="+newNodesPopularity+
            "&leisure="+leisure+"&toilet="+toilet+"&turn="+turn
            axios.get(url).then(function(response){
                that.formAdd.name="";
                that.formAdd.des="";
                that.formAdd.popularity=0;
                that.getAllNodesName()
                if(response.data==1){
                   that.$Message.info('添加成功')
                }
                else{
                    that.$Message.info("添加失败，请联系程序员修复后台bug")
                }
            })
        },
        getName(name){
        if(name==1){
            this.manage.node=null;
            this.manage.path="hidden";
            this.manage.inf="hidden"
        }
        else if(name==2){
            this.manage.node="hidden"
            this.manage.path=null;
            this.manage.inf="hidden"
        }
        else{
            this.manage.node="hidden"
            this.manage.path="hidden"
            this.manage.inf=null;
        }
        },
        getAllNodesName(){
            const that=this;
             axios.get("http://127.0.0.1:8999/sight/allNames",{}).then(function(res){
                
                that.nodeList=JSON.parse(res.data);
            })
        },
        deletePath(){
                this.$Message.info("删除成功")
                this.pathDeleteStart=""
                this.pathDeleteEnd=""
        },
        getNodePath(){
            const that=this
            axios.get("http://127.0.0.1:8999/sight/allPath").then(function(res){
                that.nodePathList=JSON.parse(res.data);
            })
        }
    },
    mounted(){
        this.getAllNodesName()
        this.getNodePath()
    },
    watch:{
        pathUploadEnd(val){
            const start=this.pathUploadStart;
            const end=this.pathUploadEnd;
            const that=this;
            let check=0
            this.nodePathList.forEach(element=>{
                const weight=element["weigthValue"]
                const pathWords=element["startNode"]+" "+element["endNode"]
                if(pathWords.indexOf(start)>=0 && pathWords.indexOf(end)>=0){
                        this.path["len"]=weight;
                        check=1;
                }
            })
            if(check==0){
                that.path.len=0;
            }
            this.path.oldLen=this.path.len;
        }
    }
}
</script>
<style scoped>
.leftDiv{
    display: inline;
    float: left;
}
.rightDiv{
    display: inline;
    float: left;
}
</style>

