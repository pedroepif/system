"use client";
import { updateUser } from "@/app/api/user/[id]/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuShortcut } from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { fileToBase64 } from "@/lib/file";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import { toast } from "sonner";
import { z } from "zod";

export function UserDialog({
  user,
}: {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string | null;
  };
}) {
  const t = useTranslations("User");
  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    name: z.string().min(1, t("update.form.name.message")),
    phone: z
      .string()
      .refine(isValidPhoneNumber, t("update.form.phone.message")),
    avatar_file: z
      .instanceof(File)
      .optional()
      .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
        message: t("update.form.avatar.message"),
      }),
    avatar: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      phone: user.phone,
      avatar: user.avatar ?? "",
    },
  });

  const currentAvatar = form.watch("avatar");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.avatar_file) {
      values.avatar = await fileToBase64(values.avatar_file);
    }

    const {
      error,
      message,
      user: newUser,
    } = await updateUser(values, { id: user.id });

    if (error || !newUser) {
      toast.error(message);
    } else {
      toast.success(message);
      form.reset({
        name: newUser.name,
        phone: newUser.phone,
        avatar: newUser.avatar ?? "",
        avatar_file: undefined,
      });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex items-center justify-between w-full hover:bg-accent hover:text-accent-foreground text-sm text-center py-1.5 px-2 rounded-sm transition-colors cursor-default select-none">
        {t("update.button")}
        <DropdownMenuShortcut>
          <Edit size={16} />
        </DropdownMenuShortcut>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("update.title")}</DialogTitle>
          <DialogDescription>{t("update.description")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("update.form.name.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("update.form.name.placeholder")}
                      {...field}
                    />
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
                  <FormLabel>{t("update.form.phone.label")}</FormLabel>
                  <FormControl>
                    <PhoneInput
                      placeholder={t("update.form.phone.placeholder")}
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
              name="avatar_file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("update.form.avatar.label")}</FormLabel>
                  <FormControl>
                    <div className="flex flex-row items-center gap-2">
                      {currentAvatar && (
                        <Avatar className="rounded-sm">
                          <AvatarImage
                            className="rounded-sm"
                            src={currentAvatar ?? ""}
                          />
                          <AvatarFallback className="rounded-sm">
                            {user.name.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(ev) => field.onChange(ev.target.files?.[0])}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {t("update.form.button")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
