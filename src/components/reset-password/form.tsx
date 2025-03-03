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
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Spinner } from "@/components/ui/spinner";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { verifyJwt } from "@/lib/jwt";
import { updateUser } from "@/app/api/user/[id]/actions";

export function ResetPasswordForm() {
  const t = useTranslations("ResetPassword");
  const router = useRouter();
  const { locale } = useParams();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const formSchema = z
    .object({
      id: z.string(),
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
      id: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { id, password } = values;
    const { error, message } = await updateUser({ password }, { id });

    if (error) {
      toast.error(message);
    } else {
      toast.success(message);
      setTimeout(() => {
        router.replace(`/${locale}/sign-in`);
      }, 1000);
    }
  };

  const [verifingToken, setVerifingToken] = useState(true);
  const [invalidToken, setInvalidToken] = useState(false);

  useEffect(() => {
    const validation = async () => {
      if (token) {
        await verifyJwt(token)
          .then((decoded) => {
            form.setValue("id", (decoded as { id: string }).id);
          })
          .catch(() => {
            setInvalidToken(true);
          });
      } else {
        setInvalidToken(true);
      }

      setVerifingToken(false);
    };
    void validation();
  }, [token, form]);
  if (verifingToken) {
    return <Spinner />;
  }

  if (invalidToken) {
    return (
      <p className="font-semibold text-primary">{t("form.invalid_token")}</p>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
