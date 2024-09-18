import { cn } from "@/lib/utils";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectValue,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Dog,
  Cat,
  Horse,
  Cow,
  Stethoscope,
  ArrowLeft,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import { motion, AnimatePresence } from "framer-motion";
import Authenticate from "@/components/Authenticate";
import Navbar from "@/components/onboarding/Navbar";
import DotSteps from "@/components/onboarding/DotSteps";
import Container from "@/components/Container";
import { createNewUser } from "@/lib/users";
import { useAtom } from "jotai";
import { accountStore } from "@/stores/account";
import { clinicStore } from "@/stores/clinic";
import { useCookies } from "react-cookie";
import { getInvite } from "@/lib/invites";
import { Player } from "@lottiefiles/react-lottie-player";

interface IOnboardinUserData {
  userTitle: string;
  speciesServed: string;
}

const NUM_OF_STEPS = 4;

export default function Onboarding() {
  const router = useRouter();
  const { inviteCode } = router.query;
  const [account] = useAtom(accountStore);
  const [clinic, setClinic] = useAtom(clinicStore);
  const [cookies, setCookie, removeCookie] = useCookies(["kreative_id_key"]);
  const [step, setStep] = useState(0);
  const [selectIsValid, setSelectIsValid] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [invite, setInvite] = useState<any>({});
  const [responseCode, setResponseCode] = useState<number>(202);
  const [data, setData] = useState<IOnboardinUserData>({
    userTitle: "",
    speciesServed: "",
  });

  useEffect(() => {
    async function getAndSetInvite() {
      const response = await getInvite({
        key: cookies.kreative_id_key,
        inviteId: inviteCode as string,
      });

      if (response === 404) setResponseCode(404);
      else setInvite(response.invite);
    }

    if (!inviteCode) return;
    if (step === 0) getAndSetInvite();
  }, [step, clinic, inviteCode, cookies.kreative_id_key]);

  const onboardUser = async (speciesServed: string) => {
    const response = await createNewUser({
      key: cookies.kreative_id_key,
      email: account.email,
      firstName: account.firstName,
      lastName: account.lastName,
      title: data.userTitle,
      speciesServed: speciesServed,
      inviteCode: invite!.id,
    });

    if (response.keychain) {
      removeCookie("kreative_id_key");
      setCookie("kreative_id_key", response.keychain, {
        secure: process.env.NEXT_PUBLIC_ENV === "development" ? false : true,
        sameSite: "strict",
        path: "/",
      });
    }

    setClinic({ id: response.clinic.id, name: response.clinic.name });
    setStep(3);
  };

  return (
    <Authenticate permissions={["DOCUVET_BASE"]}>
      <ScrollArea className="background-gradient-3 h-[120vh]">
        <Navbar />
        <Container className="w-full flex-items-center justify-center">
          <DotSteps steps={NUM_OF_STEPS} currentStep={step} />
        </Container>
        <Container className="flex items-center justify-center min-h-[80vh]">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key={0}
                className="w-full"
                initial={{ x: 0, opacity: 0 }}
                animate={{
                  x: 0,
                  opacity: 1,
                  transition: { duration: 0.35, delay: 0 },
                }}
                exit={{
                  x: 0,
                  opacity: 0,
                  transition: { duration: 0.35, delay: 0.35 },
                }}
              >
                <motion.h1
                  className="text-white text-6xl sm:text-8xl font-bold tracking-tight text-center mb-12"
                  initial={{ y: 25, opacity: 0 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    transition: { duration: 0.35, delay: 0.25 },
                  }}
                  exit={{
                    y: 25,
                    opacity: 0,
                    transition: { duration: 0.25 },
                  }}
                >
                  Welcome to Kreative DocuVet
                  <motion.span
                    className="text-5xl sm:text-7xl ml-2"
                    initial={{ scale: 0.85, opacity: 0, y: 10 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.35, delay: 0.5 },
                    }}
                    exit={{
                      scale: 0.85,
                      opacity: 0,
                      y: 10,
                      transition: { duration: 0.25, delay: 0.1 },
                    }}
                  >
                    👋
                  </motion.span>
                </motion.h1>
                {invite && (
                  <div>
                    <motion.p
                      className="text-white text-xl text-center mb-12"
                      initial={{ y: 25, opacity: 0 }}
                      animate={{
                        y: 0,
                        opacity: 1,
                        transition: { duration: 0.35, delay: 0.35 },
                      }}
                      exit={{
                        y: 25,
                        opacity: 0,
                        transition: { duration: 0.25, delay: 0.1 },
                      }}
                    >
                      You&apos;ve been invited to join Kreative DocuVet by{" "}
                      <span className="font-bold underline">
                        {/* @ts-ignore */}
                        {invite?.clinic?.name || "your clinic"}
                      </span>
                      .<br />
                      We&apos;re excited to have you here! your clinic.
                    </motion.p>
                    <motion.div
                      initial={{ y: 25, opacity: 0, scale: 0.85 }}
                      animate={{
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        transition: { duration: 0.35, delay: 0.35 },
                      }}
                      exit={{
                        y: 25,
                        opacity: 0,
                        scale: 0.85,
                        transition: { duration: 0.25, delay: 0.1 },
                      }}
                    >
                      <Button
                        animated
                        className="w-full text-lg py-6"
                        onClick={(e) => {
                          setStep(1);
                        }}
                      >
                        Continue setup
                      </Button>
                    </motion.div>
                  </div>
                )}
                {responseCode === 404 && (
                  <div>
                    <motion.p
                      className="text-white text-xl text-center mb-12"
                      initial={{ y: 25, opacity: 0 }}
                      animate={{
                        y: 0,
                        opacity: 1,
                        transition: { duration: 0.35, delay: 0.35 },
                      }}
                      exit={{
                        y: 25,
                        opacity: 0,
                        transition: { duration: 0.25, delay: 0.1 },
                      }}
                    >
                      Unfortunately, the invite code you entered is invalid or
                      has been cancelled by your clinic. Please contact your
                      clinic administrator for a new invite.
                    </motion.p>
                  </div>
                )}
              </motion.div>
            )}
            {step === 1 && (
              <motion.div
                key={1}
                className="w-full sm:w-[75%]"
                initial={{ x: 0, opacity: 0 }}
                animate={{
                  x: 0,
                  opacity: 1,
                  transition: { duration: 0.35, delay: 0 },
                }}
                exit={{
                  x: 0,
                  opacity: 0,
                  transition: { duration: 0.35, delay: 0.35 },
                }}
              >
                <motion.h1
                  className="text-white text-5xl sm:text-7xl font-bold tracking-tight text-center mb-12"
                  initial={{ y: 25, opacity: 0 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    transition: { duration: 0.25, delay: 0.25 },
                  }}
                  exit={{
                    y: 25,
                    opacity: 0,
                    transition: { duration: 0.25 },
                  }}
                >
                  What best describes your role?
                </motion.h1>
                <motion.div
                  initial={{ y: 20, opacity: 0, scale: 0.85 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.35, delay: 0.47 },
                  }}
                  exit={{
                    y: 25,
                    opacity: 0,
                    scale: 0.85,
                    transition: { duration: 0.2, delay: 0.125 },
                  }}
                >
                  <Select
                    onValueChange={(value) => {
                      setSelectIsValid(true);
                      setData({ ...data, userTitle: value });
                    }}
                    defaultValue={data.userTitle}
                  >
                    <SelectTrigger
                      className={cn(
                        "my-4 bg-white/20 border focus-visible:border-transparent focus-visible:ring-0 focus:ring-0 focus:outline-none text-white font-medium text-3xl tracking-tight h-16 placeholder:text-white/50",
                        !selectIsValid
                          ? "border-red-500 animate-shake"
                          : "border-white/20"
                      )}
                    >
                      <SelectValue placeholder="I'm a.." />
                    </SelectTrigger>
                    <SelectContent className="select-none">
                      <SelectItem value="Veterinarian">Veterinarian</SelectItem>
                      <SelectItem value="Veterinary Assistant">
                        Veterinary Assistant
                      </SelectItem>
                      <SelectItem value="Practice Manager">
                        Practice Manager
                      </SelectItem>
                      <SelectItem value="Veterinary Technician Specialist (VTS)">
                        Veterinary Technician Specialist (VTS)
                      </SelectItem>
                      <SelectItem value="Receptionist">Receptionist</SelectItem>
                      <SelectItem value="Veterinary Surgeon">
                        Veterinary Surgeon
                      </SelectItem>
                      <SelectItem value="Veterinary Nurse">
                        Veterinary Nurse
                      </SelectItem>
                      <SelectItem value="Animal Care Attendant">
                        Animal Care Attendant
                      </SelectItem>
                      <SelectItem value="Veterinary Practice Owner">
                        Veterinary Practice Owner
                      </SelectItem>
                      <SelectItem value="Veterinary Pharmacist">
                        Veterinary Pharmacist
                      </SelectItem>
                      <SelectItem value="Equine Veterinary Technician">
                        Equine Veterinary Technician
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
                <motion.div
                  initial={{ y: 25, opacity: 0, scale: 0.85 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.35, delay: 0.35 },
                  }}
                  exit={{
                    y: 25,
                    opacity: 0,
                    scale: 0.85,
                    transition: { duration: 0.25, delay: 0.1 },
                  }}
                >
                  <Button
                    animated
                    className="w-full text-lg py-6"
                    onClick={() => {
                      if (data.userTitle === "" || data.userTitle === null) {
                        setSelectIsValid(false);
                        return;
                      }
                      setStep(2);
                    }}
                  >
                    Continue
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ y: 25, opacity: 0, scale: 0.85 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.45, delay: 0.5 },
                  }}
                  exit={{
                    y: 25,
                    opacity: 0,
                    scale: 0.85,
                    transition: { duration: 0.25, delay: 0.12 },
                  }}
                >
                  <Button
                    variant="ghost"
                    className="w-full transition-colors ease-in-out duration-500 text-lg py-6 text-white hover:bg-white/20 hover:text-white mt-4 flex items-center justify-center"
                    onClick={() => setStep(0)}
                  >
                    <ArrowLeft className="h-7 w-7 mr-2" />
                    Go back
                  </Button>
                </motion.div>
              </motion.div>
            )}
            {step === 2 && !isPending && (
              <motion.div
                key={2}
                className="w-full sm:w-[75%]"
                initial={{ x: 0, opacity: 0 }}
                animate={{
                  x: 0,
                  opacity: 1,
                  transition: { duration: 0.35, delay: 0 },
                }}
                exit={{
                  x: 0,
                  opacity: 0,
                  transition: { duration: 0.35, delay: 0.35 },
                }}
              >
                <motion.h1
                  className="text-white text-5xl sm:text-7xl font-bold tracking-tight text-center mb-12"
                  initial={{ y: 25, opacity: 0 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    transition: { duration: 0.25, delay: 0.25 },
                  }}
                  exit={{
                    y: 25,
                    opacity: 0,
                    transition: { duration: 0.25 },
                  }}
                >
                  Which species do you serve?
                </motion.h1>
                <motion.div
                  className="grid grid-cols-4 md:grid-cols-3 gap-4"
                  initial={{ y: 20, opacity: 0, scale: 0.85 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.35, delay: 0.47 },
                  }}
                  exit={{
                    y: 25,
                    opacity: 0,
                    scale: 0.85,
                    transition: { duration: 0.2, delay: 0.125 },
                  }}
                >
                  <motion.div
                    whileHover={{
                      scale: 0.95,
                      transition: { duration: 0.25 },
                    }}
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      "col-span-2 md:col-span-1 flex flex-col items-center justify-center h-36 p-6 text-center rounded-md border-2 border-white text-white font-medium tracking-tight text-2xl bg-white/15 transition-colors ease-in-out duration-200 hover:bg-white/20 hover:cursor-pointer",
                      data.speciesServed === "Small Animal"
                        ? "bg-white/20 border-4"
                        : ""
                    )}
                    onClick={() => {
                      setData({ ...data, speciesServed: "Small Animal" });
                      setIsPending(true);
                      setTimeout(
                        async () => await onboardUser("Small Animal"),
                        250
                      );
                    }}
                  >
                    <div className="flex items-center justify-center mb-3">
                      <Dog className="h-10 w-10 mr-2" />
                      <Cat className="h-10 w-10 mr-2" />
                    </div>
                    Small Animal
                  </motion.div>
                  <motion.div
                    whileHover={{
                      scale: 0.9,
                      transition: { duration: 0.25 },
                    }}
                    whileTap={{ scale: 0.85 }}
                    className={cn(
                      "col-span-2 md:col-span-1 flex flex-col items-center justify-center h-36 p-6 text-center rounded-md border-2 border-white text-white font-medium tracking-tight text-2xl bg-white/15 transition-colors ease-in-out duration-200 hover:bg-white/20 hover:cursor-pointer",
                      data.speciesServed === "Large Animal"
                        ? "bg-white/20 border-4"
                        : ""
                    )}
                    onClick={() => {
                      setData({ ...data, speciesServed: "Large Animal" });
                      setIsPending(true);
                      setTimeout(
                        async () => await onboardUser("Large Animal"),
                        250
                      );
                    }}
                  >
                    <div className="flex items-center justify-center mb-3">
                      <Horse className="h-10 w-10 mr-2" />
                      <Cow className="h-10 w-10 mr-2" />
                    </div>
                    Large Animal
                  </motion.div>
                  <div className="col-span-1 block md:hidden" />
                  <motion.div
                    whileHover={{
                      scale: 0.9,
                      transition: { duration: 0.25 },
                    }}
                    whileTap={{ scale: 0.85 }}
                    className={cn(
                      "col-span-2 md:col-span-1 flex flex-col items-center justify-center h-36 p-6 rounded-md border-2 border-white text-white font-medium tracking-tight text-2xl bg-white/15 transition-colors ease-in-out duration-200 hover:bg-white/20 hover:cursor-pointer",
                      data.speciesServed === "Small and Large"
                        ? "bg-white/20 border-4"
                        : ""
                    )}
                    onClick={() => {
                      setData({
                        ...data,
                        speciesServed: "Small and Large animal",
                      });
                      setIsPending(true);
                      setTimeout(
                        async () => await onboardUser("Small and Large Animal"),
                        250
                      );
                    }}
                  >
                    <div className="flex items-center justify-center mb-3">
                      <Stethoscope className="h-10 w-10 mr-2" />
                    </div>
                    Both!
                  </motion.div>
                </motion.div>
                <motion.div
                  initial={{ y: 25, opacity: 0, scale: 0.85 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.45, delay: 0.55 },
                  }}
                  exit={{
                    y: 25,
                    opacity: 0,
                    scale: 0.85,
                    transition: { duration: 0.25, delay: 0.12 },
                  }}
                >
                  <Button
                    variant="ghost"
                    className="w-full transition-colors ease-in-out duration-500 text-lg py-6 text-white hover:bg-white/20 hover:text-white mt-4 flex items-center justify-center"
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft className="h-7 w-7 mr-2" />
                    Go back
                  </Button>
                </motion.div>
              </motion.div>
            )}
            {step === 2 && isPending && (
              <motion.div
                key={25}
                className="w-full sm:w-[75%]"
                initial={{ x: 0, opacity: 0 }}
                animate={{
                  x: 0,
                  opacity: 1,
                  transition: { duration: 0.35, delay: 0 },
                }}
                exit={{
                  x: 0,
                  opacity: 0,
                  transition: { duration: 0.35, delay: 0.35 },
                }}
              >
                <motion.h1
                  className="text-white text-5xl sm:text-7xl font-bold tracking-tight text-center -mb-16"
                  initial={{ y: 25, opacity: 0 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    transition: { duration: 0.25, delay: 0.25 },
                  }}
                  exit={{
                    y: 25,
                    opacity: 0,
                    transition: { duration: 0.25 },
                  }}
                >
                  Creating profile...
                </motion.h1>
                <motion.div
                  initial={{ y: 25, opacity: 0, scale: 0.85 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.25, delay: 0.35 },
                  }}
                  exit={{
                    y: 25,
                    opacity: 0,
                    scale: 0.95,
                    transition: { duration: 0.35 },
                  }}
                >
                  <Player
                    src="/orb.json"
                    className="w-full h-auto"
                    loop
                    autoplay
                  />
                </motion.div>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div
                key={3}
                className="w-ful sm:w-[75%]"
                initial={{ x: 0, opacity: 0 }}
                animate={{
                  x: 0,
                  opacity: 1,
                  transition: { duration: 0.35, delay: 0 },
                }}
                exit={{
                  x: 0,
                  opacity: 0,
                  transition: { duration: 0.35, delay: 0.35 },
                }}
              >
                <motion.h1
                  className="text-white text-5xl sm:text-7xl font-bold tracking-tight mt-4 mb-6 text-center"
                  initial={{ y: 25, opacity: 0 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    transition: { duration: 0.25, delay: 0.25 },
                  }}
                  exit={{
                    y: 25,
                    opacity: 0,
                    transition: { duration: 0.25 },
                  }}
                >
                  You&apos;re all set!
                </motion.h1>
                <motion.div
                  className="pb-12"
                  initial={{ y: 35, opacity: 0, scale: 0.7 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.45, delay: 0.45 },
                  }}
                  exit={{
                    y: 35,
                    opacity: 0,
                    scale: 0.7,
                    transition: { duration: 0.45, delay: 0.125 },
                  }}
                >
                  <div className="bg-white/70 rounded-xl w-full p-8 sm:p-12 backdrop-blur-md border-2 border-neutrals-4">
                    <h1 className="text-3xl font-bold tracking-tighter pb-6">
                      Welcome to the joyful future of{" "}
                      <span className="line-through decoration-wavy decoration-red-500">
                        writing
                      </span>{" "}
                      medical records. We&apos;re excited you&apos;re here! 😊🫶
                    </h1>
                    <p className="text-md text-black font-medium mb-6">
                      We built Kreative DocuVet for YOU, and we would love to
                      hear from you. If you have any questions, product
                      feedback, or just want to talk, you can reach our team
                      through Intercome in the bottom right corner of the screen
                      or on our{" "}
                      <a
                        href="https://kreativedocuvet.com"
                        className="underline text-brand-forrest hover:text-seafoam-700"
                      >
                        website here.
                      </a>
                    </p>
                    {/* VIDEO WILL GO HERE */}
                    <Button
                      size="lg"
                      className="w-full flex items-center text-md text-lg py-7 shadow-xl hover:shadow-2xl"
                      onClick={() => router.push("/dash/docustreams")}
                      animated
                      fullWidth
                    >
                      Start your journey
                      <ArrowRight
                        size={20}
                        weight="bold"
                        className="ml-2 -mb-1"
                      />
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
      </ScrollArea>
    </Authenticate>
  );
}
