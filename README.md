# Airctl

软工大作业后端后台。

### Installation

```shell script
yarn install
yarn run build
```

编译好的代码在`dist`文件夹中。请使用文件服务器将该文件夹发布到网络服务中。

### Development Feature

```shell script
yarn install
yarn run dev
```

此时可以直接通过浏览器打开`http://localhost:8080`访问后台页面。


### Help Read the Codes

目录说明：
+ .githooks: 用于git管理
+ build: webpack部署配置文件
+ config: 项目常规配置
+ src:
  + index.tsx: 入口文件
  + index.html: HTML入口（index.tsx编译之后插入该文件）
  + locale.ts: index.tsx的辅助文件（初始化国际化Feature）
  + component: 公共组件
    + form/index.tsx: 自己写的方便使用的Form组件
    + layout/main-layout.tsx: 布局高阶组件
    + notify/index.tsx: 全局警告弹窗
  + context: 全局上下文
  + dependency: 外部依赖
    + x-service-concept.ts: 后端服务接口
  + language: 国际化支持
  + lib: 公共库函数
  + mock: 模拟数据（已弃用）
  + service: 模拟Service/远程Service/Service全局类型和属性定义
  + view: 路由按目录组织，包含所有页面代码。路由数据请阅读`*/router.tsx`
  
### 使用提示

+ admin-token由后端文件定义
+ 右上角可切换语言

### Bug Report

Please Contact camiyoru@gmail.com, Myriad-Dreamin
