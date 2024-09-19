export default function Onboarding() {
  return <div>Onboarding</div>;
}

// import Link from "next/link";
// import { cn } from "@/lib/utils";
// import { useRouter } from "next/router";
// import { useState, useEffect } from "react";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectValue,
//   SelectItem,
//   SelectTrigger,
// } from "@/components/ui/select";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Check } from "@phosphor-icons/react/dist/ssr";
// import {
//   Dog,
//   Cat,
//   Horse,
//   Cow,
//   Stethoscope,
//   ArrowLeft,
//   ArrowRight,
// } from "@phosphor-icons/react/dist/ssr";
// import { motion, AnimatePresence } from "framer-motion";
// import Authenticate from "@/components/Authenticate";
// import Navbar from "@/components/NavbarSimple";
// import DotSteps from "@/components/DotSteps";
// import Container from "@/components/Container";
// import { onboardClinicAndUser } from "@/lib/clinics";
// import { useAtom } from "jotai";
// import { accountStore } from "@/stores/account";
// import { clinicStore } from "@/stores/clinic";
// import { useCookies } from "react-cookie";
// import { BASE_ROLE } from "@/lib/constants";

// interface IOnboardingData {
//   clinicName: string;
//   userTitle: string;
//   speciesServed: string;
//   trialFrequency: string;
// }

// interface PriceDetailsProps {
//   price: number;
//   providers: number;
//   frequency: "monthly" | "annual";
// }

// interface CheckItemProps {
//   text: string;
// }

// const NUM_OF_STEPS = 6;

// export default function Onboarding() {
//   const router = useRouter();
//   const [account] = useAtom(accountStore);
//   const [clinic, setClinic] = useAtom(clinicStore);
//   const [cookies, setCookie, removeCookie] = useCookies(["kreative_id_key"]);
//   const [step, setStep] = useState(0);
//   const [alreadySubscribed, setAlreadySubscribed] = useState(false);
//   const [textIsValid, setTextIsValid] = useState(true);
//   const [selectIsValid, setSelectIsValid] = useState(true);
//   const [isPending, setIsPending] = useState(false);
//   const [data, setData] = useState<IOnboardingData>({
//     clinicName: "",
//     userTitle: "",
//     speciesServed: "",
//     trialFrequency: "",
//   });

//   useEffect(() => {
//     if (step === 0 && !clinic.id) setTimeout(() => setStep(1), 2500);
//     else setAlreadySubscribed(true);
//   }, [step, clinic]);

//   const onboard = async (frequency: string) => {
//     setIsPending(true);

//     const response = await onboardClinicAndUser({
//       key: cookies.kreative_id_key,
//       clinicName: data.clinicName,
//       userEmail: account.email,
//       userTitle: data.userTitle,
//       userSpeciesServed: data.speciesServed,
//       frequency,
//     });

//     if (response.keychain) {
//       removeCookie("kreative_id_key");
//       setCookie("kreative_id_key", response.keychain, {
//         secure: process.env.NEXT_PUBLIC_ENV === "development" ? false : true,
//         sameSite: "strict",
//         path: "/",
//       });
//     }

//     setClinic({ id: response.clinic.id, name: response.clinic.name });

//     setIsPending(false);
//     setStep(5);
//   };

//   function CheckItem(props: CheckItemProps) {
//     return (
//       <div className="flex items-center space-x-2">
//         <Check weight="bold" className="text-brand-seafoam" size={20} />
//         <p className="font-medium tracking-tight">{props.text}</p>
//       </div>
//     );
//   }

//   function PriceDetails(props: PriceDetailsProps) {
//     const totalPrice = props.price * props.providers;
//     const today = new Date();
//     const endDate = new Date(today);
//     endDate.setDate(endDate.getDate() + 14);
//     const endDateString = endDate.toDateString();

