import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import AllSight from "./views/AllSight.vue"
import FindSight from "./views/FindSight.vue"
import ShortestFind from "./views/ShortestFind.vue"
import ParkSystem from "./views/ParkSystem.vue"
import ManageSystem from "./views/ManageSystem.vue"
import TutorMap from "./views/TutorMap.vue"
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path:"/allSight",
      name:"allSight",
      component:AllSight
    },
    {
      path:"/findSigth",
      name:"findSight",
      component:FindSight
    },
    {
      path:"/shortestFind",
      name:"shortestFind",
      component:ShortestFind
    },
    {
      path:"/parkSystem",
      name:"parkSystem",
      component:ParkSystem
    },
    {
      path:"/manageSystem",
      name:"manageSystem",
      component:ManageSystem
    },
    {
      path:"/tutorMap",
      name:"tutorMap",
      component:TutorMap
    }
  ]
});
