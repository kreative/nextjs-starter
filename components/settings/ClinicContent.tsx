import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Container from "@/components/Container";
import { FormSkeleton } from "@/components/settings/SettingsSkeleton";
import SectionDivider from "@/components/SectionDivider";
import TeamSection from "@/components/settings/TeamSection";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Lightbulb } from "@phosphor-icons/react/dist/ssr";
import { z } from "zod";
import { getClinic, updateClinic } from "@/lib/clinics";
import { useCookies } from "react-cookie";
import { useAtom } from "jotai";
import { accountStore } from "@/stores/account";
import ClinicAutoDeleteForm from "./clinic/ClinicAutoDeleteForm";
import { ChangeTitleSkeleton } from "@/components/settings/SettingsSkeleton";
import { getReorderedCountriesList } from "@/lib/utils";
import InviteSection from "./clinic/InviteSection";

const clinicNameFormSchema = z.object({
  name: z.string().min(2, {
    message: "Title must be at least 2 characters long",
  }),
});

const addressFormSchema = z.object({
  address1: z.string().min(2, {
    message: "Address must be at least 2 characters long",
  }),
  address2: z.string().optional(),
  city: z.string().min(2, {
    message: "City must be at least 2 characters long",
  }),
  state: z.string().min(2, {
    message: "State must be at least 2 characters long",
  }),
  zip: z.string().min(2, {
    message: "Zip must be at least 2 characters long",
  }),
  country: z.string().min(2, {
    message: "Country must be at least 2 characters long",
  }),
});

interface ClinicContentProps {
  isAdmin: boolean;
  isSubscribed: boolean;
}

