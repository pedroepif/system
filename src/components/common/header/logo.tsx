import Image from "next/image";
import LocaleLink from "../locale-link";

export default function Logo({
  company,
}: {
  company?: {
    id: string;
    name: string;
    logo: string | null;
  };
}) {
  return (
    <LocaleLink
      href="/"
      className="flex items-center justify-center h-10 overflow-hidden"
    >
      {company?.logo ? (
        <Image
          src={company.logo}
          alt="logo"
          width={120}
          height={40}
          className="dark:invert object-contain"
          unoptimized
        />
      ) : (
        <Image
          src="/logo.svg"
          alt="logo"
          width={120}
          height={40}
          className="object-contain dark:invert"
        />
      )}
    </LocaleLink>
  );
}
