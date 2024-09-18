interface createDocuStreamProps {
  key: string;
  startTime?: string;
}

export async function createDocuStream(props: createDocuStreamProps) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/docustreams`;

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Kreative-Id-Key": props.key,
    },
    body: JSON.stringify({
      start_time: props.startTime
    }),
  });

  const data = await response.json();
  return data;
}

export async function getDocuStreamsForClinic(props: { key: string, start?: string, end?: string }) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/docustreams/clinic?`;

  if (props.start) {
    requestUrl += `start_time=${props.start}`;
  }

  if (props.end) {
    requestUrl += `&end_time=${props.end}`;
  }

  const response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Kreative-Id-Key": props.key,
    },
  });

  const data = await response.json();
  return data;
}

export async function getDocuStreamsForProvider(props: { key: string, ksn: number, start?: string, end?: string }) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/docustreams?ksn=${props.ksn}`;

  if (props.start) {
    requestUrl += `&start_time=${props.start}`;
  }

  if (props.end) {
    requestUrl += `&end_time=${props.end}`;
  }

  const response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Kreative-Id-Key": props.key,
    },
  });

  const data = await response.json();
  return data;

}

export async function getArchivedDocuStreams(props: { key: string }) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/docustreams/archive`;

  const response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Kreative-Id-Key": props.key,
    },
  });

  const data = await response.json();
  return data;
}

export async function getDocuStreamById(props: { key: string; id: string }) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/docustreams/${props.id}`;

  const response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Kreative-Id-Key": props.key,
    },
  });

  const data = await response.json();
  return data;
}

export async function deleteDocuStream(props: { key: string; id: number }) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/docustreams/${props.id}`;

  await fetch(requestUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Kreative-Id-Key": props.key,
    },
  });

  return true;
}

export async function archiveDocusStream(props: { key: string; id: number }) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/docustreams/${props.id}/archive`;

  await fetch(requestUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Kreative-Id-Key": props.key,
    },
  });

  return true;
}

export async function updateDocuStream(props: {
  key: string;
  id: number;
  data: any;
}) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/docustreams/${props.id}`;

  const response = await fetch(requestUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Kreative-Id-Key": props.key,
    },
    body: JSON.stringify(props.data),
  });

  const data = await response.json();
  return data;
}

export async function getDocuStreamEmail(props: { key: string; id: number }) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/docustreams/${props.id}/email`;

  const response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Kreative-Id-Key": props.key,
    },
  });

  const data = await response.json();
  return data;
}

export async function reviseDocustreamEmail(props: {
  key: string;
  id: number;
  email: string;
}) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/docustreams/${props.id}/email`;

  const response = await fetch(requestUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Kreative-Id-Key": props.key,
    },
    body: JSON.stringify({ email: props.email }),
  });

  const data = await response.json();
  return data;
}

export async function getDocuStreamNotes(props: { key: string; id: number }) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/docustreams/${props.id}/notes`;

  const response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Kreative-Id-Key": props.key,
    },
  });

  const data = await response.json();
  return data;
}

export async function getDocustreamFields(props: { key: string, id: number }) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/docustreams/${props.id}/fields`;

  const response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Kreative-Id-Key": props.key
    }
  });

  const data = await response.json();
  return data;
}

interface UpsertFieldProps {
  key: string;
  docustreamId: number;
  fieldId: number;
  value: string;
}

export async function upsertDocustreamField(props: UpsertFieldProps) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/docustreams/${props.docustreamId}/field`;

  const response = await fetch(requestUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Kreative-Id-Key": props.key,
    },
    body: JSON.stringify({ field_id: props.fieldId, value: props.value }),
  });

  const data = await response.json();
  return data;
}

interface AddScoreProps {
  key: string;
  docustreamId: number;
  score: number;
  feedback?: string;
}

export async function addScoreForDocustream(props: AddScoreProps) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/docustreams/${props.docustreamId}/score`;

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Kreative-Id-Key": props.key,
    },
    body: JSON.stringify({ score: props.score, feedback: props.feedback }),
  });

  const data = await response.json();
  return data;
}