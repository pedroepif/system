"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createUserSession } from "@/app/api/user/session/actions";
import LocaleLink from "../common/locale-link";

export function SignInForm() {
  const t = useTranslations("SignIn");
  const router = useRouter();
  const { locale } = useParams();

  const formSchema = z.object({
    email: z.string().email(t("form.email.message")),
    password: z.string().min(1, t("form.password.message")),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { error, message } = await createUserSession(values);

    if (error) {
      setShowForgot(true);
      toast.error(message);
    } else {
      toast.success(message);
      setTimeout(() => {
        router.replace(`/${locale}/dashboard`);
      }, 1000);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.email.label")}</FormLabel>
              <FormControl>
                <Input placeholder={t("form.email.placeholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.password.label")}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("form.password.placeholder")}
                    className="pr-12"
                    {...field}
                  />
                  <Button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 pr-3 !outline-none !ring-0"
                    onClick={() => setShowPassword(!showPassword)}
                    variant="link"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {showForgot && (
          <div className="flex flex-row justify-center gap-2 text-center">
            <p>{t("form.forgot_password")}</p>
            <LocaleLink href="/forgot-password" className="underline">
              {t("form.recover_password")}
            </LocaleLink>
          </div>
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {t("form.button")}
        </Button>
      </form>
    </Form>
  );
}
