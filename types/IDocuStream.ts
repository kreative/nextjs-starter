import IPatientSignalment from "./IPatientSignalment";

export default interface IDocuStream {
  id: number;
  status: string;
  start_time: string;
  time_uploaded?: string;
  length?: number;
  clinic_id: number;
  is_active: boolean;
  audio_s3_url?: string;
  is_transcribed: boolean;
  is_gippitied: boolean;
  patient_id?: number;
  title: string;
  patient: IPatientSignalment;
  provider_id: number;
  summary?: string;
}
