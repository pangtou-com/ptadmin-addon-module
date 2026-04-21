# Module Plugin Template

这个模板用于开发后台模块型插件。

适合这类场景：

- 需要挂到 `console` 后台菜单中的业务模块
- 需要输出 `pages / widgets`
- 需要通过宿主 `Host SDK` 复用认证、请求、通知、路由、标签等能力
- 需要以 `federation remote` 方式提供给宿主加载

如果你的插件本质上是一套完整独立系统，而不是后台模块，请不要使用这个模板，应改用 `templates/plugin-micro-app`。

## 你需要先理解的事

这个模板产出的插件，核心上是两部分：

1. 模块注册能力
通过 `module` 协议向宿主输出 `pages / widgets`

2. 前端清单能力
通过 `frontend.json` 告诉宿主这个插件如何被识别、加载和装配

其中公共元数据只维护一份：

- `manifest.json`
  作为插件公共元数据唯一来源，前后端共享 `code / name / version / description / type`

- `frontend.config.json`
  只维护前端宿主加载所需的运行时配置

- `frontend.json`
  由脚本根据 `manifest.json + frontend.config.json` 自动同步生成，不再手工维护

模块模板不再自己维护菜单路由树。
页面入口由插件通过 `pages` 暴露，最终菜单、层级和可见性由宿主资源树决定。

所以开发时要同时关注：

- 你的业务页面和模块代码
- `manifest.json`
- `frontend.config.json`
- `vite.config.ts` 中的 federation remote 配置

## 目录结构

- `manifest.json`
  插件公共元数据源。前端模块标题、版本、描述和宿主清单公共字段都从这里派生。

- `frontend.config.json`
  前端加载配置源。这里只放 runtime、routeBase、entry、icon、capabilities 等前端专属字段。

- `frontend.json`
  自动生成的前端插件清单。宿主识别插件时依赖这份文件。

- `src/module.ts`
  模块元数据入口。宿主通过这里读取 `pages / widgets`

- `src/app-entry.ts`
  完整模块应用入口。宿主需要在挂载时注入 SDK 时使用它

- `src/bootstrap.ts`
  模块运行时初始化入口，统一处理 Host SDK 注入

- `src/pages/`
  页面组件和页面注册项

- `src/schemas/`
  schema 示例定义，供后续按 `schemaKey` 对接动态 schema 页面时参考

- `src/widgets/`
  widget 注册项

- `src/api/`
  业务请求封装

- `src/dev.ts`
  本地 mock 宿主，用于独立开发

- `vite.config.ts`
  remote 构建配置

- `scripts/manifest-sync.mjs`
  根据 `manifest.json + frontend.config.json` 自动同步 `frontend.json`

- `scripts/manifest-check.mjs`
  校验清单结构与同步结果

- `scripts/pack.mjs`
  打包发布包

## 一、开发流程

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动本地开发

```bash
pnpm dev
```

此时走的是 `src/dev.ts` 里的 mock host，不依赖真实宿主。
执行 `pnpm dev / build / check:types / pack` 时，模板会先自动同步一次 `frontend.json` 和 `package.json.version`。

### 3. 先改这几个地方

创建插件后，优先检查这些文件：

1. `package.json`
   确认包名

2. `manifest.json`
   确认：
   - `code`
   - `name`
   - `version`
   - `description`
   - `type`

3. `frontend.config.json`
   确认：
   - `routeBase`
   - `runtime`
   - `entry.federation.remote`
   - `entry.federation.entry`

4. `src/pages/index.ts`
   替换模板默认页面注册项，按需设置 `schemaKey`

5. `vite.config.ts`
   确认 federation `name` 与 `frontend.json.entry.federation.remote` 一致

### 4. 再开始写业务

推荐顺序：

1. 先写 `src/api/`
2. 再写页面组件
3. 最后补 widget 和页面级 `schemaKey`

不要在页面里直接散落请求逻辑，尽量统一走 `src/api/`。

## 二、本地联调流程

模块型插件联调的目标是确认：

- 宿主能加载 remote
- 宿主能把资源树正确映射到页面
- 页面能显示
- `Host SDK` 能正常工作

建议流程：

### 1. 先本地构建 remote

```bash
pnpm build
pnpm preview
```

默认会以 `4179` 端口预览。

### 2. 再启动宿主

在主仓库中启动 `console`。

### 3. 把 `frontend.json` 注册到宿主

当前阶段仍然是手动联调，所以需要把自动生成的 `frontend.json` 内容登记到宿主 manifest 注册表。

### 4. 在宿主里配置资源并访问页面

检查：

- 菜单资源是否正确绑定到 `module + page_key`
- 页面是否正常渲染
- 通知、确认框、标签页、路由跳转是否可用
- 请求是否通过 `Host SDK` 正常透传

## 三、测试流程

模板默认没有内置单元测试框架，所以当前推荐最小测试流程是：

### 1. 类型检查

```bash
pnpm check:types
```

### 2. 清单检查

```bash
pnpm manifest:check
```

它会校验：

- `manifest.json` 是否结构正确
- `frontend.config.json` 是否可生成有效清单
- `frontend.json` 是否结构正确
- `kind` 是否为 `module`
- `runtime` 是否合理
- `version` 是否和 `package.json` 一致

### 3. 构建检查

```bash
pnpm build
```

### 4. 宿主联调检查

建议至少验证下面这些点：

- 宿主能加载 remoteEntry
- 宿主能正确装配页面
- 页面内调用 `sdk.request`
- 页面内调用 `sdk.ui`
- 页面内调用 `sdk.router`
- 页面切换后无异常

## 四、打包流程

发布前不要手工拷文件，统一使用：

```bash
pnpm pack
```

这个命令会顺序执行：

1. `pnpm build`
2. `pnpm manifest:check`
3. 生成发布目录
4. 输出压缩包到 `release/`

产物示例：

```bash
release/your-plugin-0.1.0.zip
```

压缩包中默认包含：

- `dist/`
- `manifest.json`
- `frontend.json`
- `package.json`
- `README.md`
- `release.json`

## 五、交付给平台时需要提供什么

至少要保证下面这些内容是正确的：

- 打包产物 `.zip`
- `manifest.json`
- `frontend.json`
- 正确的插件版本号
- 正确的 `code`
- 正确的 `routeBase`
- 正确的 remote 入口信息

如果这些信息不一致，宿主即使能下载包，也可能无法正确加载。

## 六、常用命令

```bash
pnpm manifest:sync
pnpm dev
pnpm check:types
pnpm build
pnpm preview
pnpm manifest:check
pnpm pack
```

## 七、开发约束

- 只通过 `Host SDK` 访问宿主能力
- 不要直接依赖 `apps/console/src/*`
- 不要把宿主私有实现拷进插件
- 页面请求统一收口到 `src/api/`
- federation remote 名称和 `frontend.json` 必须保持一致
- 页面注册项中的 `module` 和 `key` 要与宿主资源配置保持一致
- 权限判断来源于后端返回的资源树，不再通过模块定义单独声明

## 八、什么时候不该用这个模板

下面这些场景不要使用 `plugin-module`：

- 插件本身是一整套独立系统
- 插件需要以 `wujie` 子应用方式挂载
- 插件不打算输出模块页面或 widget

这些情况请改用 `plugin-micro-app` 模板。
