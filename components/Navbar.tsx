import { cn } from "@/lib/utils";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAtom } from "jotai";
import { accountStore } from "@/stores/account";
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
  Archive,
  Microphone,
  GearSix,
  ArrowUpRight,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import useLogout from "@/hooks/useLogout";
import { TypographicLogo } from "@/components/svgs/logos/TypographicLogo";
import { BlackIconologo } from "@/components/svgs/logos/BlackIconologo";
import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { motion } from "framer-motion";
import { userStore } from "@/stores/user";
import { getCurrentUser } from "@/lib/users";
import {
  APP_INDEX,
  APP_SUPPORT_URL,
  HOMEPAGE_URL,
  PROFILE_URL,
} from "@/lib/constants";

interface NavbarProps {
  activeLink: string;
  gradientType: string;
}

export default function Navbar(props: NavbarProps): JSX.Element {
  const [account] = useAtom(accountStore);
  const [user, setUser] = useAtom(userStore);
  const [cookies] = useCookies(["kreative_id_key"]);
  const { performLogout } = useLogout();

  useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const userData = await getCurrentUser({
        key: cookies.kreative_id_key,
      });

      setUser(userData);
      return userData;
    },
  });

  const handleLogout = (e: any) => {
    if (e) e.preventDefault();
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
          <Link href={APP_INDEX}>
            <motion.div
              className="flex items-center"
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.11 },
              }}
              whileTap={{ scale: 0.92 }}
            >
              <TypographicLogo
                className="hidden h-auto w-32 xl:block"
                color="black"
              />
              <BlackIconologo className="mr-8 block h-auto w-4 xl:hidden" />
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
                  <span className="hidden sm:block">Action Button</span>
                </Button>
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
                          </div>
                        </div>
                        <div className="border-neutrals-4 flex flex-col space-y-2 border-b-2 pb-4 pt-2">
                          <Link
                            href={PROFILE_URL}
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
                          <Link
                            href={APP_SUPPORT_URL}
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
                          <Link
                            href={HOMEPAGE_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-end text-sm font-medium hover:underline"
                          >
                            Homepage
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
