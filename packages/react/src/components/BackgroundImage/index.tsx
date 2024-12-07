import type {
  BasicTransformEvent,
  ImageProps,
  ObjectEvents,
  SerializedImageProps,
  TDegree,
  TPointerEvent
} from "fabric"
import { FabricImage, util } from "fabric"
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef
} from "react"
import { useDidUpdate } from "../../hooks/useDidUpdate"
import { useStore, useStoreApi } from "../../hooks/useStore"
import type { ReactFabricState } from "../../types/store"

export type Handle = {}

// 定义一个互斥的 Scale mode 类型
type ScaleMode =
  | { scaleToFit: true; scaleToCover?: false }
  | { scaleToFit?: false; scaleToCover: true }

export type BackgroundImageProps = Partial<ImageProps> & {
  src: string
  onLoad?: (
    imageSource: FabricImage<
      Partial<ImageProps>,
      SerializedImageProps,
      ObjectEvents
    >
  ) => void
  onScaling?: (scale: BasicTransformEvent<TPointerEvent>) => void

  /** 自动缩放至容器宽高 */
} & ScaleMode

const selector = (s: ReactFabricState) => ({
  width: s.width,
  height: s.height
})

const BackgroundImage = forwardRef<Handle, BackgroundImageProps>(
  ({ src, onLoad, onScaling, scaleToFit, scaleToCover, ...options }, ref) => {
    const backgroundImageRef = useRef<FabricImage | null>(null)

    const store = useStoreApi()

    const { width, height } = useStore(selector)

    const updateViewport = useCallback(
      (params: { scaleToFit?: boolean; scaleToCover?: boolean }) => {
        const { canvas, manualZoom = 1, defaultCentered } = store.getState()
        if (!backgroundImageRef.current || !canvas) return

        // 1. 计算缩放
        const fitZoom = params.scaleToFit
          ? util.findScaleToFit(backgroundImageRef.current, canvas)
          : params.scaleToCover
            ? util.findScaleToCover(backgroundImageRef.current, canvas)
            : 1

        const combinedZoom = fitZoom * manualZoom

        // 2. 先应用基础缩放
        canvas.setViewportTransform([combinedZoom, 0, 0, combinedZoom, 0, 0])

        // 3. 如果需要居中，计算偏移量
        let deltaX = 0
        let deltaY = 0

        if (defaultCentered && canvas.backgroundImage) {
          const canvasCenter = {
            x: canvas.width! / 2,
            y: canvas.height! / 2
          }

          const bgCenter = {
            x:
              (canvas.backgroundImage.left! +
                (canvas.backgroundImage.width! *
                  canvas.backgroundImage.scaleX!) /
                  2) *
              combinedZoom,
            y:
              (canvas.backgroundImage.top! +
                (canvas.backgroundImage.height! *
                  canvas.backgroundImage.scaleY!) /
                  2) *
              combinedZoom
          }

          deltaX = canvasCenter.x - bgCenter.x
          deltaY = canvasCenter.y - bgCenter.y
        }

        // 4. 应用最终变换
        const finalTransform: [number, number, number, number, number, number] =
          [combinedZoom, 0, 0, combinedZoom, deltaX, deltaY]

        canvas.setViewportTransform(finalTransform)
        canvas.requestRenderAll()

        // 5. 更新 store
        store.setState({
          fitZoom,
          manualZoom,
          zoom: combinedZoom
        })
      },
      [store]
    )

    // 监听 width, height 的变化
    useEffect(() => {
      updateViewport({
        scaleToFit,
        scaleToCover
      })
    }, [width, height, scaleToFit, scaleToCover, updateViewport, store])

    useEffect(() => {
      if (!src) return
      const { domNode, setLoading } = store.getState()
      setLoading(true)
      FabricImage.fromURL(src, { crossOrigin: "anonymous" })
        .then((imageSource) => {
          const { canvas } = store.getState()
          if (canvas && canvas.width && canvas.height) {
            imageSource.set({
              ...options,
              objectCaching: false
            })
            canvas.getContext().imageSmoothingEnabled = true
            canvas.getContext().imageSmoothingQuality = "high"
            canvas.backgroundImage = imageSource
            backgroundImageRef.current = imageSource

            updateViewport({
              scaleToFit,
              scaleToCover
            })

            const viewport = canvas.viewportTransform
            if (!viewport) return

            onLoad?.(imageSource)
            if (domNode) domNode.dataset.src = src
          }
        })
        .finally(() => {
          setLoading(false)
        })

      return () => {
        const canvas = store.getState().canvas
        if (backgroundImageRef.current) {
          canvas?.remove(backgroundImageRef.current)
          backgroundImageRef.current = null
        }

        if (canvas?.getElement()) {
          canvas.renderAll()
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src])

    useDidUpdate(() => {
      const { canvas } = store.getState()

      if (backgroundImageRef.current) {
        Object.entries(options).forEach(([key, value]) => {
          if (key === "angle") {
            backgroundImageRef.current?.rotate(value as TDegree)
          } else {
            backgroundImageRef.current?.set(key, value)
          }
        })
        canvas?.requestRenderAll()
      }
    }, [options, store])

    useImperativeHandle(ref, () => ({
      // 是最新的?
      instance: backgroundImageRef.current
    }))

    return null
  }
)

export default memo(BackgroundImage)