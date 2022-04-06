<template>
  <div>
    <ol>
      <li><b>页面按钮级菜单：</b>指在二级菜单（一级菜单无效）页面内通过路由跳转到新页面的按钮或其他链接的菜单，其权限跟着它的上级菜单（二级菜单）走</li>
      <li>请为需要请求接口数据的二级菜单添加权限，否则除超级管理员外，其余管理员将不能正常使用相关功能</li>
      <li>添加菜单（包含页面按钮级菜单）时，务必正确填写组件名称，与Vue组件名称“name”一一对应</li>
      <li>添加菜单（包含页面按钮级菜单）时，页面路径或组件路径需要设计多层时，务必使用“/”分隔符，其中页面路径必须以“/”开头</li>
      <li>添加权限时，权限标识不能包含“/”符号，用“:”代替，例如：api:menu:list，对应接口地址：/api/menu/list</li>
      <li>超级管理员请勿将“菜单管理”权限分配给下级任一管理员</li>
      <li>动态页面内容，组件应设置为不缓存，参数使用“?”传输，如：/demo?id=1</li>
      <li>菜单图标请使用svg格式的文件</li>
    </ol>
  </div>
</template>

<script>
export default {
  name: 'MenuInstruction'
}
</script>

<style scoped>
  ol li {
    font-size: 14px;
    color: #666666;
    margin-bottom: 10px;
  }
</style>
