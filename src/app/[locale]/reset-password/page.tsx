import { ResetPasswordForm } from "@/components/reset-password/form";
import { ThemeToggle } from "@/components/common/theme/toggle";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { LocaleToggle } from "@/components/common/locale/toggle";

export default function ResetPasswordPage() {
  const t = useTranslations("ResetPassword");
  return (
    <main className="min-w-screen min-h-screen grid lg:grid-cols-2">
      <div className="absolute left-8 top-8 lg:hidden">
        <Image
          src="/favicon.svg"
          alt="favicon-black"
          width={40}
          height={40}
          className="dark:hidden"
        />
        <Image
          src="/favicon.svg"
          alt="favicon-white"
          width={40}
          height={40}
          className="invert"
        />
      </div>
      <div className="absolute right-8 top-8 space-x-1">
        <LocaleToggle />
        <ThemeToggle />
      </div>
      <div className="flex-col justify-between h-full p-10 border-r bg-zinc-900 text-white hidden lg:flex">
        <Image
          src="/logo.svg"
          alt="logo-white"
          width={140}
          height={100}
          className="invert"
        />
        <p>{t("slogan")}</p>
      </div>
      <div className="flex flex-col gap-8 justify-center h-full p-10">
        <div>
          <h1 className="text-3xl font-semibold mb-2">{t("title")}</h1>
          <p>{t("description")}</p>
        </div>
        <ResetPasswordForm />
      </div>
    </main>
  );
}
