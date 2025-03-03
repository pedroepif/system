"use client";
import flags from "react-phone-number-input/flags";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useParams, useRouter } from "next/navigation";

export function LocaleToggle() {
  const { locale } = useParams();
  const router = useRouter();

  const BrFlag = flags.BR;
  const UsFlag = flags.US;

  const handleLanguageChange = (lang: string) => {
    if (lang === locale) return;
    const path = window.location.pathname;
    const newPath = `/${lang}${path.substring(3)}`;
    router.push(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {locale === "pt" && BrFlag && <BrFlag title="Brazil" />}
          {locale === "en" && UsFlag && <UsFlag title="United States" />}
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {BrFlag && (
          <DropdownMenuItem onClick={() => handleLanguageChange("pt")}>
            <BrFlag title="Brazil" />
            <DropdownMenuShortcut>PT-BR</DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
        {UsFlag && (
          <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
            <UsFlag title="United States" />
            <DropdownMenuShortcut>EN-US</DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
