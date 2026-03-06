export interface FormATS {
  success: boolean
  message: string
  data: Data
}

export interface Data {
  id: string
  nombre: string
  descripcion: string
  version: number
  estado: string
  campos: Campo[]
  publicadoEn: string
  creadoEn: string
  actualizadoEn: string
}

export interface Campo {
  key: string
  type: string
  props: Props
}

export interface Props {
  label: string
  placeholder: any
  required: boolean
  type: any
  options?: Option[]
  arrayType: any
  dateFormat: any
  showIcon: any
  accept?: string
  maxFileSize?: number
  multiple: any
}

export interface Option {
  value: string
  label: string
}