interface KeyProps {
  key: string;
}

export async function getAccountList({ key }: KeyProps): Promise<any> {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/clinics/users`;

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

export async function getProviders({ key }: KeyProps): Promise<any> {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/clinics/providers`;

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

interface SingleUserProps {
  key: string;
  ksn: number;
  email?: string;
}

export async function getUser({ ksn, key }: SingleUserProps): Promise<any> {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/veterinarians/${ksn}`;

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

export async function getCurrentUser({ key }: KeyProps): Promise<any> {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/veterinarians/me`;

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

interface UpdateUserProps {
  ksn: number;
  key: string;
  data: any;
}

export async function updateUser(props: UpdateUserProps): Promise<any> {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/veterinarians/${props.ksn}`;

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

export async function removeUser({
  ksn,
  key,
  email,
}: SingleUserProps): Promise<any> {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/veterinarians/${ksn}`;
  let response;

  try {
    response = await fetch(requestUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Kreative-Id-Key": key,
      },
      body: JSON.stringify({ email }),
    });
  } catch (e: any) {
    throw new Error(e);
  }

  return response;
}

interface NewUserProps {
  key: string;
  inviteCode: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  speciesServed: string;
}

export async function createNewUser(props: NewUserProps): Promise<any> {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/veterinarians/onboarding`;
  let response;

  try {
    response = await fetch(requestUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Kreative-Id-Key": props.key,
      },
      body: JSON.stringify({
        fname: props.firstName,
        lname: props.lastName,
        email: props.email,
        title: props.title,
        species_served: props.speciesServed,
        invite_code: props.inviteCode,
      }),
    });
  } catch (e: any) {
    throw new Error(e);
  }

  const data = await response.json();
  return data;
}

export async function getProviderCount(props: KeyProps): Promise<any> {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/veterinarians/providers_count`;

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

interface UpdatePrefixProps {
  prefix: string;
  key: string;
}

export async function updatePrefix(props: UpdatePrefixProps): Promise<any> {
  let requestUrl = `https://id-api.kreativeusa.com/v1/accounts/prefix`;

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      KREATIVE_ID_KEY: props.key,
      KREATIVE_AIDN: process.env.NEXT_PUBLIC_AIDN!,
    },
    body: JSON.stringify({
      prefix: props.prefix,
    }),
  });

  const data = await response.json();
  return data;
}

interface UpdateTtlProps {
  key: string;
  ttl: number | null;
  ksn: number;
}

export async function updateTtl(props: UpdateTtlProps): Promise<any> {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/veterinarians/${props.ksn}`;

  const response = await fetch(requestUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Kreative-Id-Key": props.key,
    },
    body: JSON.stringify({
      audio_file_ttl: props.ttl,
    }),
  });

  console.log(response);

  const data = await response.json();
  return data;
}

interface UpdateLogoProps {
  file: any,
  key: string,
}

export async function updateLogo(props: UpdateLogoProps): Promise<any> {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/veterinarians/logo`;

  const formData = new FormData();
  formData.append("file", props.file);

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Kreative-Id-Key": props.key,
    },
    body: formData,
  });

  const data = await response.json();
  return data;
}