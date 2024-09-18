interface ReplaceRolesForUserProps {
  ksn: number;
  email: string;
  key: string;
  newRoles: string[];
  oldRoles: string[];
}

export async function replaceRolesForUser(props: ReplaceRolesForUserProps) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/veterinarians/${props.ksn}/roles`;
  let response;

  try {
    response = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Kreative-Id-Key": props.key,
      },
      body: JSON.stringify({
        email: props.email,
        new_roles: props.newRoles,
        old_roles: props.oldRoles
      }),
    });
  } catch (e: any) {
    throw new Error(e);
  }

  const data = await response.json();
  return data;
}