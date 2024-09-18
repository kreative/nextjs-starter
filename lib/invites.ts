interface KeyProps {
  key: string;
}

export async function getClinicInvites({ key }: KeyProps): Promise<any> {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/invites`;

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

interface CancelInviteProps {
  key: string;
  inviteId: string;
}


export async function cancelInvite(props: CancelInviteProps) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/invites/${props.inviteId}/cancel`;

  const response = await fetch(requestUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Kreative-Id-Key": props.key,
    },
  });

  const data = await response.json();
  return data;
}

export async function deleteInvite(props: CancelInviteProps) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/invites/${props.inviteId}`;

  const response = await fetch(requestUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Kreative-Id-Key": props.key,
    },
  });

  // we're betting that response.ok is true
  return;
}

export async function getInvite(props: CancelInviteProps): Promise<any> {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/invites/${props.inviteId}`;

  const response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Kreative-Id-Key": props.key,
    },
  });

  if (response.status === 404) return 404;

  const data = await response.json();
  return data;
}

interface NewInviteProps {
  key: string;
  email: string;
  role: string;
  isAdmin: boolean;
}

export async function createNewInvite(props: NewInviteProps) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/invites`;

  const isProvider = props.role === "provider";

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Kreative-Id-Key": props.key,
    },
    body: JSON.stringify({
      invitee_email: props.email,
      is_provider: isProvider,
      is_admin: props.isAdmin,
    }),
  });

  const data = await response.json();
  return data;
}