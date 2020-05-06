# 前言
很多公司稍微复杂一点的业务，基本上都需要后台管理系统，来对业务进行各个维度的统计、对公司人员管理等等，这些后台管理系统都有一个基础的共性，就是对登录用户的管理，对用户角色的管理，对登录用户的操作权限的管理等，所以此项目就将这部分作为一个基础功能编写出来作为一个通用后台管理系统（common management system），为各种后台管理系统提供一个基础的版本框架，使企业能快速的开发自己的业务模块，而非重新从零开始搭建编写这种基础性的功能。整个项目是完全前后端分离，分为两个部分，前端使用vue编写（对应仓库中的cmms-vue），后端使用springboot编写（对应仓库中的cmms）。
# cmms-vue简介
通用后台管理系统(cmms)，采用灵活的菜单配置，及角色权限配置和用户管理，管理员可以自由的分类菜单，自由的配置菜单的结构和层级关系，为不同的角色定制不同的菜单权限，使得拥有相应角色的用户登录后，所见的菜单是不同的，从而实现用户的权限管理。cmms-vue为通用后台管理系统对应的前端，用vue编写；此项目作为一个后台管理系统，只编写了系统管理相关的业务逻辑，不同公司可根据自己的具体业务，灵活添加相应的业务模块进行二次开发，与仓库中的cmms服务端搭配使用。
# 项目部分截图
[查看这篇博客](https://www.cnblogs.com/littleorange7/p/12837438.html)
# 技术
> vue-cli、vue-router、vuex、axios、elementUI。

# 部署和启动

## Build Setup

``` bash
# 安装依赖
npm install

# 依赖安装成功后，启动
npm run dev

# 部署的时候打包命令
npm run build

# build时生成分析报告进行性能优化
npm run build --report

# 单元测试
npm run unit

# e2e测试
npm run e2e

# 运行所有的测试
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
