import { SingUpForm } from "@/components/sign-up/form";
import { ThemeToggle } from "@/components/common/theme/toggle";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { LocaleToggle } from "@/components/common/locale/toggle";
import LocaleLink from "@/components/common/locale-link";

export default function SingUpPage() {
  const t = useTranslations("SignUp");
  return (
    <main className="min-w-screen min-h-screen grid lg:grid-cols-2">
      <div className="absolute left-8 top-8 lg:hidden">
        <Image
          src="/favicon-black.svg"
          alt="favicon-white"
          width={40}
          height={40}
          className="dark:hidden"
        />
        <Image
          src="/favicon-white.svg"
          alt="favicon-white"
          width={40}
          height={40}
        />
      </div>
      <div className="absolute right-8 top-8 space-x-1">
        <LocaleToggle />
        <ThemeToggle />
      </div>
      <div className="flex-col justify-between h-full p-10 border-r bg-zinc-900 text-white hidden lg:flex">
        <Image
          src="/logo-white.svg"
          alt="logo-white"
          width={140}
          height={100}
        />
        <p>{t("slogan")}</p>
      </div>
      <div className="flex flex-col gap-8 justify-center h-full p-10">
        <div>
          <h1 className="text-3xl font-semibold mb-2">{t("title")}</h1>
          <p>{t("description")}</p>
        </div>
        <SingUpForm />
        <div className="flex flex-row justify-center gap-2 text-center">
          <p>{t("have_account")}</p>
          <LocaleLink href="/sign-in" className="underline">
            {t("sign_in")}
          </LocaleLink>
        </div>
      </div>
    </main>
  );
}
