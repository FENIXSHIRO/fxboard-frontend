export type FrameGroup = {
  id: string
  x: number
  y: number
  width: number
  height: number
  offsetX?: number
  offsetY?: number
  draggable: boolean
  columns: {
    x: number
    y: number
    width: number
    height: number
    text: {
      x?: number
      y?: number
      text: string,
      fontSize: number,
      fontFamily?: string,
      fill?: string,
      width?: number,
      height?: number,
      padding: number,
      align: string,
      scaleX?: number,
      scaleY?: number
    }
    body: {
      x?: number
      y?: number
      width: number
      height: number
      fill: string
      stroke: string
      strokeWidth: number
      cornerRadius?: number
    }
  }[]
}
