const reasonsForLeaving = [
  "I found the mobile app too hard to use.",
  "I found the web application too hard to use.",
  "I found an alternative that suits my needs better.",
  "I couldn't justify the cost.",
  "I found the generated medical records too inaccurate.",
  "I found the generated medical records too time-consuming to review.",
  "I didn't use it enough.",
];

interface OffboardingSurveyProps {
  setStep: (step: number) => void;
}

export default function OffboardingSurvey(props: OffboardingSurveyProps) {
  return <div>Survey</div>;
  // const router = useRouter();
  // const [account] = useAtom(accountStore);

  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     reasons: [],
  //     feedback: "",
  //   },
  // });

  // async function onSubmit(data: z.infer<typeof formSchema>) {
  //   await fetch('/api/collect-exit-survey', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       ksn: account?.ksn,
  //       reasons: data.reasons,
  //       feedback: data.feedback,
  //     }),
  //   });

  //   props.setStep(2);
  // }

  // function handleExit() {
  //   router.push("/dash/settings?tab=billing");
  // }

  // return (
  //   <div>
  //     <h1 className="text-3xl font-bold tracking-tight">
  //       {account?.firstName}, we&apos;re sorry to see you and your clinic go.
  //     </h1>
  //     <p className="text-md text-neutrals-7 pb-6 pt-3 font-medium tracking-tight">
  //       <span className="text-brand-primary font-bold">
  //         Your feedback is the only way we can improve this product
  //       </span>{" "}
  //       for veterinarians across the globe. We would be grateful if you could
  //       take a few seconds to share your thoughts with us.
  //     </p>
  //     <Form {...form}>
  //       <form onSubmit={form.handleSubmit(onSubmit)} className="pt-3">
  //         <FormLabel className="text-lg font-medium">
  //           What reasons caused you to discontinue using Kreative DocuVet?
  //         </FormLabel>
  //         <div className="space-y-3 pt-3">
  //           {reasonsForLeaving.map((reason, index) => (
  //             <FormField
  //               key={index}
  //               control={form.control}
  //               name="reasons"
  //               render={({ field }) => {
  //                 return (
  //                   <FormItem
  //                     key={index}
  //                     className="flex flex-row items-start space-x-3 space-y-0"
  //                   >
  //                     <FormControl>
  //                       <Checkbox
  //                         checked={field.value?.includes(reason)}
  //                         onCheckedChange={(checked) => {
  //                           return checked
  //                             ? field.onChange([...field.value, reason])
  //                             : field.onChange(
  //                                 field.value?.filter(
  //                                   (value) => value !== reason
  //                                 )
  //                               );
  //                         }}
  //                       />
  //                     </FormControl>
  //                     <FormLabel className="text-sm">{reason}</FormLabel>
  //                   </FormItem>
  //                 );
  //               }}
  //             />
  //           ))}
  //         </div>
  //         <FormMessage className="pt-6 text-md">
  //           {form.formState.errors.reasons?.message}
  //         </FormMessage>
  //         <div className="pt-6" />
  //         <FormLabel className="text-lg font-medium">
  //           Is there anything else that we could have done to better serve you?
  //         </FormLabel>
  //         <FormField
  //           control={form.control}
  //           name="feedback"
  //           render={({ field }) => {
  //             return (
  //               <Textarea
  //                 {...field}
  //                 placeholder="I feel that it would have been better if..."
  //                 className="mt-3 pt-3"
  //               />
  //             );
  //           }}
  //         />
  //         <div className="flex items-center justify-end gap-3 pt-12">
  //           <Button variant="ghost" type="button" onClick={handleExit} animated>
  //             Nevermind, go back
  //           </Button>
  //           <Button
  //             variant="default"
  //             className="flex items-center"
  //             type="submit"
  //             animated
  //           >
  //             {form.formState.isSubmitting ? (
  //               <div className="flex items-center justify-center space-x-3">
  //                 <motion.span
  //                   className="border-t-brand-forrest flex h-5 w-5 items-center rounded-full border-2 border-white"
  //                   animate={{ rotate: 360 }}
  //                   transition={{
  //                     duration: 1,
  //                     repeat: Infinity,
  //                     ease: "linear",
  //                   }}
  //                   role="status"
  //                 />
  //                 <span>Submitting...</span>
  //               </div>
  //             ) : (
  //               <span className="flex items-center space-x-2">
  //                 Submit and continue
  //                 <CaretDown className="ml-2" weight="bold" />
  //               </span>
  //             )}
  //           </Button>
  //         </div>
  //       </form>
  //     </Form>
  //   </div>
  // );
}
