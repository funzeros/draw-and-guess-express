### 注意事项
- 使用 `yarn` 安装依赖
- `yarn start` 运行项目
- 开发环境下可使用 `yarn dev` 运行，代码热更新
- `yarn build` 打包成js
- `yarn serve` 运行打包出来的
- `yarn pm` pm2运行 \ `yarn pmr` pm2重启\ `yarn pms` pm2停止\ `yarn pmd` pm2 关闭并删除，执行`serve`和`pm`之前必须执行`yarn build`
- 出现格式化错乱或 `eslint` 报错等首先保证安装了推荐依赖，本项目行尾序列为 `LF` ，若您的项目是`CRLF`，请执行`yarn fix`后重新`clone`项目