interface GetTranscriptProps {
  appointmentId: number;
  patientId: number;
  key: string;
}

export async function getTranscript({ appointmentId, patientId, key }: GetTranscriptProps) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/transcripts?appointment_id=${appointmentId}&patient_id=${patientId}`;
  const response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Kreative-Id-Key": key,
    },
  }
  );

  const data = await response.json();
  return data;
}

interface GetDSTranscriptProps {
  docustram_id: number;
  key: string;
}

export async function getDocuStreamTranscript({ docustram_id, key }: GetDSTranscriptProps) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/transcripts/docustreams/${docustram_id}`;
  const response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Kreative-Id-Key": key,
    },
  }
  );

  const data = await response.json();
  return data;
}