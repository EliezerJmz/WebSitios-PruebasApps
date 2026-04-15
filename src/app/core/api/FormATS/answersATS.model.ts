export interface AnswersATS {
  answers: { [key: string]: any };
  metadata: {
    ubicacion_gps?: string;
    dispositivo?: string;
    usuarioId: string;
  };
}