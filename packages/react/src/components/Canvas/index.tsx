import type { CanvasEvents, CanvasOptions, TPointerEventInfo } from 'fabric'
import { Canvas as BaseCanvas, Point } from 'fabric'
import type { CSSProperties, PropsWithChildren } from 'react'
import { useEffect, useLayoutEffect, useRef } from 'react'
import useDraggable from '../../hooks/useDraggable'
import useResizeHandler from '../../hooks/useResizeHandler'
import { useSplitProps } from '../../hooks/useSplitProps'
import { useStore, useStoreApi } from '../../hooks/useStore'
import type { AllCanvasEvents } from '../../types/canvas'
import { bindEvents } from '../../utils/events'

const style: CSSProperties = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
}

// 首先定义事件类型
type CanvasEventProps = {
  [K in keyof AllCanvasEvents]: AllCanvasEvents[K]
}

// 分离配置属性类型
type CanvasConfigProps = Omit<CanvasOptions, keyof CanvasEventProps>

// 重新定义 CanvasProps
export type CanvasProps = PropsWithChildren<Partial<CanvasConfigProps> & Partial<CanvasEventProps>>

const Canvas = ({ children, onMouseWheel, ...props }: CanvasProps) => {
  const canvasRef = useRef<BaseCanvas>()
  const store = useStoreApi()
  const canvasDomRef = useRef<HTMLCanvasElement | null>(null)
  useDraggable()
  const domRef = useRef<HTMLDivElement>(null)
  const controls = useStore(state => state.controls)

  const [listeners, attributes] = useSplitProps(props)

  useLayoutEffect(() => {
    const canvas = canvasDomRef.current

    canvasRef.current = new BaseCanvas(canvas || undefined, {
      ...attributes,
    })

    // 绑定事件并获取清理函数
    const unbindEvents = bindEvents<CanvasEvents>(canvasRef.current, listeners)

    store.setState({
      canvas: canvasRef.current,
    })
    //@ts-expect-error 报错撒撒
    window.canvas = canvasRef.current

    return () => {
      unbindEvents() // 调用清理函数
      canvasRef.current?.dispose()
      canvasRef.current = undefined // 清除引用
      store.setState({
        canvas: null,
      })
    }
  }, [])

  useResizeHandler()

  useEffect(() => {
    const onMouseWheelHandler = (opt: TPointerEventInfo<WheelEvent>) => {
      const { zoomable, panAble, maxManualZoom, minManualZoom, fitZoom = 1, zoom } = store.getState()

      // 阻止默认行为
      opt.e.preventDefault()
      opt.e.stopPropagation()

      // 如果是惯性滚动，直接返回
      if ((opt.e as any).wheelDeltaY === 0) return

      // 检查是否为缩放手势(Mac 上的双指捏合/张开)
      if (opt.e.ctrlKey || (opt.e as any).wheelDeltaY === undefined) {
        // 缩放逻辑
        if (!zoomable) return

        const delta = opt.e.deltaY
        const zoomFactor = delta > 0 ? 0.95 : 1.05
        const currentManualZoom = zoom / fitZoom
        let newManualZoom = currentManualZoom * zoomFactor

        if (newManualZoom > maxManualZoom) newManualZoom = maxManualZoom
        if (newManualZoom < minManualZoom) newManualZoom = minManualZoom

        const combinedZoom = newManualZoom * fitZoom

        canvasRef.current?.zoomToPoint(new Point(opt.e.offsetX, opt.e.offsetY), combinedZoom)

        store.setState({
          manualZoom: newManualZoom,
          zoom: combinedZoom,
        })
      } else {
        if (!panAble) return
        // 平移逻辑
        // 如果觉得太灵敏了，可以调小这个值，比如改为 1.2 或更小
        const sensitivityFactor = 1.5
        const delta = new Point(-opt.e.deltaX * sensitivityFactor, -opt.e.deltaY * sensitivityFactor)
        canvasRef.current?.relativePan(delta)
      }

      onMouseWheel?.(opt)
    }

    canvasRef.current?.on('mouse:wheel', onMouseWheelHandler)

    return () => {
      canvasRef.current?.off('mouse:wheel', onMouseWheelHandler)
    }
  }, [onMouseWheel, store])

  useEffect(() => {
    store.setState({
      domNode: domRef.current?.closest('.react-fabric') as HTMLDivElement,
    })
  }, [store])

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.set(attributes)
      canvasRef.current.requestRenderAll()
    }
  }, [attributes])

  return (
    <div className="react-fabric__canvas" ref={domRef} style={style}>
      <canvas ref={canvasDomRef}></canvas>
      {children}
      {controls.map(control => (
        <div
          key={control.id}
          id={control.id}
          style={{
            position: 'absolute',
          }}
          className={`react-fabric__control ${control.className}`}
          ref={control.ref}
        >
          {control.children}
        </div>
      ))}
    </div>
  )
}

export default Canvas
