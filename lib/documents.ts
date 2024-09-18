export async function getDocustreamDocumentsWithContent(key: string, docustreamId: number) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/docustreams/${docustreamId}/documents?include_content=true`;

  const response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Kreative-Id-Key": key,
    },
  });

  return await response.json();
}


export async function updateDocument(key: string, documentId: number, data: any) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/documents/${documentId}`;

  const response = await fetch(requestUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Kreative-Id-Key": key,
    },
    body: JSON.stringify(data),
  });

  return await response.json();
}

export async function deleteDocument(key: string, documentId: number) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/documents/${documentId}`;

  const response = await fetch(requestUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Kreative-Id-Key": key,
    },
  });

  return await response.json();
}

export async function addScoreForDocument(key: string, documentId: number, score: number, feedback?: string) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/documents/${documentId}/score`;

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Kreative-Id-Key": key,
    },
    body: JSON.stringify({ score, feedback }),
  });

  return await response.json();
}

export async function createDocument(key: string, docustreamId: number, documentTypes: number[]) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/docustreams/${docustreamId}/documents`;

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Kreative-Id-Key": key,
    },
    body: JSON.stringify({ document_types: documentTypes }),
  });

  return await response.json();
} 