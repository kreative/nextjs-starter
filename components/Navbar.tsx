import { cn } from "@/lib/utils";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useAtom } from "jotai";
import { accountStore } from "@/stores/account";
import { clinicStore } from "@/stores/clinic";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  UploadSimple,
  Archive,
  Microphone,
  GearSix,
  ArrowUpRight,
} from "@phosphor-icons/react/dist/ssr";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import useLogout from "@/hooks/useLogout";
import { DocuVetTypograhicLogo } from "@/components/svgs/logos/kdv-typographic";
import { DocuVetBlackIconologo } from "@/components/svgs/logos/kdv-black-icon";
import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { getCurrentUser } from "@/lib/users";
import { motion } from "framer-motion";
import AudioUploadButton from "@/components/AudioUploadButton";
import ProviderOnlyDialog from "@/components/ProviderOnlyDialog";
import RecordButton from "@/components/RecordButton";
import { userStore } from "@/stores/user";

interface NavbarProps {
  activeLink: string;
  gradientType: string;
}

export default function Navbar(props: NavbarProps): JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [account] = useAtom(accountStore);
  const [clinic, setClinic] = useAtom(clinicStore);
  const [user, setUser] = useAtom(userStore);
  const [cookies] = useCookies(["kreative_id_key"]);
  const { performLogout } = useLogout();

  useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const data = await getCurrentUser({
        key: cookies.kreative_id_key,
      });

      setClinic({
        id: data.clinic.id,
        name: data.clinic.name,
      });

      setUser(data.veterinarian);

      return data;
    },
  });

  const isProvider = useMemo(() => {
    for (const role of account.roles) {
      if (role.rid === "DOCUVET_PROVIDER") {
        return true;
      }
    }

    return false;
  }, [account]);

  const handleLogout = (e: any) => {
    // prevents default button click behavior
    if (e) e.preventDefault();

    // closes the keychain using id-api
    performLogout();
  };

  const [colorChange, setColorchange] = useState(false);

  const changeNavbarColor = () => {
    if (window.scrollY >= 10) setColorchange(true);
    else setColorchange(false);
  };

  window.addEventListener("scroll", changeNavbarColor);

  return (
    <div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick links">
            <CommandItem
              className={
                props.activeLink === "docustreams" ? "hidden" : "block"
              }
            >
              <Link href="/dash/docustreams">
                <div className="flex items-center space-x-2">
                  <Microphone
                    weight="bold"
                    size={18}
                    className="text-brand-forrest"
                  />
                  <p className="text-sm font-medium">Docustreams</p>
                </div>
              </Link>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
      {props.gradientType === "fullPageGreen" && (
        <div className="background-gradient-green animated" />
      )}
      {props.gradientType === "regular" && (
        <div className="background-gradient animated" />
      )}
      <div className="fixed w-full top-0 right-0 z-[43]">
        <nav
          className={cn(
            "flex w-[100%] items-center justify-between p-4",
            colorChange ? "backdrop-blur-lg border-b border-black/5" : ""
          )}
        >
          <Link href="/dash/docustreams">
            <motion.div
              className="flex items-center"
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.11 },
              }}
              whileTap={{ scale: 0.92 }}
            >
              <Link href="/dash/docustreams">
                <DocuVetTypograhicLogo className="hidden h-auto w-32 xl:block" color="black" />
                <DocuVetBlackIconologo className="mr-8 block h-auto w-4 xl:hidden" />
              </Link>
            </motion.div>
          </Link>
          <div className="nav-width">
            <div>
              <div className="flex items-baseline justify-start space-x-4">
                <motion.div
                  whileHover={{
                    scale: 0.97,
                    transition: { duration: 0.1 },
                  }}
                  whileTap={{ scale: 0.92 }}
                >
                  <Link
                    href="/dash/docustreams"
                    className={
                      "flex items-center space-x-1 " +
                      (props.activeLink === "docustreams"
                        ? ""
                        : "opacity-[50%]")
                    }
                  >
                    <Microphone weight="bold" className="h-auto w-6 sm:w-5" />
                    <p className="hidden text-sm font-medium sm:block">
                      Docustreams
                    </p>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{
                    scale: 0.97,
                    transition: { duration: 0.1 },
                  }}
                  whileTap={{ scale: 0.92 }}
                >
                  <Link
                    href="/dash/archive"
                    className={
                      "flex items-center space-x-1 " +
                      (props.activeLink === "archive" ? "" : "opacity-[50%]")
                    }
                  >
                    <Archive weight="bold" className="h-auto w-6 sm:w-5" />
                    <p className="hidden text-sm font-medium sm:block">
                      Archive
                    </p>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{
                    scale: 0.97,
                    transition: { duration: 0.1 },
                  }}
                  whileTap={{ scale: 0.92 }}
                >
                  <Link
                    href="/dash/settings"
                    className={
                      "flex items-center space-x-1 " +
                      (props.activeLink === "settings" ? "" : "opacity-[50%]")
                    }
                  >
                    <GearSix weight="bold" className="h-auto w-6 sm:w-5" />
                    <p className="hidden text-sm font-medium sm:block">
                      Settings
                    </p>
                  </Link>
                </motion.div>
              </div>
            </div>
            <TooltipProvider>
              <div className="flex items-center justify-end space-x-2">
                {isProvider && (
                  <AudioUploadButton>
                    <Button
                      size={"sm"}
                      variant="default"
                      className="text-xs h-6 rounded-full flex items-center justify-center"
                      animated
                    >
                      <UploadSimple
                        weight="bold"
                        size={12}
                        className="mr-0 sm:mr-1.5 text-white"
                      />
                      <span className="hidden sm:block">Upload</span>
                    </Button>
                  </AudioUploadButton>
                )}
                {!isProvider && (
                  <ProviderOnlyDialog message="Uploading audio is currently a feature that only Providers can use. If there has been a mistake, please contact your administrator or reach us at Kreative Support.">
                    <Button
                      size={"sm"}
                      variant="default"
                      className="text-xs h-6 rounded-full flex items-center justify-center"
                      animated
                    >
                      <UploadSimple
                        weight="bold"
                        size={12}
                        className="mr-0 sm:mr-1.5 text-white"
                      />
                      <span className="hidden sm:block">Upload</span>
                    </Button>
                  </ProviderOnlyDialog>
                )}
                {isProvider && (
                  <RecordButton>
                    <Button
                      size={"sm"}
                      variant="default"
                      className="text-xs h-6 rounded-full flex items-center justify-center bg-brand-deepocean hover:bg-medicalblue-700"
                      animated
                    >
                      <Microphone
                        weight="bold"
                        size={12}
                        className="mr-0 sm:mr-1.5 text-white"
                      />
                      <span className="hidden sm:block">Record</span>
                    </Button>
                  </RecordButton>
                )}
                {!isProvider && (
                  <ProviderOnlyDialog message="Recording audio is currently a feature that only Providers can use. If there has been a mistake, please contact your administrator or reach us at Kreative Support.">
                    <Button
                      size={"sm"}
                      variant="default"
                      className="text-xs h-6 rounded-full flex items-center justify-center bg-brand-deepocean hover:bg-medicalblue-700"
                      animated
                    >
                      <Microphone
                        weight="bold"
                        size={12}
                        className="mr-0 sm:mr-1.5 text-white"
                      />
                      <span className="hidden sm:block">Record</span>
                    </Button>
                  </ProviderOnlyDialog>
                )}
                <Tooltip>
                  <Popover>
                    <TooltipTrigger asChild>
                      <PopoverTrigger>
                        <motion.div
                          whileHover={{
                            scale: 0.95,
                            transition: { duration: 0.1 },
                          }}
                          whileTap={{ scale: 0.92 }}
                        >
                          <Image
                            src={account?.profilePicture}
                            alt="Profile Picture"
                            width={48}
                            height={48}
                            className="h-auto w-6 rounded-full"
                          />
                        </motion.div>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent
                      align="end"
                      className="border-none bg-white/70 px-2 py-1 backdrop-blur-sm"
                    >
                      <p className="text-neutrals-9 text-sm font-medium">
                        Your profile
                      </p>
                    </TooltipContent>
                    <PopoverContent className="mt-1 max-w-64 z-[110]">
                      <div>
                        <div className="border-neutrals-4 flex items-start space-x-2 border-b-2 pb-2 align-top">
                          <Image
                            src={account?.profilePicture}
                            alt="Profile Picture"
                            width={32}
                            height={32}
                            className="h-5 w-5 rounded-full"
                          />
                          <div>
                            <p className="text-neutrals-13 text-sm font-bold">
                              {account.prefix === "Dr." ? "Dr. " : ""}
                              {account.firstName + " " + account.lastName}
                            </p>
                            <p className="text-neutrals-9 text-sm">
                              {clinic.name}
                            </p>
                          </div>
                        </div>
                        <div className="border-neutrals-4 flex flex-col space-y-2 border-b-2 pb-4 pt-2">
                          <Link
                            href="/dash/settings"
                            className="cursor-default text-sm font-medium"
                          >
                            <span className="cursor-pointer hover:underline">
                              View your profile
                            </span>
                          </Link>
                          <div
                            onClick={(e) => handleLogout(e)}
                            className="cursor-default text-sm font-medium"
                          >
                            <span className="cursor-pointer hover:underline">
                              Logout
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2 pt-2">
                          <p className="text-neutrals-8 text-xs">Resources</p>
                          <Link
                            href="https://support.kreativeusa.com/docuvet"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-end text-sm font-medium hover:underline"
                          >
                            Get support
                            <ArrowUpRight
                              size={17}
                              weight="bold"
                              className="ml-1"
                            />
                          </Link>
                          {/* <Link
                        href="#"
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium hover:underline flex items-end"
                      >
                        Guides
                        <ArrowUpRight
                          size={17}
                          weight="bold"
                          className="ml-1"
                        />
                      </Link> */}
                          <Link
                            href="https://kreativedocuvet.com"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-end text-sm font-medium hover:underline"
                          >
                            DocuVet homepage
                            <ArrowUpRight
                              size={17}
                              weight="bold"
                              className="ml-1"
                            />
                          </Link>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </nav>
      </div>
    </div>
  );
}
