import Vue from 'vue'
import {
  Button,
  Message,
  MessageBox,
  Row,
  Col,
  Form,
  FormItem,
  Input,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Menu,
  MenuItem,
  Submenu,
  Breadcrumb,
  BreadcrumbItem,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Table,
  TableColumn,
  Pagination,
  Dialog,
  InputNumber,
  Select,
  Option,
  Tree,
  Radio,
  Descriptions,
  DescriptionsItem,
  Checkbox,
  Cascader,
  Loading,
  Divider,
  Link
} from 'element-ui'

Vue.use(Button)
Vue.use(Row)
Vue.use(Col)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(InputNumber)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tree)
Vue.use(Radio)
Vue.use(Descriptions)
Vue.use(DescriptionsItem)
Vue.use(Checkbox)
Vue.use(Cascader)
Vue.use(Loading.directive)
Vue.use(Divider)
Vue.use(Link)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$alert = MessageBox.alert
