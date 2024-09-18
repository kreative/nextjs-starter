interface IClinic {
  id: string;
  name: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  email?: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  clinic_size?: number;
  created_at?: string;
}

export default IClinic;