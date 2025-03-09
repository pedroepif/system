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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { CircleHelp } from "lucide-react";

export function CompanyDialog({
  company,
  user_id,
}: {
  company?: {
    id: string;
    name: string;
    logo: string | null;
  };
  user_id?: string;
}) {
  const t = useTranslations("CompanyDialog");
  const mode = company ? "edit" : "create";
  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    name: z.string().min(1, t("input.name.message")),
    user_id: z.string(),
    logo: z.string().optional(),
    logo_file: z
      .instanceof(File)
      .optional()
      .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
        message: t("input.file.too_large"),
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: company?.name ?? "",
      user_id: user_id ?? "",
      logo: company?.logo ?? "",
    },
  });

  const logo = form.watch("logo");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.logo_file) {
      values.logo = await fileToBase64(values.logo_file);
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
        logo: mode === "edit" ? (newCompany.logo ?? "") : "",
        logo_file: undefined,
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
              <FormField
                control={form.control}
                name="logo_file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("input.logo.label")}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <CircleHelp size={14} />
                          </TooltipTrigger>
                          <TooltipContent>
                            {t("input.logo.tooltip")}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <div className="flex flex-row items-center gap-2">
                        {logo && (
                          <Image
                            src={logo}
                            alt="logo"
                            className="border rounded-md object-cover dark:invert"
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
