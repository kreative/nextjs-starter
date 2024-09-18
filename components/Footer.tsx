import Link from "next/link";
import Container from "@/components/Container";
import SectionDivider from "@/components/SectionDivider";
import { Envelope } from "@phosphor-icons/react/dist/ssr";
import { TypographicLogo } from "@/components/svgs/logos/TypographicLogo";
import { MAILTO_URL } from "@/lib/constants";

const SITE_URL = "https://kreativedocuvet.com";

const LINKS = [
  {
    title: "About",
    href: SITE_URL + "/about",
  },
  {
    title: "Contact",
    href: SITE_URL + "/contact",
  },
];

export default function Footer() {
  return (
    <Container className="mt-24">
      <SectionDivider />
      <div className="grid grid-cols-2 gap-4 -mt-7">
        <div className="flex flex-col items-start justify-start">
          <TypographicLogo className="h-5 w-auto" color="rgba(0,0,0,0.4)" />
        </div>
        <div className="flex flex-col items-end justify-start pt-1">
          <div className="flex items-center justify-end space-x-3 pb-3">
            {LINKS.map((link: any, index: number) => (
              <div key={index}>
                <Link
                  className="transition-colors text-[rgba(0,0,0,0.4)] hover:text-[rgba(0,0,0,0.6)]"
                  href={link.href}
                >
                  {link.title}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
