"use client";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useTranslations } from "next-intl";
import { deleteCompany } from "@/app/api/company/[id]/actions";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useState } from "react";

export function CompanyAlert({ id }: { id: string }) {
  const t = useTranslations("CompanyAlert");
  const [open, setOpen] = useState(false);
  const handleDelete = async () => {
    const { error, message } = await deleteCompany({ id });
    if (error) {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"} className="w-full lg:w-auto">
          {t("button")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("description")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            {t("continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
