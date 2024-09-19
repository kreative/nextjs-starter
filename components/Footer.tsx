import Link from "next/link";
import Container from "@/components/Container";
import SectionDivider from "@/components/SectionDivider";
import { Envelope, Phone } from "@phosphor-icons/react/dist/ssr";
import { Iconologo } from "./svgs/logos/Iconologo";
import { HOMEPAGE_URL, MAILTO_URL, TEL_URL } from "@/lib/constants";

const SITE_URL = "https://kreativedocuvet.com";
const ICON_STYLES = "h3 w-auto";

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

const ICONS = [
  {
    href: MAILTO_URL,
    icon: <Envelope className={ICON_STYLES} />,
  },
  {
    href: TEL_URL,
    icon: <Phone className={ICON_STYLES} />,
  },
];

export default function Footer() {
  return (
    <Container className="mt-24">
      <SectionDivider />
      <div className="grid grid-cols-2 gap-4 -mt-8">
        <div className="flex items-center justify-start space-x-3">
          <Link href={HOMEPAGE_URL} target="blank">
            <Iconologo className="h-4 w-auto" color="rgba(0,0,0,0.3)" />
          </Link>
          {LINKS.map((link: any, index: number) => (
            <Link
              key={index}
              target="blank"
              className="transition-colors text-[rgba(0,0,0,0.4)] hover:text-[rgba(0,0,0,0.6)] text-sm"
              href={link.href}
            >
              {link.title}
            </Link>
          ))}
        </div>
        <div className="flex items-center justify-end space-x-2">
          {ICONS.map((icon: any, index: number) => (
            <Link
              key={index}
              target="blank"
              className="transition-colors text-[rgba(0,0,0,0.25)] hover:text-[rgba(0,0,0,0.6)]"
              href={icon.href}
            >
              {icon.icon}
            </Link>
          ))}
        </div>
      </div>
    </Container>
  );
}
