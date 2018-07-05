# otc.coinex.com

## 环境

### development
127.0.0.1:3006

### 后台测试环境 api host

### 本地开发环境
```bash
npm run dev
```

### 测试环境


### 预发环境
```
git clone

# 初始化: 
sh ./init.sh

# 部署: 
npm run deploy-pre
```


### 正式环境
```
git clone
# 初始化: 
sh ./init.sh

# 部署:
1. 一次编译，运行deploy.sh
2. 复制文件在其他服务器执行脚本restart.sh 重启 

```


## Build Setup



### insight
规模统计: `cloc ./ --exclude-dir=node_modules,mock  --not-match-f=cityData --exclude-ext=json` 

### 坑
cross-env 一定要对每个命令都使用，不然会不生效(需要再看一下为什么会这样)


### todo
