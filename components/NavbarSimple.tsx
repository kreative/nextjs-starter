import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useAtom } from "jotai";
import { accountStore } from "@/stores/account";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import useLogout from "@/hooks/useLogout";
import { TypographicLogo } from "@/components/svgs/logos/TypographicLogo";
import { APP_SUPPORT_URL, HOMEPAGE_URL } from "@/lib/constants";


export default function Navbar({ logoColor }: { logoColor?: string }): JSX.Element {
  const [account] = useAtom(accountStore);
  const { performLogout } = useLogout();

  const handleLogout = (e: any) => {
    if (e) e.preventDefault();
    performLogout();
  };

  return (
    <div>
      <div className="sticky backdrop-blur-lg z-10 animated">
        <nav className="flex justify-between items-center p-4 z-[200] relative w-[100%]">
          <div className="flex items-center">
            <TypographicLogo className="w-40 h-auto" color={logoColor ? logoColor : "white"} />
          </div>
          <div className="nav-width">
            <div></div>
            <div className="flex justify-end items-center space-x-2">
              <Popover>
                <PopoverTrigger>
                  <Image
                    src={account?.profilePicture}
                    alt="Profile Picture"
                    width={64}
                    height={64}
                    className="rounded-full w-6 h-auto"
                  />
                </PopoverTrigger>
                <PopoverContent className="max-w-60 mt-1">
                  <div>
                    <div className="flex space-x-2 align-top items-center border-b-2 border-neutrals-4 pb-2">
                      <Image
                        src={account?.profilePicture}
                        alt="Profile Picture"
                        width={32}
                        height={32}
                        className="rounded-full w-5 h-5"
                      />
                      <p className="text-md text-neutrals-13 font-medium">
                        {account.firstName + " " + account.lastName}
                      </p>
                    </div>
                    <div className="pt-2 pb-2 flex flex-col space-y-2 border-b-2 border-neutrals-4">
                      <div
                        onClick={(e) => handleLogout(e)}
                        className="text-sm font-medium cursor-default"
                      >
                        <span className="hover:underline cursor-pointer">
                          Logout
                        </span>
                      </div>
                    </div>
                    <div className="pt-2 flex flex-col space-y-2">
                      <p className="text-xs text-neutrals-8">Resources</p>
                      <Link
                        href={APP_SUPPORT_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium hover:underline flex items-end"
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
                        className="text-sm font-medium hover:underline flex items-end"
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
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
