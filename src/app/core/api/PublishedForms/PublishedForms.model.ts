export interface PublishedForms {
  success: boolean
  message: string
  data: Data[]
}

export interface Data {
  id: string
  nombre: string
  descripcion: string
  version: number
  estado: string
  publicadoEn: string
  creadoEn: string
}
