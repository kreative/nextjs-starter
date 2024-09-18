import { updatePrefix } from "@/lib/users";

interface GetClinicProps {
  key: string;
}

interface UpdateClinicProps {
  key: string;
  name?: string;
  address?: {
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  species?: number[];
}

interface CreateClinicProps {
  key: string;
  name: string;
  clinicSize: string;
  email: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  title: string;
  role: string;
  prefix: string;
  speciesServed: string;
}

interface UpdateClinicTtlProps {
  key: string;
  audio_file_ttl: number;
  is_overriding: boolean | string;
}

interface OnboardingProps {
  key: string;
  clinicName: string;
  userEmail: string;
  userTitle: string;
  userSpeciesServed: string;
  frequency: string;
}

export async function onboardClinicAndUser(props: OnboardingProps) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/clinics/onboarding`;

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Kreative-Id-Key": props.key,
    },
    body: JSON.stringify({
      clinic_name: props.clinicName,
      user_email: props.userEmail,
      user_title: props.userTitle,
      user_species_served: props.userSpeciesServed,
      frequency: props.frequency,
    }),
  });

  const data = await response.json();
  return data;
}

export async function getClinic(props: GetClinicProps) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/veterinarians/clinics`;

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

export async function updateClinic(props: UpdateClinicProps) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/clinics/update`;

  const response = await fetch(requestUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Kreative-Id-Key": props.key,
    },
    body: JSON.stringify({
      name: props.name,
      address_1: props.address?.address1,
      address_2: props.address?.address2,
      city: props.address?.city,
      state: props.address?.state,
      zip: props.address?.zip,
      country: props.address?.country,
      species: props?.species,
    }),
  });

  const data = await response.json();
  return data;
}

export async function createClinicOnboarding(props: CreateClinicProps) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/clinics/onboarding`;

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Kreative-Id-Key": props.key,
    },
    body: JSON.stringify({
      name: props.name,
      clinic_size: parseInt(props.clinicSize),
      address_1: props.address1,
      address_2: props.address2 ? props.address2 : "",
      city: props.city,
      state: props.state,
      zip: props.zip,
      country: props.country,
      email: props.email,
      phone: "",
      title: props.title,
      role: props.role,
      species_served: props.speciesServed
    }),
  });

  const kreativeIdData = await updatePrefix({
    key: props.key,
    prefix: props.prefix,
  });

  const data = await response.json();
  return { data, kreativeIdData };
}

export async function updateAudioFileTtl(props: UpdateClinicTtlProps) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/clinics/update`;

  console.log(props);

  const response = await fetch(requestUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Kreative-Id-Key": props.key,
    },
    body: JSON.stringify({
      audio_file_ttl: props.audio_file_ttl,
      is_overriding_audio_file_ttl: props.is_overriding,
    }),
  });

  const data = await response.json();
  return { data };
}