export default function ClinicContent(props: ClinicContentProps) {
  const [account] = useAtom(accountStore);
  const [cookies] = useCookies(["kreative_id_key"]);
  const { toast } = useToast();

  const { isPending, isSuccess, data } = useQuery({
    queryKey: ["clinic", account.ksn],
    queryFn: async () => {
      const data = await getClinic({
        key: cookies.kreative_id_key,
      });
      return data;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async ({
      name,
      address1,
      address2,
      city,
      state,
      zip,
      country,
    }: {
      name?: string;
      address1?: string;
      address2?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
    }) => {
      const data = await updateClinic({
        key: cookies.kreative_id_key,
        name,
        address: {
          address1,
          address2,
          city,
          state,
          zip,
          country,
        },
      });
      return data;
    },
    onSuccess: (data, variables, context) => {
      toast({
        title: "Woohoo 🎉",
        description: "Your clinic details have been been updated.",
      });
    },
  });

  const clinicNameForm = useForm<z.infer<typeof clinicNameFormSchema>>({
    resolver: zodResolver(clinicNameFormSchema),
    defaultValues: {
      name: data?.clinic.name || "",
    },
  });

  function onSubmitClinicName(values: z.infer<typeof clinicNameFormSchema>) {
    mutate({ name: values.name });
  }

  const addressForm = useForm<z.infer<typeof addressFormSchema>>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      address1: data?.clinic.address_1 || "",
      address2: data?.clinic.address_2 || "",
      city: data?.clinic.city || "",
      state: data?.clinic.state || "",
      zip: data?.clinic.zip || "",
      country: data?.clinic.country || "",
    },
  });

  function onSubmitAddress(values: z.infer<typeof addressFormSchema>) {
    mutate({
      address1: values.address1,
      address2: values.address2,
      city: values.city,
      state: values.state,
      zip: values.zip,
      country: values.country,
    });
  }

  useEffect(() => {
    clinicNameForm.reset({
      name: data?.clinic.name || "",
    });
    addressForm.reset({
      address1: data?.clinic.address_1 || "",
      address2: data?.clinic.address_2 || "",
      city: data?.clinic.city || "",
      state: data?.clinic.state || "",
      zip: data?.clinic.zip || "",
      country: data?.clinic.country || "",
    });
  }, [isPending, clinicNameForm, addressForm, data]);

  return (
    <Container>
      <Alert className="mb-9">
        <Lightbulb className="h-4 w-4" />
        <AlertTitle>Heads up {account.firstName}</AlertTitle>
        <AlertDescription>
          This section can only be changed by administrators and affects your
          clinic as a whole. If you see an issue or need assistance please
          contact your clinic&apos;s administrator or contact our support team
          here or in the chat below.
        </AlertDescription>
      </Alert>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="col-span-1">
          <Form {...clinicNameForm}>
            <h2 className="pb-2 text-2xl font-bold tracking-tight">
              Clinic name
            </h2>
            <p className="text-neutrals-8 pb-4 text-md">
              This will be viewable only to veterinarians and staff in your
              clinic.
            </p>
            <form
              onSubmit={clinicNameForm.handleSubmit(onSubmitClinicName)}
              className="space-y-4"
            >
              <FormField
                control={clinicNameForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    {isPending ? <FormSkeleton /> : null}
                    {isSuccess ? (
                      <div>
                        <FormControl>
                          <Input
                            disabled={!props.isAdmin}
                            placeholder="Clinic name"
                            {...field}
                          />
                        </FormControl>
                      </div>
                    ) : null}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-start">
                <Button disabled={!props.isAdmin} type="submit" animated>
                  Update name
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <div className="col-span-1">
          <Form {...addressForm}>
            <h2 className="pb-2 text-2xl font-bold tracking-tight">
              Clinic address
            </h2>
            <p className="text-neutrals-8 pb-4 text-md">
              This should be the physical address of your location and does not
              need to specifically be a billing address.
            </p>
            <form
              onSubmit={addressForm.handleSubmit(onSubmitAddress)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <FormField
                  control={addressForm.control}
                  name="address1"
                  render={({ field }) => (
                    <FormItem>
                      {isPending ? <FormSkeleton /> : null}
                      {isSuccess ? (
                        <div>
                          <FormControl>
                            <Input
                              disabled={!props.isAdmin}
                              placeholder="Address 1"
                              {...field}
                            />
                          </FormControl>
                        </div>
                      ) : null}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addressForm.control}
                  name="address2"
                  render={({ field }) => (
                    <FormItem>
                      {isPending ? <FormSkeleton /> : null}
                      {isSuccess ? (
                        <div>
                          <FormControl>
                            <Input
                              disabled={!props.isAdmin}
                              placeholder="Address 2"
                              {...field}
                            />
                          </FormControl>
                        </div>
                      ) : null}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={addressForm.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        {isPending ? <FormSkeleton /> : null}
                        {isSuccess ? (
                          <div>
                            <FormControl>
                              <Input
                                disabled={!props.isAdmin}
                                placeholder="City"
                                {...field}
                              />
                            </FormControl>
                          </div>
                        ) : null}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addressForm.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        {isPending ? <FormSkeleton /> : null}
                        {isSuccess ? (
                          <div>
                            <FormControl>
                              <Input
                                disabled={!props.isAdmin}
                                placeholder="State or Province"
                                {...field}
                              />
                            </FormControl>
                          </div>
                        ) : null}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <FormField
                      control={addressForm.control}
                      name="zip"
                      render={({ field }) => (
                        <FormItem>
                          {isPending ? <FormSkeleton /> : null}
                          {isSuccess ? (
                            <div>
                              <FormControl>
                                <Input
                                  disabled={!props.isAdmin}
                                  placeholder="Zip code"
                                  {...field}
                                />
                              </FormControl>
                            </div>
                          ) : null}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <FormField
                      control={addressForm.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          {isPending ? <FormSkeleton /> : null}
                          {isSuccess ? (
                            <div>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger disabled={!props.isAdmin}>
                                    <SelectValue placeholder="Select country..."></SelectValue>
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.entries(
                                    getReorderedCountriesList()
                                  ).map(([code, country]) => (
                                    <SelectItem key={code} value={country.name}>
                                      {country.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          ) : null}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-start">
                <Button disabled={!props.isAdmin} type="submit" animated>
                  Update address
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <SectionDivider />
      <TeamSection isAdmin={props.isAdmin} isSubscribed={props.isSubscribed} />
      <SectionDivider />
      <InviteSection
        isAdmin={props.isAdmin}
        isSubscribed={props.isSubscribed}
      />
      <SectionDivider />
      <div>
        <div className="mb-4">
          <span className="py-1 px-3 rounded-full border border-brand-forrest text-brand-forrest font-medium">
            Clinic override
          </span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight pb-2">
          Auto-delete your clinic&apos;s Docustream audio files
        </h2>
        <p className="text-md text-neutrals-10 mb-6">
          You can enable auto-deletion of your clinic&apos;s Docustream audio
          files after they have been processed from our servers.{" "}
          <span className="font-bold text-brand-forrest tracking-tight">
            This will override auto-delete schedules for any providers in your
            clinic. Your clinic&apos;s audio files will instead use the settings
            below.
          </span>
        </p>
        <div className="w-full sm:w-1/2">
          {isPending && <ChangeTitleSkeleton />}
          {isSuccess && data && (
            <ClinicAutoDeleteForm
              ksn={account.ksn}
              isAdmin={props.isAdmin}
              currentTtl={data?.clinic.audio_file_ttl || 18250}
              currentIsOverriding={
                data?.clinic.is_overriding_audio_file_ttl || false
              }
            />
          )}
        </div>
      </div>
    </Container>
  );
}
