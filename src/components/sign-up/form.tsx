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
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";
import { PhoneInput } from "@/components/ui/phone-input";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { createUser } from "@/app/api/user/actions";

export function SingUpForm() {
  const t = useTranslations("SignUp");
  const router = useRouter();
  const { locale } = useParams();

  const formSchema = z
    .object({
      email: z.string().email(t("form.email.message")),
      name: z.string().min(1, t("form.name.message")),
      phone: z.string().refine(isValidPhoneNumber, t("form.phone.message")),
      password: z.string().min(6, t("form.password.message")),
      confirmPassword: z.string().min(6, t("form.password.message")),
    })
    .refine((values) => values.password === values.confirmPassword, {
      message: t("form.confirm_password.message"),
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { error, message } = await createUser(values);

    if (error) {
      toast.error(message);
    } else {
      toast.success(message);
      setTimeout(() => {
        router.replace(`/${locale}/sign-in`);
      }, 1000);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.name.label")}</FormLabel>
              <FormControl>
                <Input placeholder={t("form.name.placeholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.phone.label")}</FormLabel>
              <FormControl>
                <PhoneInput
                  placeholder={t("form.phone.placeholder")}
                  defaultCountry="BR"
                  {...field}
                />
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.confirm_password.label")}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t("form.confirm_password.placeholder")}
                    className="pr-12"
                    {...field}
                  />
                  <Button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 pr-3 !outline-none !ring-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    variant="link"
                    aria-label="Toggle password visibility"
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
