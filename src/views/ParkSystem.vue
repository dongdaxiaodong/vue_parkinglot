<template>
<div>
    <div>
        <Menu mode="horizontal" :theme="theme1" active-name="1" @on-select="getName">
        <MenuItem name="1">
            <Icon type="ios-paper" />
            停车场信息
        </MenuItem>
        <MenuItem name="2">
            <Icon type="ios-people" />
            停车
        </MenuItem>
        
        <MenuItem name="3">
            <Icon type="ios-construct" />
            出车
        </MenuItem>
    </Menu>
    </div>
    
    <Card :hidden="car.inf">
    <h3>停车场总容量:{{lv.allCapacity}}</h3>
    <h3>当前已停放车辆数:{{lv.parkingNum}}</h3>
    <Progress :percent="lv.thelv"></Progress>
    <h3>当前等候车辆数目:{{lv.waiting}}</h3>
    <Table border :columns="tableTitle" :data="tableData"></Table>
    </Card>
    <Card :hidden="car.in">
       <Form :label-width="250">
           <FormItem label="车牌号">
               <Input v-model="inputCarNum" placeholder="输入车牌号"></Input>
           </FormItem>
           <FormItem label="确认">
               <Button @click="inBut">确认</Button>
           </FormItem>
       </Form>     
    </Card>
    <Card :hidden="car.out">
        <Form>
            <FormItem label="是否需要厕所">
          <Select v-model="outCar">
            <Option v-for="td in outData" :value="td.carNumber" :key="td.carNumber">{{ td.carNumber }}</Option>
          </Select>
        </FormItem>
        <FormItem>
            <Button @click="outbut">
                出车
            </Button>
        </FormItem>
        </Form>
    </Card>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    name:"parkSystem",
    data(){
        return{
            outCar:"",
            tableTitle:[
        {
          title:"车牌号",
          key:"carid"
        },
        {
          title:"状态",
          key:"status"
        },
        {
          title:"进入时间",
          key:"start"
        },
        {
            title:"离开时间",
            key:"end"
        }
      ],
      tableData:[

      ],
      outData:"",
            inf:"hidden",
            theme1:"light",
            inputCarNum:"",
            inputCarTime:"",
            car:{
                inf:"hidden",
                in:"hidden",
                out:"hidden"
            },
            lv:{
                allCapacity:10,
                parkingNum:0,
                thelv:0,
                waiting:0
            },
            
        }
    },
    methods:{
        outbut(){
            const outCar=this.outCar
            const that=this
            const time=new Date().getTime()
            console.log(time)
            let url="http://127.0.0.1:8999/sight/outcar?name="+outCar+"&time="+time;
            axios.get(url).then(function(response){
                that.$Message.info("汽车离开车库成功！")   
                that.outCar="";       
                that.allCars()      
            })
        },
        allCars(){
            const that=this
            axios.get("http://127.0.0.1:8999/sight/allCars").then(function(response){
                console.log(JSON.parse(response.data))
                const allCars=JSON.parse(response.data)
                let settingNum=0;
                let waitingNum=0;
                    let table=[];
                let outDataarray=[]
                allCars.forEach(element => {
                    let carstatus="";
                    if(element["status"]==1){
                        carstatus="正在停车"
                        settingNum+=1
                        outDataarray.push(element)
                    }
                    else if(element["status"]==2){
                        carstatus="停车结束"
                    }
                    else{
                        carstatus="正在排队等候"
                        waitingNum+=1;
                    }
                    table.push({
                        carid:element["carNumber"],
                        status:carstatus,
                        start:element["startTime"],
                        end:element["endTime"]
                    })
                });
                that.tableData=table
                that.lv.parkingNum=settingNum;
                that.lv.waiting=waitingNum;
                console.log(settingNum)
                that.lv.thelv=(settingNum/that.lv.allCapacity)*100
                console.log(that.lv.thelv)
                that.outData=outDataarray
            })
        },
        inBut(){
            // todo--将加入停车场后的提示填入
            let carNum=this.inputCarNum
            let startTime=new Date().getTime()
            let status=""
            let endTime=""
            const that=this
            if(this.lv.parkingNum<this.lv.allCapacity){
                status=1;
                startTime=new Date().getTime()
            }
            else{
                status=3;
            }
            let url="http://127.0.0.1:8999/sight/addcar?"+"carnum="+carNum+"&status="+status+"&start="+startTime+"&endTime="+endTime
            axios.get(url).then(function(response){
                if(response.data=="1"){
                    that.$Message.info("添加成功")
                }
                else{
                    that.$Message.info("添加失败,请联系程序员处理")
                }
                that.inputCarNum="";
                that.allCars()
            })
        },
       
        getName(name){
            this.allCars()
            if(name==1){
                this.car.inf=null
                this.car.in="hidden"
                this.car.out="hidden"
                
            }
            else if(name==2){
                this.car.inf="hidden"
                this.car.in=null;
                this.car.out="hidden"
                
            }
            else{
                this.car.inf="hidden"
                this.car.in="hidden"
                this.car.out=null;
            }
        }
    },
    mounted(){
        this.getName(1)
    }
}
</script>
<style scoped>
#leftDiv{
    display: inline;
    float: left;
}
#rightDiv{
    display: inline;
    float: left;
}
</style>

