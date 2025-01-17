import { taskMessage } from "./taskMessage"

export type ItemGroup = {
  id: string
  x: number
  y: number
  width: number
  height: number
  offsetX?: number
  offsetY?: number
  rotation: number
  scaleX: number
  scaleY: number
  draggable: boolean
  name: string
  item: {
    shapeType: string,
    strokeScaleEnabled: false,
    fill?: string,
    stroke?: string,
    strokeWidth?: number,
    // Параметры, специфичные для разных фигур
    radius?: number,
    width?: number,
    height?: number,
    sides?: number, // для треугольников
    cornerRadius?: number
  }
  text?:{
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
  taskData?: {
    performer?: string
    description?: string
    dateStart?: Date
    dateEnd?: Date
    messages?: taskMessage[]
  },
  connectionInput?: {
    id: string,
    x: number,
    y: number,
    radius: number,
    fill: string,
    stroke: string,
    strokeWidth: number,
    scaleX: number,
    scaleY: number,
  }[]
}
