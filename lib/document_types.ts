export async function getDocumentTypes(
  key: string,
  withInstructions: boolean = false
) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/document_types`;

  if (withInstructions) {
    requestUrl += "?with_instructions=true";
  }

  const response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Kreative-Id-Key": key,
    },
  });

  const data = await response.json();
  return data;
}

export async function getPrebuiltDocumentTypes(key: string) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/document_types/prebuilt`;

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

export async function updateDocumentType(key: string, id: number, data: any) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/document_types/${id}`;

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

export async function deleteDocumentType(key: string, id: number) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/document_types/${id}`;

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

interface NewDocumentType {
  key: string;
  name: string;
  emoji_icon: string;
  category: string;
  instructions: string;
}

export async function createDocumentType(props: NewDocumentType) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/document_types`;

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Kreative-Id-Key": props.key,
    },
    body: JSON.stringify({
      name: props.name,
      emoji_icon: props.emoji_icon,
      category: props.category,
      instructions: props.instructions,
    }),
  });

  return await response.json();
}