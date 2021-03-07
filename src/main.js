import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'lib-flexible/flexible'//将px转rem文件
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookies from 'vue-cookies'

import {
  NavBar,
  Field,
  CellGroup,
  Button,
  Popup,
  Cell,
  Search,
  Swipe,
  SwipeItem,
  Toast,
  Tabbar,
  TabbarItem,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  Stepper,
  Card,
  Tag,
  Checkbox,
  CheckboxGroup,
  SubmitBar,
  SwipeCell,
  List,
  Empty,
  AddressList,
  AddressEdit,
  Area,
  Tab,
  Tabs,
  Form,
  Dialog 
} from 'vant';
axios.defaults.baseURL = 'http://www.kangliuyong.com:10002/'
Vue
.use(NavBar)
.use(Field)
.use(CellGroup)
.use(Button )
.use(Popup)
.use(Cell)
.use(Search)
.use(Swipe)
.use(SwipeItem)
.use(Tabbar)
.use(TabbarItem)
.use(Toast)
.use(GoodsAction)
.use(GoodsActionIcon)
.use(GoodsActionButton)
.use(Stepper)
.use(Card)
.use(Tag)
.use(Checkbox )
.use(CheckboxGroup )
.use(SubmitBar)
.use(SwipeCell)
.use(List)
.use(Empty)
.use(AddressList)
.use(AddressEdit)
.use(Area)
.use(Tab)
.use(Tabs)
.use(Form)
.use(Dialog)
  
Vue.use(VueCookies)
Vue.prototype.appkey = "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=";
  
  axios.interceptors.request.use(config => {
    if (config.method == 'post') {
    let paramsString = '';
    for (let key in config.data) {
      paramsString += `${key}=${config.data[key]}&`;
    }
    config.data = paramsString.slice(0, -1);
  }
  return config;
})

Vue.config.productionTip = false
  Vue.use(VueAxios, axios)



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
