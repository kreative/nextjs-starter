import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Steps from "@/components/onboarding/Steps";
import Authenticate from "@/components/Authenticate";
import Container from "@/components/Container";
import Navbar from "@/components/onboarding/Navbar";
import { useAtom } from "jotai";
import { accountStore } from "@/stores/account";
import { userRolesStore } from "@/stores/userRoles";
import { useCookies } from "react-cookie";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
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
import { Button } from "@/components/ui/button";
import { updateUser, updatePrefix } from "@/lib/users";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters long",
  }),
  prefix: z.enum(["Dr.", "Mr.", "Ms.", "Mrs.", "Miss", "Rev.", "Sir"], {
    required_error: "Please select a prefix",
  }),
});

export default function OnboardingMemberIndex() {
  const router = useRouter();
  const [account] = useAtom(accountStore);
  const [userRoles] = useAtom(userRolesStore);
  const [cookies] = useCookies(["kreative_id_key"]);
  const [steps] = useState([
    { id: "Step 1", name: "Kreative ID", status: "complete" },
    { id: "Step 2", name: "Your profile", status: "complete" },
  ]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await updateUser({
      ksn: account.ksn,
      key: cookies.kreative_id_key,
      data: {
        title: data.title,
      },
    });

    await updatePrefix({
      prefix: data.prefix,
      key: cookies.kreative_id_key,
    });

    router.push("/onboarding/welcome");
  }

  return (
    <div>
      <Authenticate permissions={["DOCUVET_BASE"]}>
        <Navbar logoColor="black" />
        <Container>
          <Steps steps={steps} />
          <div className="mb-4">
            <span className="text-brand-forrest px-4 py-[6px] rounded-full border border-brand-forrest">
              Your profile
            </span>
          </div>
          <h1 className="text-3xl font-bold pt-3 tracking-tight">
            Hi {account?.firstName} 👋, Let&apos;s get your profile setup.
          </h1>
          <p className="text-neutrals-8 pb-4 text-md pt-4">
            This will only be viewable to your clinic and is used to improve
            your experience. Providers are users that record appointment audio
            and need to generate medical records.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="pt-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="col-span-1 flex items-center">
                  <p className="font-medium text-brand-forrest">
                    Tell us how we should address you{" "}
                  </p>
                  <ArrowRight
                    weight="bold"
                    className="text-brand-forrest w-4 h-4 ml-2"
                  />
                </div>
                <div className="col-span-1 flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name="prefix"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Prefix..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Dr.">Dr.</SelectItem>
                            <SelectItem value="Mr.">Mr.</SelectItem>
                            <SelectItem value="Ms.">Ms.</SelectItem>
                            <SelectItem value="Mrs.">Mrs.</SelectItem>
                            <SelectItem value="Miss">Miss</SelectItem>
                            <SelectItem value="Rev.">Rev</SelectItem>
                            <SelectItem value="Sir">Sir</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <p className="font-medium tracking-tight text-xl">
                    {account.firstName + " " + account.lastName}
                  </p>
                </div>
                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <div>
                          <FormControl>
                            <Input placeholder="Your title" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-1">
                  <Select
                    value={userRoles.isProvider ? "provider" : "nonprovider"}
                    disabled
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Are you a provider or nonprovider?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="provider">Provider</SelectItem>
                      <SelectItem value="nonprovider">Nonprovider</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end pt-12">
                <Button type="submit" animated>
                  {form.formState.isSubmitting ? (
                    <div className="flex justify-center items-center space-x-3">
                      <motion.span
                        className="flex items-center w-5 h-5 border-2 border-white border-t-brand-forrest rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        role="status"
                      />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    <span className="flex items-center space-x-2">
                      Complete profile
                      <ArrowRight weight="bold" className="w-4 h-4 ml-2" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </Container>
      </Authenticate>
    </div>
  );
}
