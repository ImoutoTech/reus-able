# @reus-able/theme

UI 主题包，包含设计 token（颜色变量）、文章排版样式和响应式容器，提取自 [Applog](https://github.com/youranreus/applog) 项目。

## 安装

```bash
pnpm add @reus-able/theme
# 或
npm install @reus-able/theme
```

## 使用

### 全量引入（包含所有模块）

```css
@import '@reus-able/theme';
```

### 按需引入

```css
/* 仅设计 token（CSS 变量） */
@import '@reus-able/theme/tokens';

/* 仅文章排版样式 */
@import '@reus-able/theme/article';

/* 仅响应式容器 */
@import '@reus-able/theme/container';

/* 仅封面图 shimmer 动画 */
@import '@reus-able/theme/cover-image';
```

### 在 Vue / Vite 项目中

```typescript
// main.ts
import '@reus-able/theme'
// 或按需
import '@reus-able/theme/tokens'
import '@reus-able/theme/article'
```

### 在 SCSS 中

```scss
@use '@reus-able/theme/tokens';
// 然后可直接使用 CSS 变量
.my-link {
  color: var(--color-link);
}
```

## CSS 变量（设计 Token）

引入 `tokens.css` 后可在项目中使用以下 CSS 变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `--color-link` | `#0071e3` | 链接色 |
| `--color-link-hover` | `rgb(0,102,204)` | 链接悬停色 |
| `--color-text-primary` | `#1d1d1f` | 主文本色 |
| `--color-text-secondary` | `#6e6e73` | 次要文本色 |
| `--color-bg-base` | `#ffffff` | 基础背景 |
| `--color-bg-muted` | `#f5f5f7` | 浅灰背景 |
| `--color-bg-card` | `#e5e7eb` | 卡片背景 |
| `--color-border` | `#d2d2d7` | 标准边框色 |
| `--color-divider` | `#e7e7e7` | 分割线色 |
| `--color-error` | `#ff3b30` | 错误红 |
| `--color-notice-bg` | `#eef7fc` | 提示框背景 |
| `--color-warn-bg` | `#fdf2f1` | 警告框背景 |
| `--color-code-bg` | `#f5f5f7` | 行内代码背景 |
| `--color-code-block-bg` | `#0d1117` | 代码块背景（highlight.js） |
| `--font-family-base` | SF Pro / PingFang SC / ... | 正文字体栈 |
| `--font-family-mono` | SF Mono / Monaco / ... | 等宽字体栈 |

## 样式类

### 文章排版（`article-content.scss`）

在文章容器上添加 `.article-content` 类，内部所有 markdown 渲染内容将自动应用排版样式：

```html
<div class="article-content">
  <!-- 渲染后的 markdown HTML -->
</div>
```

支持的元素：`p` `h1-h6` `ul/ol` `blockquote` `code` `pre` `table` `img` `a` `hr`

GFM 扩展：任务列表、删除线、脚注

Applog BBCode：`.applog-notice` `.applog-warn` `.applog-tag`

文章标题/摘要：`.gb-header` `.gb-subheader`

### 响应式容器（`container.css`）

```html
<div class="common-page-container">
  <!-- 页面内容，自动响应各断点宽度 -->
</div>
```

| 断点 | 最大宽度 |
|------|---------|
| 移动端 `< 768px` | 100%（左右 1.5rem padding） |
| 平板 `768–1250px` | 654px |
| 小桌面 `1251–1599px` | 710px |
| 大桌面 `1600–1799px` | 768px |
| 超大屏 `≥ 2400px` | 898px |

### 封面图（`cover-image.scss`）

```html
<!-- 加载中：shimmer 骨架屏 -->
<div class="cover-block shimmer"></div>

<!-- 图片加载完毕后移除 shimmer，图片 add .loaded 类 -->
<div class="cover-block">
  <img class="cover-block-image loaded" src="..." />
</div>
```
