export async function deleteAudioForDocustream({ key, docustreamId }: { key: string, docustreamId: number }) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/docustreams/${docustreamId}/audio`;

  const response = await fetch(requestUrl, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Kreative-Id-Key": key,
    },
  });

  return response;
}

export async function uploadAudioForDocustream({ key, docustreamId, files, length }: { key: string, docustreamId: number, files: File[], length: number }) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/docustreams/${docustreamId}/audio?length=${length}`;
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("audio_files", file);
  });

  const response = await fetch(requestUrl, {
    method: "PUT",
    headers: {
      "Kreative-Id-Key": key,
    },
    body: formData,
  });

  return response;
}