export interface Sitios {
  success: boolean
  message: string
  data: Data
}

export interface Data {
  id: string
  codigo: string
  nombre: string
  descripcion?: string
  direccion?: string
  telefono?: string
  estado?: string
  latitude?: string
  longitude?: string
  region?: string   
  municipio?: string
  departamento?: string
  pais?: string 
  nombreSupervisor?: string
  telefonoSupervisor?: string
  emailSupervisor?: string
  categoriaInfraestructura?: string
  activo?: boolean
  fechaCreacion?: string
  fechaActualizacion?: string
}