interface KeyProps {
  key: string;
}

interface CreateSubscriptionProps {
  key: string;
  frequency: string;
}

export async function getSubscription(props: KeyProps) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/stripe/subscription`;

  const response = await fetch(requestUrl, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Kreative-Id-Key": props.key,
    },
  });

  const data = await response.json();
  const interval = data.subscription.items.data[0].plan.interval;
  const quantity = data.subscription.items.data[0].quantity;
  const status = data.subscription.status;
  const trialEnd = data.subscription.trial_end;
  const trialStart = data.subscription.trial_start;
  const periodEnd = data.subscription.current_period_end;

  // calculate days left on the trial
  const today = new Date();
  const trialEndDate = new Date(trialEnd * 1000);
  const trialStartDate = new Date(trialStart * 1000);
  const daysLeft = Math.ceil((trialEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // create a human readable date for the trial end
  const trialEndHuman = trialEndDate.toLocaleDateString("en-US");

  // create human readable date for the period end
  const periodEndHuman = new Date(periodEnd * 1000).toLocaleDateString("en-US");

  return {
    plan_type: interval === "year" ? "annually" : "monthly",
    price: interval === "year" ? 1788 : 199,
    quantity,
    status,
    daysLeft,
    trialEndHuman,
    periodEndHuman,
  };
}

export async function createSubscription(props: CreateSubscriptionProps) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/stripe/subscription`;

  const response = await fetch(requestUrl, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Kreative-Id-Key": props.key,
    },
    body: JSON.stringify({ frequency: props.frequency }),
  });

  const data = await response.json();
  return data;
}

export async function cancelSubscription(props: KeyProps) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/stripe/subscription`;

  return await fetch(requestUrl, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Kreative-Id-Key": props.key,
    },
  });
}

export async function createCustomerPortalSession(props: KeyProps) {
  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/stripe/create-customer-portal-session`;

  const response = await fetch(requestUrl, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Kreative-Id-Key": props.key,
    },
  });

  const data = await response.json();
  return data;
}

interface CheckoutSessionProps {
  key: string;
  priceId: string;
  quantity: number;
  email: string;
  trialDays?: number;
}

export async function createCheckoutSession(props: CheckoutSessionProps) {
  const envUrl = process.env.NEXT_PUBLIC_ENV === "development" ? "http://localhost:3000" : "https://docuvet.kreativeusa.com";
  const callbackUrl = `${envUrl}/subscription-created?`;
  const paymentMethod = "if_required";

  let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/stripe/create-checkout-session`;

  const response = await fetch(requestUrl, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Kreative-Id-Key": props.key,
    },
    body: JSON.stringify({
      price_id: props.priceId,
      quantity: props.quantity,
      email: props.email,
      callback_url: callbackUrl,
      collect_payment_method: paymentMethod,
      trial_days: props.trialDays ? props.trialDays : null,
    }),
  });

  const data = await response.json();
  return data;
}