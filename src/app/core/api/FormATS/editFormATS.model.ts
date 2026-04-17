export interface EditFormATS {
  answers: { [key: string]: any };
  metadata: {
    ubicacion_gps?: string;
    dispositivo?: string;
    version_app?: string
  };
}