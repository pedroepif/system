import Image from "next/image";
import LocaleLink from "../locale-link";

export default function Logo({
  company,
}: {
  company?: {
    id: string;
    name: string;
    logo_white: string | null;
    logo_black: string | null;
  };
}) {
  return (
    <LocaleLink
      href="/"
      className="flex items-center justify-center h-10 overflow-hidden"
    >
      {company?.logo_white ? (
        <Image
          src={company.logo_white}
          alt="logo-white"
          width={120}
          height={40}
          className="hidden dark:block object-contain"
          unoptimized
        />
      ) : (
        <Image
          src="/logo.svg"
          alt="logo-white"
          width={120}
          height={40}
          className="block dark:hidden object-contain invert"
        />
      )}
      {company?.logo_black ? (
        <Image
          src={company.logo_black}
          alt="logo-black"
          width={120}
          height={40}
          className="block dark:hidden object-contain"
          unoptimized
        />
      ) : (
        <Image
          src="/logo.svg"
          alt="logo-black"
          width={120}
          height={40}
          className="hidden dark:block object-contain"
        />
      )}
    </LocaleLink>
  );
}
