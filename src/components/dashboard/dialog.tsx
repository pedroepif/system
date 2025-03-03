"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import Image from "next/image";
import { fileToBase64 } from "@/lib/file";
import { toast } from "sonner";
import { createCompany } from "@/app/api/company/actions";
import { useState } from "react";
import { updateCompany } from "@/app/api/company/[id]/actions";

export function CompanyDialog({
  company,
  user_id,
}: {
  company?: {
    id: string;
    name: string;
    logo_white: string | null;
    logo_black: string | null;
  };
  user_id?: string;
}) {
  const t = useTranslations("CompanyDialog");
  const mode = company ? "edit" : "create";
  const [open, setOpen] = useState(false);

  const fileSchema = z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: t("input.file.too_large"),
    });

  const formSchema = z.object({
    name: z.string().min(1, t("input.name.message")),
    user_id: z.string(),
    logo_black: z.string().optional(),
    logo_black_file: fileSchema,
    logo_white: z.string().optional(),
    logo_white_file: fileSchema,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: company?.name ?? "",
      user_id: user_id ?? "",
      logo_black: company?.logo_black ?? "",
      logo_white: company?.logo_white ?? "",
    },
  });

  const logo_black = form.watch("logo_black");
  const logo_white = form.watch("logo_white");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.logo_black_file) {
      values.logo_black = await fileToBase64(values.logo_black_file);
    }
    if (values.logo_white_file) {
      values.logo_white = await fileToBase64(values.logo_white_file);
    }
    const response =
      mode === "edit" && company
        ? await updateCompany(values, { id: company.id })
        : await createCompany(values);
    const { error, message, company: newCompany } = response;
    if (error || !newCompany) {
      toast.error(message);
    } else {
      toast.success(message);
      form.reset({
        name: mode === "edit" ? newCompany.name : "",
        user_id,
        logo_black: mode === "edit" ? (newCompany.logo_black ?? "") : "",
        logo_black_file: undefined,
        logo_white: mode === "edit" ? (newCompany.logo_white ?? "") : "",
        logo_white_file: undefined,
      });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full lg:w-auto">{t(`${mode}.button`)}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t(`${mode}.title`)}</DialogTitle>
          <DialogDescription>{t(`${mode}.description`)}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("input.name.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("input.name.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {mode === "edit" && company && (
              <>
                <FormField
                  control={form.control}
                  name="logo_black_file"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("input.logo_black.label")}</FormLabel>
                      <FormControl>
                        <div className="flex flex-row items-center gap-2">
                          {logo_black && (
                            <Image
                              src={logo_black}
                              alt="logo_black"
                              className="border rounded-md object-cover bg-white"
                              width={100}
                              height={100}
                              unoptimized
                            />
                          )}
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(ev) =>
                              field.onChange(ev.target.files?.[0])
                            }
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="logo_white_file"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("input.logo_white.label")}</FormLabel>
                      <FormControl>
                        <div className="flex flex-row items-center gap-2">
                          {logo_white && (
                            <Image
                              src={logo_white}
                              alt="logo_white"
                              className="border rounded-md object-cover bg-black"
                              width={100}
                              height={100}
                              unoptimized
                            />
                          )}
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(ev) =>
                              field.onChange(ev.target.files?.[0])
                            }
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {t(`${mode}.submit`)}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
