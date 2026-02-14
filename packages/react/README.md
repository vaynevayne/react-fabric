<div align="right">

[<kbd>中文</kbd>](#chinese) | [<kbd>English</kbd>](#english)

</div>

# @cs-open/react-fabric

[![npm version](https://badge.fury.io/js/@cs-open%2Freact-fabric.svg)](https://badge.fury.io/js/@cs-open%2Freact-fabric)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


---

<div id="chinese">

一个基于 Fabric.js 构建的现代化 React Canvas 绘图组件库，提供强大的 2D 图形绘制、交互和动画功能。

![React Fabric](https://github.com/user-attachments/assets/02ff8152-bad3-4e99-82db-13eefc5413b0)

## ✨ 核心特性

### 🎯 丰富的图形组件

- **基础图形**: 矩形、圆形、椭圆、线条、多边形、路径
- **文本组件**: 文本、可编辑文本、文本框
- **图像组件**: 背景图片、普通图片
- **组合组件**: 分组、对象集合
- **自定义控件**: 可拖拽控制点、工具栏

### 🖱️ 强大的交互功能

- **自动缩放**: 支持鼠标滚轮缩放，自动适应容器大小
- **平移操作**: 支持拖拽平移画布视图
- **触摸支持**: 完整的触摸设备支持，包括双指缩放和拖拽
- **选择系统**: 多选、框选、键盘快捷键支持
- **拖拽操作**: 对象拖拽、批量操作

### 📦 响应式设计

- **自动适配**: 画布自动撑满父容器，响应式调整
- **触摸优化**: 专为移动设备优化的触摸交互
- **跨平台**: 支持桌面端和移动端浏览器

### 💻 开发者友好

- **TypeScript**: 完整的 TypeScript 类型支持
- **React 风格**: 声明式 API，符合 React 开发习惯
- **事件系统**: 完整的事件回调，支持所有 Fabric.js 事件
- **状态管理**: 内置状态管理，支持受控和非受控模式

## ✨ 快速开始

### 安装

```bash
npm install @cs-open/react-fabric
# 或者
yarn add @cs-open/react-fabric
# 或者
pnpm add @cs-open/react-fabric
```

### 基础用法

```tsx
import React from 'react'
import { ReactFabric, Rect, Text,  } from '@cs-open/react-fabric'

function App() {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ReactFabric>
        <Rect left={100} top={100} width={200} height={100} fill="red" stroke="blue" strokeWidth={2} />
        <Text left={150} top={250} text="Hello Fabric!" fontSize={20} fill="white" />
      </ReactFabric>
    </div>
  )
}

export default App
```

## 🎯 核心功能

### 自动缩放与平移

```tsx
import { ReactFabric, useReactFabric } from '@cs-open/react-fabric'

function CanvasWithControls() {
  const { zoomIn, zoomOut, resetViewport, zoom } = useReactFabric()

  return (
    <div>
      <div className="toolbar">
        <button onClick={zoomIn}>放大</button>
        <button onClick={zoomOut}>缩小</button>
        <button onClick={() => resetViewport()}>重置</button>
        <span>缩放: {Math.round(zoom * 100)}%</span>
      </div>

      <ReactFabric zoomable={true} panAble={true} minManualZoom={0.1} maxManualZoom={5}>
        {/* 你的画布内容 */}
      </ReactFabric>
    </div>
  )
}
```

### 触摸设备支持

```tsx
import { ReactFabric, PluginPinch } from '@cs-open/react-fabric'

function TouchCanvas() {
  return (
    <ReactFabric>
      {/* 你的画布内容 */}
      <PluginPinch />
    </ReactFabric>
  )
}
```

### 背景图片

```tsx
import { ReactFabric, BackgroundImage } from '@cs-open/react-fabric'

function CanvasWithBackground() {
  return (
    <ReactFabric defaultCentered>
      <BackgroundImage src="/path/to/image.jpg" scaleToFit />
      {/* 其他图形元素 */}
    </ReactFabric>
  )
}
```

## 🔌 插件系统

### 内置插件

| 插件             | 功能     | 描述                   |
| ---------------- | -------- | ---------------------- |
| `PluginPinch`    | 触摸缩放 | 支持双指缩放和拖拽操作 |
| `PluginFreeDraw` | 自由绘制 | 手绘路径和涂鸦功能     |
| `PluginFreeRect` | 矩形绘制 | 交互式矩形绘制工具     |
| `PluginFreeText` | 文本工具 | 点击添加可编辑文本     |
| `PluginGrid` | 网格辅助 | 显示网格线辅助对齐     |
| `PluginMask`     | 遮罩效果 | 创建遮罩和裁剪效果     |

### 使用插件

```tsx
import { ReactFabric,PluginPinch, PluginFreeDraw, PluginFreeRect, PluginGrid } from '@cs-open/react-fabric'

function AdvancedCanvas() {
  return (
    <ReactFabric>
      {/* 触摸支持 */}
      <PluginPinch />

      {/* 自由绘制 */}
      <PluginFreeDraw
        onComplete={(path, { canvas }) => {
          console.log('绘制完成:', path)
        }}
      />

      {/* 矩形绘制工具 */}
      <PluginFreeRect
        fill={'red'}
        onComplete={(rect, { canvas }) => {
          console.log('矩形绘制完成:', rect)
        }}
      />

      {/* 网格线 */}
      <PluginGrid />
    </ReactFabric>
  )
}
```

## 📦 组件 API

### ReactFabric 组件

主要的画布容器组件，支持以下属性：

```tsx
interface ReactFabricProps {
  // 基础属性
  width?: number
  height?: number
  className?: string
  style?: CSSProperties

  // 交互控制
  zoomable?: boolean // 是否可缩放
  panAble?: boolean // 是否可平移
  selection?: boolean // 是否可选择
  defaultSelection?: boolean // 默认选择状态
  defaultDraggable?: boolean // 默认拖拽状态

  // 缩放控制
  manualZoom?: number // 手动缩放倍数
  minManualZoom?: number // 最小缩放倍数
  maxManualZoom?: number // 最大缩放倍数
  defaultCentered?: boolean // 背景图是否居中

  // 事件回调
  onMouseDown?: (e: FabricPublicEvent) => void
  onMouseMove?: (e: FabricPublicEvent) => void
  onMouseUp?: (e: FabricPublicEvent) => void
  onMouseWheel?: (e: FabricPublicEvent) => void
}
```

### 图形组件

所有图形组件都支持对应的 Fabric.js 对象的所有属性和事件：

```tsx
// 矩形
<Rect
  left={100}
  top={100}
  width={200}
  height={100}
  fill="red"
  stroke="blue"
  strokeWidth={2}
  onModified={(e) => console.log('矩形被修改', e.target)}
/>

// 圆形
<Circle
  left={200}
  top={200}
  radius={50}
  fill="green"
  onSelected={() => console.log('圆形被选中')}
/>

// 文本
<Text
  left={100}
  top={300}
  text="Hello World"
  fontSize={24}
  fill="black"
  fontFamily="Arial"
/>

// 图片
<Image
  left={300}
  top={300}
  src="/path/to/image.jpg"
  width={200}
  height={150}
/>
```

## 🎮 状态管理

### useReactFabric Hook

```tsx
import { useReactFabric } from '@cs-open/react-fabric'

function Toolbar() {
  const {
    // 状态
    canvas,
    zoom,
    manualZoom,
    isDragging,
    selection,

    // 方法
    zoomIn,
    zoomOut,
    resetViewport,
    setZoomable,
    setSelection,
    setDraggable,
  } = useReactFabric()

  return (
    <div className="toolbar">
      <button onClick={zoomIn}>放大</button>
      <button onClick={zoomOut}>缩小</button>
      <button onClick={() => resetViewport()}>重置</button>
      <span>缩放: {Math.round(zoom * 100)}%</span>
    </div>
  )
}
```

### 跨组件状态访问

ReactFabricProvider 是一个上下文提供程序，允许您从组件树中的任何位置访问流的内部状态，例如子组件，甚至在 ReactFabric 之外 元件。它通常用于应用程序的顶层。
在这种情况下，您可能需要使用 ReactFabricProvider 组件

```tsx
import { ReactFabricProvider, useReactFabric } from '@cs-open/react-fabric'

function App() {
  return (
    <ReactFabricProvider>
      <Toolbar />
      <ReactFabric>{/* 画布内容 */}</ReactFabric>
    </ReactFabricProvider>
  )
}

function Toolbar() {
  const { zoomIn, zoomOut, resetViewport } = useReactFabric()
  // 可以在 ReactFabric 外部访问状态
}
```

## 🎨 高级用法

### 受控模式

```tsx
import { useState } from 'react'
import { ReactFabric, Rect } from '@cs-open/react-fabric'

function ControlledCanvas() {
  const [rect, setRect] = useState({
    left: 100,
    top: 100,
    width: 200,
    height: 100,
    fill: 'red',
  })

  return (
    <ReactFabric>
      <Rect {...rect} onModified={e => setRect(e.target)} />
    </ReactFabric>
  )
}
```

### 非受控模式

```tsx
import { ReactFabric, Rect, Group } from '@cs-open/react-fabric'

function UncontrolledCanvas() {
  return (
    <ReactFabric>
      <Group>
        <Rect defaultLeft={100} defaultTop={100} defaultWidth={100} defaultHeight={100} fill="blue" />
      </Group>
    </ReactFabric>
  )
}
```

### DOM 集成

```tsx
import { ReactFabric, Rect } from '@cs-open/react-fabric'

function CanvasWithDOM() {
  return (
    <ReactFabric>
      <Rect left={100} top={100} width={200} height={100}>
        <div className="tooltip">这是一个提示框</div>
      </Rect>
    </ReactFabric>
  )
}
```

## 📋 依赖要求

### 必需依赖

```json
{
  "react": ">=17.0.0",
  "react-dom": ">=17.0.0",
  "fabric": "^6.6.1",
  "zustand": "^4.0.0 || ^5.0.0"
}
```

### 可选依赖

某些插件需要额外的依赖：

```bash
# 触摸手势支持
npm install hammerjs
npm install @types/hammerjs  # TypeScript 用户

# 浮动 UI 支持（用于 DOM 集成）
npm install @floating-ui/react
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目基于 [MIT](LICENSE) 许可证开源。

## 🔗 相关链接

- [Fabric.js 官方文档](http://fabricjs.com/)
- [React 官方文档](https://reactjs.org/)
- [项目主页](https://cs-open.github.io/react-fabric/)
- [GitHub 仓库](https://github.com/cs-open/react-fabric)

---

**Made with ❤️ by the CS-Open team**

<div align="center">

**[⬆ Back to Top](#-cs-openreact-fabric) | [English](#english)**

</div>

</div>


<div id="english">

A modern React Canvas drawing component library built on Fabric.js, providing powerful 2D graphics rendering, interaction, and animation capabilities.

## ✨ Core Features

### 🎯 Rich Graphic Components

- **Basic Shapes**: Rectangle, Circle, Ellipse, Line, Polygon, Path
- **Text Components**: Text, Editable Text, Textbox
- **Image Components**: Background Image, Regular Image
- **Group Components**: Group, Object Collection
- **Custom Controls**: Draggable Control Points, Toolbar

### 🖱️ Powerful Interaction Features

- **Auto Zoom**: Supports mouse wheel zooming, automatically adapts to container size
- **Pan Operation**: Supports drag to pan canvas view
- **Touch Support**: Full touch device support, including pinch zoom and drag
- **Selection System**: Multi-select, box selection, keyboard shortcut support
- **Drag Operation**: Object dragging, batch operations

### 📦 Responsive Design

- **Auto Adapt**: Canvas automatically fills parent container, responsive adjustment
- **Touch Optimization**: Touch interactions optimized for mobile devices
- **Cross-platform**: Supports desktop and mobile browsers

### 💻 Developer Friendly

- **TypeScript**: Full TypeScript type support
- **React Style**: Declarative API, conforms to React development practices
- **Event System**: Complete event callbacks, supports all Fabric.js events
- **State Management**: Built-in state management, supports controlled and uncontrolled modes

## ✨ Quick Start

### Installation

```bash
npm install @cs-open/react-fabric
# or
yarn add @cs-open/react-fabric
# or
pnpm add @cs-open/react-fabric
```

### Basic Usage

```tsx
import React from 'react'
import { ReactFabric, Rect, Text, Circle } from '@cs-open/react-fabric'

function App() {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ReactFabric>
        <Rect left={100} top={100} width={200} height={100} fill="red" stroke="blue" strokeWidth={2} />
        <Circle left={300} top={150} radius={50} fill="green" />
        <Text left={150} top={250} text="Hello Fabric!" fontSize={20} fill="white" />
      </ReactFabric>
    </div>
  )
}

export default App
```

## 🎯 Core Features

### Auto Zoom and Pan

```tsx
import { ReactFabric, useReactFabric } from '@cs-open/react-fabric'

function CanvasWithControls() {
  const { zoomIn, zoomOut, resetViewport, zoom } = useReactFabric()

  return (
    <div>
      <div className="toolbar">
        <button onClick={zoomIn}>Zoom In</button>
        <button onClick={zoomOut}>Zoom Out</button>
        <button onClick={() => resetViewport()}>Reset</button>
        <span>Zoom: {Math.round(zoom * 100)}%</span>
      </div>

      <ReactFabric zoomable={true} panAble={true} minManualZoom={0.1} maxManualZoom={5}>
        {/* Your canvas content */}
      </ReactFabric>
    </div>
  )
}
```

### Touch Device Support

```tsx
import { ReactFabric, PluginPinch } from '@cs-open/react-fabric'
import { PluginPinch } from '@cs-open/react-fabric/plugins'

function TouchCanvas() {
  return (
    <ReactFabric>
      {/* Your canvas content */}
      <PluginPinch />
    </ReactFabric>
  )
}
```

### Background Image

```tsx
import { ReactFabric, BackgroundImage } from '@cs-open/react-fabric'

function CanvasWithBackground() {
  return (
    <ReactFabric defaultCentered>
      <BackgroundImage src="/path/to/image.jpg" scaleToFit />
      {/* Other graphic elements */}
    </ReactFabric>
  )
}
```

## 🔌 Plugin System

### Built-in Plugins

| Plugin           | Function       | Description                                 |
| ---------------- | -------------- | ------------------------------------------- |
| `PluginPinch`    | Touch Zoom     | Supports pinch zoom and drag operations     |
| `PluginFreeDraw` | Free Draw      | Hand-drawn paths and doodle features        |
| `PluginFreeRect` | Rectangle Draw | Interactive rectangle drawing tool          |
| `PluginFreeText` | Text Tool      | Click to add editable text                  |
| `PluginGridLine` | Grid Guide     | Display grid lines for alignment assistance |
| `PluginMask`     | Mask Effect    | Create mask and crop effects                |

### Using Plugins

```tsx
import { ReactFabric } from '@cs-open/react-fabric'
import { PluginPinch, PluginFreeDraw, PluginFreeRect, PluginGridLine } from '@cs-open/react-fabric/plugins'

function AdvancedCanvas() {
  return (
    <ReactFabric>
      {/* Touch support */}
      <PluginPinch />

      {/* Free draw */}
      <PluginFreeDraw
        onComplete={(path, { canvas }) => {
          console.log('Drawing completed:', path)
        }}
      />

      {/* Rectangle drawing tool */}
      <PluginFreeRect
        fill={'red'}
        onComplete={(rect, { canvas }) => {
          console.log('Rectangle drawing completed:', rect)
        }}
      />

      {/* Grid lines */}
      <PluginGridLine />
    </ReactFabric>
  )
}
```

## 📦 Component API

### ReactFabric Component

The main canvas container component, supports the following properties:

```tsx
interface ReactFabricProps {
  // Basic Properties
  width?: number
  height?: number
  className?: string
  style?: CSSProperties

  // Interaction Control
  zoomable?: boolean // Whether zoomable
  panAble?: boolean // Whether panable
  selection?: boolean // Whether selectable
  defaultSelection?: boolean // Default selection state
  defaultDraggable?: boolean // Default draggable state

  // Zoom Control
  manualZoom?: number // Manual zoom level
  minManualZoom?: number // Minimum zoom level
  maxManualZoom?: number // Maximum zoom level
  defaultCentered?: boolean // Whether background image is centered

  // Event Callbacks
  onMouseDown?: (e: FabricPublicEvent) => void
  onMouseMove?: (e: FabricPublicEvent) => void
  onMouseUp?: (e: FabricPublicEvent) => void
  onMouseWheel?: (e: FabricPublicEvent) => void
}
```

### Graphic Components

All graphic components support all properties and events of the corresponding Fabric.js objects:

```tsx
// Rectangle
<Rect
  left={100}
  top={100}
  width={200}
  height={100}
  fill="red"
  stroke="blue"
  strokeWidth={2}
  onModified={(e) => console.log('Rectangle modified', e.target)}
/>

// Circle
<Circle
  left={200}
  top={200}
  radius={50}
  fill="green"
  onSelected={() => console.log('Circle selected')}
/>

// Text
<Text
  left={100}
  top={300}
  text="Hello World"
  fontSize={24}
  fill="black"
  fontFamily="Arial"
/>

// Image
<Image
  left={300}
  top={300}
  src="/path/to/image.jpg"
  width={200}
  height={150}
/>
```

## 🎮 State Management

### useReactFabric Hook

```tsx
import { useReactFabric } from '@cs-open/react-fabric'

function Toolbar() {
  const {
    // State
    canvas,
    zoom,
    manualZoom,
    isDragging,
    selection,

    // Methods
    zoomIn,
    zoomOut,
    resetViewport,
    setZoomable,
    setSelection,
    setDraggable,
  } = useReactFabric()

  return (
    <div className="toolbar">
      <button onClick={zoomIn}>Zoom In</button>
      <button onClick={zoomOut}>Zoom Out</button>
      <button onClick={() => resetViewport()}>Reset</button>
      <span>Zoom: {Math.round(zoom * 100)}%</span>
    </div>
  )
}
```

### Cross-component State Access

ReactFabricProvider is a context provider that allows you to access the internal state of the flow from anywhere in the component tree, such as child components, or even outside the ReactFabric component. It is typically used at the top level of the application.
In this case, you may need to use the ReactFabricProvider component

```tsx
import { ReactFabricProvider, useReactFabric } from '@cs-open/react-fabric'

function App() {
  return (
    <ReactFabricProvider>
      <Toolbar />
      <ReactFabric>{/* Canvas content */}</ReactFabric>
    </ReactFabricProvider>
  )
}

function Toolbar() {
  const { zoomIn, zoomOut, resetViewport } = useReactFabric()
  // Can access state outside ReactFabric
}
```

## 🎨 Advanced Usage

### Controlled Mode

```tsx
import { useState } from 'react'
import { ReactFabric, Rect } from '@cs-open/react-fabric'

function ControlledCanvas() {
  const [rect, setRect] = useState({
    left: 100,
    top: 100,
    width: 200,
    height: 100,
    fill: 'red',
  })

  return (
    <ReactFabric>
      <Rect {...rect} onModified={e => setRect(e.target)} />
    </ReactFabric>
  )
}
```

### Uncontrolled Mode

```tsx
import { ReactFabric, Rect, Group } from '@cs-open/react-fabric'

function UncontrolledCanvas() {
  return (
    <ReactFabric>
      <Group>
        <Rect defaultLeft={100} defaultTop={100} defaultWidth={100} defaultHeight={100} fill="blue" />
      </Group>
    </ReactFabric>
  )
}
```

### DOM Integration

```tsx
import { ReactFabric, Rect } from '@cs-open/react-fabric'

function CanvasWithDOM() {
  return (
    <ReactFabric>
      <Rect left={100} top={100} width={200} height={100}>
        <div className="tooltip">This is a tooltip</div>
      </Rect>
    </ReactFabric>
  )
}
```

## 📋 Dependency Requirements

### Required Dependencies

```json
{
  "react": ">=17.0.0",
  "react-dom": ">=17.0.0",
  "fabric": "^6.6.1",
  "zustand": "^4.0.0 || ^5.0.0"
}
```

### Optional Dependencies

Some plugins require additional dependencies:

```bash
# Touch gesture support
npm install hammerjs
npm install @types/hammerjs  # TypeScript users

# Floating UI support (for DOM integration)
npm install @floating-ui/react
```

## 🤝 Contributing

Welcome to submit Issues and Pull Requests!

1. Fork this repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is open source under the [MIT](LICENSE) license.

## 🔗 Related Links

- [Fabric.js Official Documentation](http://fabricjs.com/)
- [React Official Documentation](https://reactjs.org/)
- [Project Homepage](https://cs-open.github.io/react-fabric/)
- [GitHub Repository](https://github.com/cs-open/react-fabric)

---

**Made with ❤️ by the CS-Open team**

</div>

<div align="center">

**[⬆ Back to Top](#-cs-openreact-fabric) | [中文](#chinese)**

</div>