## wei-admin

基于用户角色权限（RBAC）控制 + 前后端完全分离的后台管理系统 。

项目使用@vue-cli构建，Vue2.6.11 + Element-ui2.15.7组合。

项目使用说明：

1. 安装

   ```shell
   npm install
   ```

2. 打开.env.development、.env.production文件，填写接口地址和资源地址

3. 打开src/settings.js文件，完成基础配置

4. 使用lint检查

   ```shell
   npm run lint
   ```

5. 运行服务命令

   ```shell
   npm run serve
   ```

6. 打包生产环境

   ```shell
   npm run build
   ```

特别备注：需配合 [wei-admin-api](https://github.com/lajixiaohao/wei-admin-api) 接口项目使用

演示地址：http://weiadmin.weifx.top/

QQ群：257439358