//     return (
//       <div>
//         <div className="flex items-end space-x-1">
//           <h3 className="bg-gradient-to-r from-brand-seafoam to-brand-medicalblue inline-block text-transparent bg-clip-text text-6xl font-bold">{`$${props.price}`}</h3>
//           {props.frequency === "monthly" && (
//             <p className="text-neutrals-7 font-medium">per month</p>
//           )}
//           {props.frequency === "annual" && (
//             <div className="flex space-x-2 items-center">
//               <p className="text-neutrals-7 font-medium">per month</p>
//               <span className="bg-brand-primary px-2.5 py-0.5 text-white rounded-full text-[10px] sm:text-[12px] font-medium italic">
//                 Save 10%
//               </span>
//             </div>
//           )}
//         </div>
//         <div className="text-neutrals-8 mt-8 mb-4">
//           {props.frequency === "monthly" && (
//             <p>
//               Your free trial will end on{" "}
//               <span className="font-bold">{endDateString}</span>. Then,
//               you&apos;ll be billed monthly at{" "}
//               <span className="font-bold">${totalPrice}/month</span> for{" "}
//               <span className="font-bold">{props.providers} provider(s)</span>.
//             </p>
//           )}
//           {props.frequency === "annual" && (
//             <p>
//               Your free trial will end on{" "}
//               <span className="font-bold">{endDateString}</span>. Then,
//               you&apos;ll be billed annually at{" "}
//               <span className="font-bold">${totalPrice * 12}/year</span> for{" "}
//               <span className="font-bold">{props.providers} provider(s)</span>.
//             </p>
//           )}
//         </div>
//         <div className="space-y-2">
//           <CheckItem text="Priority support" />
//           <CheckItem text="Full access to Kreative DocuVet" />
//           <CheckItem text="Unlimited notes" />
//         </div>
//         <div className="mt-8">
//           <Button
//             size="lg"
//             className="transition ease-in-out w-full shadow-xl hover:shadow-2xl text-lg py-7"
//             onClick={() => onboard(props.frequency)}
//             animated
//             fullWidth
//           >
//             {isPending ? (
//               <div className="flex justify-center items-center space-x-3">
//                 <motion.span
//                   className="flex items-center w-5 h-5 border-2 border-white border-t-brand-forrest rounded-full"
//                   animate={{ rotate: 360 }}
//                   transition={{
//                     duration: 1,
//                     repeat: Infinity,
//                     ease: "linear",
//                   }}
//                   role="status"
//                 />
//                 <span>Activating...</span>
//               </div>
//             ) : (
//               "Activate my 14-day free trial"
//             )}
//           </Button>
//           <p className="text-center text-neutrals-8 text-[12px] mt-3">
//             By activating your trial and completing your setup, you are agreeing
//             to our{" "}
//             <Link
//               href="https://kreativedocuvet.com/privacy-policy"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-brand-secondary font-medium hover:underline"
//             >
//               Privacy Policy
//             </Link>{" "}
//             and{" "}
//             <Link
//               href="https://kreativedocuvet.com/terms-of-use"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-brand-secondary font-medium hover:underline"
//             >
//               Terms of Use
//             </Link>
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <Authenticate permissions={[BASE_ROLE]}>
//       <ScrollArea className="background-gradient-3 h-[120vh]">
//         <Navbar />
//         <Container className="w-full flex-items-center justify-center">
//           <DotSteps steps={NUM_OF_STEPS} currentStep={step} />
//         </Container>
//         <Container className="flex items-center justify-center min-h-[80vh]">
//           <AnimatePresence mode="wait">
//             {step === 0 && (
//               <motion.div
//                 key={0}
//                 className="w-full"
//                 initial={{ x: 0, opacity: 0 }}
//                 animate={{
//                   x: 0,
//                   opacity: 1,
//                   transition: { duration: 0.35, delay: 0 },
//                 }}
//                 exit={{
//                   x: 0,
//                   opacity: 0,
//                   transition: { duration: 0.35, delay: 0.35 },
//                 }}
//               >
//                 <motion.h1
//                   className="text-white text-6xl sm:text-8xl font-bold tracking-tight text-center mb-12"
//                   initial={{ y: 25, opacity: 0 }}
//                   animate={{
//                     y: 0,
//                     opacity: 1,
//                     transition: { duration: 0.35, delay: 0.25 },
//                   }}
//                   exit={{
//                     y: 25,
//                     opacity: 0,
//                     transition: { duration: 0.25 },
//                   }}
//                 >
//                   Welcome to Kreative DocuVet
//                   <motion.span
//                     className="text-5xl sm:text-7xl ml-2"
//                     initial={{ scale: 0.85, opacity: 0, y: 10 }}
//                     animate={{
//                       scale: 1,
//                       opacity: 1,
//                       y: 0,
//                       transition: { duration: 0.35, delay: 0.5 },
//                     }}
//                     exit={{
//                       scale: 0.85,
//                       opacity: 0,
//                       y: 10,
//                       transition: { duration: 0.25, delay: 0.1 },
//                     }}
//                   >
//                     👋
//                   </motion.span>
//                 </motion.h1>
//                 {alreadySubscribed && (
//                   <div>
//                     <motion.p
//                       className="text-white text-xl text-center mb-12"
//                       initial={{ y: 25, opacity: 0 }}
//                       animate={{
//                         y: 0,
//                         opacity: 1,
//                         transition: { duration: 0.35, delay: 0.35 },
//                       }}
//                       exit={{
//                         y: 25,
//                         opacity: 0,
//                         transition: { duration: 0.25, delay: 0.1 },
//                       }}
//                     >
//                       It seems you&apos;re already subscribed to Kreative
//                       DocuVet. If you&apos;re looking to add a new clinic or
//                       user, please reach out to our support team at{" "}
//                       <a
//                         href="mailto:armaan@kreativedocuvet.com"
//                         className="underline text-white/90"
//                       >
//                         armaan@kreativedocuvet.com
//                       </a>
//                       .
//                     </motion.p>
//                     <motion.div
//                       initial={{ y: 25, opacity: 0, scale: 0.85 }}
//                       animate={{
//                         y: 0,
//                         opacity: 1,
//                         scale: 1,
//                         transition: { duration: 0.35, delay: 0.35 },
//                       }}
//                       exit={{
//                         y: 25,
//                         opacity: 0,
//                         scale: 0.85,
//                         transition: { duration: 0.25, delay: 0.1 },
//                       }}
//                     >
//                       <Button
//                         animated
//                         className="w-full text-lg py-6"
//                         onClick={(e) => {
//                           router.push("/dash/docustreams");
//                         }}
//                       >
//                         Go to your dashboard
//                       </Button>
//                     </motion.div>
//                   </div>
//                 )}
//               </motion.div>
//             )}
//             {step === 1 && (
//               <motion.div
//                 key={1}
//                 className="w-full sm:w-[75%]"
//                 initial={{ x: 0, opacity: 0 }}
//                 animate={{
//                   x: 0,
//                   opacity: 1,
//                   transition: { duration: 0.35, delay: 0 },
//                 }}
//                 exit={{
//                   x: 0,
//                   opacity: 0,
//                   transition: { duration: 0.35, delay: 0.35 },
//                 }}
//               >
//                 <motion.h1
//                   className="text-white text-5xl sm:text-7xl font-bold tracking-tight text-center mb-12"
//                   initial={{ y: 25, opacity: 0 }}
//                   animate={{
//                     y: 0,
//                     opacity: 1,
//                     transition: { duration: 0.25, delay: 0.25 },
//                   }}
//                   exit={{
//                     y: 25,
//                     opacity: 0,
//                     transition: { duration: 0.25 },
//                   }}
//                 >
//                   What&apos;s the name of your clinic?
//                 </motion.h1>
//                 <motion.div
//                   initial={{ y: 20, opacity: 0, scale: 0.85 }}
//                   animate={{
//                     y: 0,
//                     opacity: 1,
//                     scale: 1,
//                     transition: { duration: 0.35, delay: 0.47 },
//                   }}
//                   exit={{
//                     y: 25,
//                     opacity: 0,
//                     scale: 0.85,
//                     transition: { duration: 0.2, delay: 0.125 },
//                   }}
//                 >
//                   <Input
//                     value={data.clinicName}
//                     onChange={(e) =>
//                       setData({ ...data, clinicName: e.target.value })
//                     }
//                     onKeyDown={(e) => {
//                       setTextIsValid(true);

