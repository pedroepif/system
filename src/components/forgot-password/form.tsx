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
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { forgotPassword } from "@/app/api/user/forgot/actions";

export function ForgotPasswordForm() {
  const t = useTranslations("ForgotPassword");
  const router = useRouter();
  const { locale } = useParams();

  const formSchema = z.object({
    email: z.string().email(t("form.email.message")),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { error, message } = await forgotPassword(values);

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
