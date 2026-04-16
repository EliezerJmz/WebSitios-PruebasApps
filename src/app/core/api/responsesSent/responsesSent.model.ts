export interface ResponsesSent {
  success: boolean
  message: string
  data: Data[]
}

export interface Data {
  id: string
  formId: string
  formNombre: string
  formVersion: number
  answers?: Answers
  metadata: Metadata
  creadoPorId: string
  creadoPorNombre: string
  asignadoAId: string
  asignadoANombre: string
  estado: string
  fechaAsignacion: string
  fechaRevision: any
  comentarioRevision: any
  creadoEn: string
}

export interface Answers {
  [key: string]: any;
}

export interface Metadata {
  submittedAt: string
  usuarioId: string
}