//                       if (e.key === "Enter") {
//                         if (data.clinicName.length === 0) {
//                           setTextIsValid(false);
//                           return;
//                         }

//                         setStep(2);
//                       }
//                     }}
//                     className={cn(
//                       "my-4 bg-white/20 border focus-visible:ring-0 text-white font-medium text-3xl tracking-tight h-16",
//                       !textIsValid
//                         ? "border-red-500 focus-visible:border-red-500 animate-shake"
//                         : "border-white/20 focus-visible:border-white/20"
//                     )}
//                   />
//                 </motion.div>
//                 <motion.div
//                   initial={{ y: 25, opacity: 0, scale: 0.85 }}
//                   animate={{
//                     y: 0,
//                     opacity: 1,
//                     scale: 1,
//                     transition: { duration: 0.35, delay: 0.35 },
//                   }}
//                   exit={{
//                     y: 25,
//                     opacity: 0,
//                     scale: 0.85,
//                     transition: { duration: 0.25, delay: 0.1 },
//                   }}
//                 >
//                   <Button
//                     animated
//                     className="w-full text-lg py-6"
//                     onClick={(e) => {
//                       if (data.clinicName.length === 0) {
//                         setTextIsValid(false);
//                         return;
//                       }
//                       setStep(2);
//                     }}
//                   >
//                     Continue
//                   </Button>
//                 </motion.div>
//               </motion.div>
//             )}
//             {step === 2 && (
//               <motion.div
//                 key={2}
//                 className="w-full sm:w-[75%]"
//                 initial={{ x: 0, opacity: 0 }}
//                 animate={{
//                   x: 0,
//                   opacity: 1,
//                   transition: { duration: 0.35, delay: 0 },
//                 }}
//                 exit={{
//                   x: 0,
//                   opacity: 0,
//                   transition: { duration: 0.35, delay: 0.35 },
//                 }}
//               >
//                 <motion.h1
//                   className="text-white text-5xl sm:text-7xl font-bold tracking-tight text-center mb-12"
//                   initial={{ y: 25, opacity: 0 }}
//                   animate={{
//                     y: 0,
//                     opacity: 1,
//                     transition: { duration: 0.25, delay: 0.25 },
//                   }}
//                   exit={{
//                     y: 25,
//                     opacity: 0,
//                     transition: { duration: 0.25 },
//                   }}
//                 >
//                   What best describes your role?
//                 </motion.h1>
//                 <motion.div
//                   initial={{ y: 20, opacity: 0, scale: 0.85 }}
//                   animate={{
//                     y: 0,
//                     opacity: 1,
//                     scale: 1,
//                     transition: { duration: 0.35, delay: 0.47 },
//                   }}
//                   exit={{
//                     y: 25,
//                     opacity: 0,
//                     scale: 0.85,
//                     transition: { duration: 0.2, delay: 0.125 },
//                   }}
//                 >
//                   <Select
//                     onValueChange={(value) => {
//                       setSelectIsValid(true);
//                       setData({ ...data, userTitle: value });
//                     }}
//                     defaultValue={data.userTitle}
//                   >
//                     <SelectTrigger
//                       className={cn(
//                         "my-4 bg-white/20 border focus-visible:border-transparent focus-visible:ring-0 focus:ring-0 focus:outline-none text-white font-medium text-3xl tracking-tight h-16 placeholder:text-white/50",
//                         !selectIsValid
//                           ? "border-red-500 animate-shake"
//                           : "border-white/20"
//                       )}
//                     >
//                       <SelectValue placeholder="I'm a.." />
//                     </SelectTrigger>
//                     <SelectContent className="select-none">
//                       <SelectItem value="Veterinarian">Veterinarian</SelectItem>
//                       <SelectItem value="Veterinary Assistant">
//                         Veterinary Assistant
//                       </SelectItem>
//                       <SelectItem value="Practice Manager">
//                         Practice Manager
//                       </SelectItem>
//                       <SelectItem value="Veterinary Technician Specialist (VTS)">
//                         Veterinary Technician Specialist (VTS)
//                       </SelectItem>
//                       <SelectItem value="Receptionist">Receptionist</SelectItem>
//                       <SelectItem value="Veterinary Surgeon">
//                         Veterinary Surgeon
//                       </SelectItem>
//                       <SelectItem value="Veterinary Nurse">
//                         Veterinary Nurse
//                       </SelectItem>
//                       <SelectItem value="Animal Care Attendant">
//                         Animal Care Attendant
//                       </SelectItem>
//                       <SelectItem value="Veterinary Practice Owner">
//                         Veterinary Practice Owner
//                       </SelectItem>
//                       <SelectItem value="Veterinary Pharmacist">
//                         Veterinary Pharmacist
//                       </SelectItem>
//                       <SelectItem value="Equine Veterinary Technician">
//                         Equine Veterinary Technician
//                       </SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </motion.div>
//                 <motion.div
//                   initial={{ y: 25, opacity: 0, scale: 0.85 }}
//                   animate={{
//                     y: 0,
//                     opacity: 1,
//                     scale: 1,
//                     transition: { duration: 0.35, delay: 0.35 },
//                   }}
//                   exit={{
//                     y: 25,
//                     opacity: 0,
//                     scale: 0.85,
//                     transition: { duration: 0.25, delay: 0.1 },
//                   }}
//                 >
//                   <Button
//                     animated
//                     className="w-full text-lg py-6"
//                     onClick={() => {
//                       console.log(data);
//                       if (data.userTitle === "" || data.userTitle === null) {
//                         setSelectIsValid(false);
//                         return;
//                       }
//                       setStep(3);
//                     }}
//                   >
//                     Continue
//                   </Button>
//                 </motion.div>
//                 <motion.div
//                   initial={{ y: 25, opacity: 0, scale: 0.85 }}
//                   animate={{
//                     y: 0,
//                     opacity: 1,
//                     scale: 1,
//                     transition: { duration: 0.45, delay: 0.5 },
//                   }}
//                   exit={{
//                     y: 25,
//                     opacity: 0,
//                     scale: 0.85,
//                     transition: { duration: 0.25, delay: 0.12 },
//                   }}
//                 >
//                   <Button
//                     variant="ghost"
//                     className="w-full transition-colors ease-in-out duration-500 text-lg py-6 text-white hover:bg-white/20 hover:text-white mt-4 flex items-center justify-center"
//                     onClick={() => setStep(1)}
//                   >
//                     <ArrowLeft className="h-7 w-7 mr-2" />
//                     Go back
//                   </Button>
//                 </motion.div>
//               </motion.div>
//             )}
//             {step === 3 && (
//               <motion.div
//                 key={3}
//                 className="w-full sm:w-[75%]"
//                 initial={{ x: 0, opacity: 0 }}
//                 animate={{
//                   x: 0,
//                   opacity: 1,
//                   transition: { duration: 0.35, delay: 0 },
//                 }}
//                 exit={{
//                   x: 0,
//                   opacity: 0,
//                   transition: { duration: 0.35, delay: 0.35 },
//                 }}
//               >
//                 <motion.h1
//                   className="text-white text-5xl sm:text-7xl font-bold tracking-tight text-center mb-12"
//                   initial={{ y: 25, opacity: 0 }}
//                   animate={{
//                     y: 0,
//                     opacity: 1,
//                     transition: { duration: 0.25, delay: 0.25 },
//                   }}
//                   exit={{
//                     y: 25,
//                     opacity: 0,
//                     transition: { duration: 0.25 },
//                   }}
//                 >
//                   Which species do you serve?
//                 </motion.h1>
//                 <motion.div
//                   className="grid grid-cols-4 md:grid-cols-3 gap-4"
//                   initial={{ y: 20, opacity: 0, scale: 0.85 }}
//                   animate={{
//                     y: 0,
//                     opacity: 1,
//                     scale: 1,
//                     transition: { duration: 0.35, delay: 0.47 },
//                   }}
//                   exit={{
//                     y: 25,
//                     opacity: 0,
//                     scale: 0.85,
//                     transition: { duration: 0.2, delay: 0.125 },
//                   }}
//                 >
//                   <motion.div
//                     whileHover={{
//                       scale: 0.95,
//                       transition: { duration: 0.25 },
//                     }}
//                     whileTap={{ scale: 0.9 }}
//                     className={cn(
//                       "col-span-2 md:col-span-1 flex flex-col items-center justify-center h-36 p-6 text-center rounded-md border-2 border-white text-white font-medium tracking-tight text-2xl bg-white/15 transition-colors ease-in-out duration-200 hover:bg-white/20 hover:cursor-pointer",
//                       data.speciesServed === "Small Animal"
//                         ? "bg-white/20 border-4"
//                         : ""
//                     )}
//                     onClick={() => {
//                       setData({ ...data, speciesServed: "Small Animal" });
//                       setTimeout(() => setStep(4), 500);
//                     }}
//                   >
//                     <div className="flex items-center justify-center mb-3">
//                       <Dog className="h-10 w-10 mr-2" />
//                       <Cat className="h-10 w-10 mr-2" />
//                     </div>
//                     Small Animal
//                   </motion.div>
//                   <motion.div
//                     whileHover={{
//                       scale: 0.9,
//                       transition: { duration: 0.25 },
//                     }}
//                     whileTap={{ scale: 0.85 }}
//                     className={cn(
//                       "col-span-2 md:col-span-1 flex flex-col items-center justify-center h-36 p-6 text-center rounded-md border-2 border-white text-white font-medium tracking-tight text-2xl bg-white/15 transition-colors ease-in-out duration-200 hover:bg-white/20 hover:cursor-pointer",
//                       data.speciesServed === "Large Animal"
//                         ? "bg-white/20 border-4"
//                         : ""
//                     )}
//                     onClick={() => {
//                       setData({ ...data, speciesServed: "Large Animal" });
//                       setTimeout(() => setStep(4), 500);
//                     }}
//                   >
//                     <div className="flex items-center justify-center mb-3">
//                       <Horse className="h-10 w-10 mr-2" />
//                       <Cow className="h-10 w-10 mr-2" />
//                     </div>
//                     Large Animal
//                   </motion.div>
//                   <div className="col-span-1 block md:hidden" />
//                   <motion.div
//                     whileHover={{
//                       scale: 0.9,
//                       transition: { duration: 0.25 },
//                     }}
//                     whileTap={{ scale: 0.85 }}
//                     className={cn(
//                       "col-span-2 md:col-span-1 flex flex-col items-center justify-center h-36 p-6 rounded-md border-2 border-white text-white font-medium tracking-tight text-2xl bg-white/15 transition-colors ease-in-out duration-200 hover:bg-white/20 hover:cursor-pointer",
//                       data.speciesServed === "Small and Large"
//                         ? "bg-white/20 border-4"
//                         : ""
//                     )}
//                     onClick={() => {
//                       setData({
//                         ...data,
//                         speciesServed: "Small and Large animal",
//                       });
//                       setTimeout(() => setStep(4), 500);
//                     }}
//                   >
//                     <div className="flex items-center justify-center mb-3">
//                       <Stethoscope className="h-10 w-10 mr-2" />
//                     </div>
//                     Both!
//                   </motion.div>
//                 </motion.div>
//                 <motion.div
//                   initial={{ y: 25, opacity: 0, scale: 0.85 }}
//                   animate={{
//                     y: 0,
//                     opacity: 1,
//                     scale: 1,
//                     transition: { duration: 0.45, delay: 0.55 },
//                   }}
//                   exit={{
//                     y: 25,
//                     opacity: 0,
//                     scale: 0.85,
//                     transition: { duration: 0.25, delay: 0.12 },
//                   }}
//                 >
//                   <Button
//                     variant="ghost"
//                     className="w-full transition-colors ease-in-out duration-500 text-lg py-6 text-white hover:bg-white/20 hover:text-white mt-4 flex items-center justify-center"
//                     onClick={() => setStep(2)}
//                   >
//                     <ArrowLeft className="h-7 w-7 mr-2" />
//                     Go back
//                   </Button>
//                 </motion.div>
//               </motion.div>
//             )}
//             {step === 4 && (
//               <motion.div
//                 key={4}
//                 className="w-full sm:w-[75%]"
//                 initial={{ x: 0, opacity: 0 }}
//                 animate={{
//                   x: 0,
//                   opacity: 1,
//                   transition: { duration: 0.35, delay: 0 },
//                 }}
//                 exit={{
//                   x: 0,
//                   opacity: 0,
//                   transition: { duration: 0.35, delay: 0.35 },
//                 }}
//               >
//                 <motion.h1
//                   className="text-white text-5xl min-[400px]:text-5xl sm:text-7xl font-bold tracking-tight leading-[3rem] min-[400px]:leading-[3.5rem] sm:leading-[5rem] text-center mb-6"
//                   initial={{ y: 25, opacity: 0 }}
//                   animate={{
//                     y: 0,
//                     opacity: 1,
//                     transition: { duration: 0.25, delay: 0.25 },
//                   }}
//                   exit={{
//                     y: 25,
//                     opacity: 0,
//                     transition: { duration: 0.25 },
//                   }}
//                 >
//                   Activate your 14-day trial 🎉
//                 </motion.h1>
//                 <motion.p
//                   className="text-white text-xl text-center mb-7"
//                   initial={{ y: 25, opacity: 0 }}
//                   animate={{
//                     y: 0,
//                     opacity: 1,
//                     transition: { duration: 0.25, delay: 0.25 },
//                   }}
//                   exit={{
//                     y: 25,
//                     opacity: 0,
//                     transition: { duration: 0.25 },
//                   }}
//                 >
//                   No credit card required, but can be added at anytime to
//                   continue your service. If no payment method is added, the
//                   service will pause.
//                 </motion.p>
//                 <motion.div
//                   initial={{ y: 35, opacity: 0, scale: 0.7 }}
//                   animate={{
//                     y: 0,
//                     opacity: 1,
//                     scale: 1,
//                     transition: { duration: 0.45, delay: 0.45 },
//                   }}
//                   exit={{
//                     y: 35,
//                     opacity: 0,
//                     scale: 0.7,
//                     transition: { duration: 0.45, delay: 0.125 },
//                   }}
//                 >
//                   <div className="p-6 border-2 border-neutrals-4 rounded-xl bg-white/70 backdrop-blur-md">
//                     <Tabs defaultValue="annual">
//                       <div className="flex justify-between items-center mb-4">
//                         <div>
//                           <p className="text-sm font-medium text-neutrals-7">
//                             Your free trial for
//                           </p>
//                           <h2 className="text-xl font-bold tracking-tighter flex items-center justify-start">
//                             <span className="hidden sm:block mr-1">
//                               Kreative
//                             </span>
//                             DocuVet Pro
//                           </h2>
//                         </div>
//                         <div>
//                           <TabsList className="grid grid-cols-2 text-xs">
//                             <TabsTrigger value="monthly">Monthly</TabsTrigger>
//                             <TabsTrigger value="annual">Annual</TabsTrigger>
//                           </TabsList>
//                         </div>
//                       </div>
//                       <TabsContent value="monthly">
//                         <PriceDetails
//                           price={139}
//                           providers={1}
//                           frequency="monthly"
//                         />
//                       </TabsContent>
//                       <TabsContent value="annual">
//                         <PriceDetails
//                           price={125}
//                           providers={1}
//                           frequency="annual"
//                         />
//                       </TabsContent>
//                     </Tabs>
//                   </div>
//                 </motion.div>
//                 <motion.div
//                   className="pb-16 md:pb-0"
//                   initial={{ y: 25, opacity: 0, scale: 0.85 }}
//                   animate={{
//                     y: 0,
//                     opacity: 1,
//                     scale: 1,
//                     transition: { duration: 0.45, delay: 0.55 },
//                   }}
//                   exit={{
//                     y: 25,
//                     opacity: 0,
//                     scale: 0.85,
//                     transition: { duration: 0.25, delay: 0.3 },
//                   }}
//                 >
//                   <Button
//                     variant="ghost"
//                     className="w-full transition-colors ease-in-out duration-500 text-lg py-6 text-white hover:bg-white/20 hover:text-white mt-4 flex items-center justify-center"
//                     onClick={() => setStep(3)}
//                   >
//                     <ArrowLeft className="h-7 w-7 mr-2" />
//                     Go back
//                   </Button>
//                 </motion.div>
//               </motion.div>
//             )}
//             {step === 5 && (
//               <motion.div
//                 key={5}
//                 className="w-ful sm:w-[75%]"
//                 initial={{ x: 0, opacity: 0 }}
//                 animate={{
//                   x: 0,
//                   opacity: 1,
//                   transition: { duration: 0.35, delay: 0 },
//                 }}
//                 exit={{
//                   x: 0,
//                   opacity: 0,
//                   transition: { duration: 0.35, delay: 0.35 },
//                 }}
//               >
//                 <motion.h1
//                   className="text-white text-5xl sm:text-7xl font-bold tracking-tight mt-4 mb-6 text-center"
//                   initial={{ y: 25, opacity: 0 }}
//                   animate={{
//                     y: 0,
//                     opacity: 1,
//                     transition: { duration: 0.25, delay: 0.25 },
//                   }}
//                   exit={{
//                     y: 25,
//                     opacity: 0,
//                     transition: { duration: 0.25 },
//                   }}
//                 >
//                   You&apos;re all set!
//                 </motion.h1>
//                 <motion.div
//                   className="pb-12"
//                   initial={{ y: 35, opacity: 0, scale: 0.7 }}
//                   animate={{
//                     y: 0,
//                     opacity: 1,
//                     scale: 1,
//                     transition: { duration: 0.45, delay: 0.45 },
//                   }}
//                   exit={{
//                     y: 35,
//                     opacity: 0,
//                     scale: 0.7,
//                     transition: { duration: 0.45, delay: 0.125 },
//                   }}
//                 >
//                   <div className="bg-white/70 rounded-xl w-full p-8 sm:p-12 backdrop-blur-md border-2 border-neutrals-4">
//                     <h1 className="text-3xl font-bold tracking-tighter pb-6">
//                       Welcome to the joyful future of{" "}
//                       <span className="line-through decoration-wavy decoration-red-500">
//                         writing
//                       </span>{" "}
//                       medical records. We&apos;re excited you&apos;re here! 😊🫶
//                     </h1>
//                     <p className="text-md text-black font-medium mb-6">
//                       We built Kreative DocuVet for YOU, and we would love to
//                       hear from you. If you have any questions, product
//                       feedback, or just want to talk, you can reach our team
//                       through Intercome in the bottom right corner of the screen
//                       or on our{" "}
//                       <a
//                         href="https://kreativedocuvet.com"
//                         className="underline text-brand-primary hover:text-seafoam-700"
//                       >
//                         website here.
//                       </a>
//                     </p>
//                     {/* VIDEO WILL GO HERE */}
//                     <Button
//                       size="lg"
//                       className="w-full flex items-center text-md text-lg py-7 shadow-xl hover:shadow-2xl"
//                       onClick={() => router.push("/dash/docustreams")}
//                       animated
//                       fullWidth
//                     >
//                       Start your journey
//                       <ArrowRight
//                         size={20}
//                         weight="bold"
//                         className="ml-2 -mb-1"
//                       />
//                     </Button>
//                   </div>
//                 </motion.div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </Container>
//       </ScrollArea>
//     </Authenticate>
//   );
// }
