"use client";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ResultsPerPage() {
  const t = useTranslations("ResultsPerPage");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentLimit = Number(searchParams.get("limit") ?? 10);
  const handleLimit = (limit: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("limit", limit.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };
  return (
    <div className="flex flex-row items-center justify-center lg:justify-end gap-4 w-full">
      <p className="text-sm">{t("label")}</p>
      <Select
        value={currentLimit.toString()}
        onValueChange={(v) => handleLimit(Number(v))}
      >
        <SelectTrigger className="w-[70px]">
          <SelectValue placeholder={t("placeholder")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="25">25</SelectItem>
          <SelectItem value="50">50</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
