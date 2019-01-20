
<template>
    <div class="layout">
        <Layout>
            <Header>
              <Button :size="buttonSize"  type="primary" shape="circle" @click="ManageModel=true"><Icon type="ios-person-add" />管理员登录</Button><h2>仙侠谷旅游景区导助系统</h2>
            </Header>
            <Layout>
                <Sider hide-trigger :style="{background: '#fff'}">
                    
                    <Menu active-name="0-0" theme="light" width="auto" :open-names="['1']">
                    <router-link to="/"><MenuItem name="1-0"><Icon type="ios-home" />主页</MenuItem></router-link>
                    <router-link to="/allSight"><MenuItem name="1-1"><Icon type="md-flower" />查看景区景点分布表</MenuItem></router-link>
                    <router-link to="/findSigth"><MenuItem name="1-2"><Icon type="ios-build" />景点查找与排序</MenuItem></router-link>
                    <router-link to="/shortestFind"><MenuItem name="1-3"><Icon type="md-flag" />最短路径查找</MenuItem></router-link>
                    <router-link to="/tutorMap"><MenuItem name="1-4"><Icon type="md-cart" />导游路线图</MenuItem></router-link>
                    <router-link to="/parkSystem"><MenuItem name="1-5"><Icon type="ios-car" />停车场管理系统</MenuItem></router-link>
                    <router-link to="/manageSystem" id="manage" hidden="hidden"><MenuItem name="1-6">管理员登陆</MenuItem></router-link>
                    </Menu>
                </Sider>
                <Layout :style="{padding: '0 24px 24px'}">
                  
                    <Content :style="{padding: '24px', minHeight: '540px', background: '#fff'}">
                       <router-view/>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
        <Modal
        v-model="ManageModel"
        title="管理员登陆"
        @on-ok="ok"
        @on-cancel="cancel">
        <span>输入管理员密码</span>
        <Input placeholder="输入密码" v-model="manageInput"></Input>
    </Modal>
    </div>
</template>
<script>
export default {
  data(){
    return{buttonSize: 'large',
    activeName:"",
      ManageModel:false,
      manageInput:"",
      password:20182019
    }
  },
  methods:{
    check(){
      console.log(this)
      this.activeName="w"
    },
    ok () {
      console.log(this.activeName)
          if(this.password==this.manageInput){
            this.$Message.info("登陆成功")
            document.getElementById("manage").click()  

          }
          else{
            this.$Message.info("密码错误，请重新输入")
          }
            },
            cancel () {
                this.$Message.info('Clicked cancel');
            }
  }
}
</script>

<style scoped>
h2{
  display: inline;
  color: bisque;
  margin-left: 450px;
  text-align: center;
}
.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}
.layout-logo{
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
}
.layout-nav{
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
}
</style>
