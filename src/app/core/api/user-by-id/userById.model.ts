export interface UserById {
  success: boolean
  message: string
  data: Data
}

export interface Data {
  id: string
  username: string
  email: string
  nombreCompleto: string
  documentoIdentidad: string
  telefono: string
  empresaId: string
  empresaNombre: string
  rolId: string
  rolNombre: string
  numeroEmpleado: number
  codigoIVR?: string
  documentacionCompleta: boolean
  estadoDocumentacion: string
  activo: boolean
  ultimoAcceso: string
  fechaCreacion: string
  fechaActualizacion: string
}
