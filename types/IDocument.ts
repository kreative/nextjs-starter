interface IDocument {
  id: number;
  title: string;
  docustream_id: number;
  document_type: string;
  status: string;
  content?: string;
  created_at: Date;
  document_type_name: string;
  document_type_emoji_icon: string;
  document_is_medical_record: boolean;  
  creator_ksn: number;
  score?: number;
}

export default IDocument;