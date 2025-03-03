import { getCurrentUser } from "@/lib/session";
import { LocaleToggle } from "../locale/toggle";
import { ThemeToggle } from "../theme/toggle";
import { UserDropdown } from "./user/dropdown";
import Logo from "./logo";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import LocaleLink from "../locale-link";
import { getCompany } from "@/app/api/company/[id]/actions";

export async function Header({ company }: { company?: string }) {
  const user = await getCurrentUser();
  const comapanyData = company ? await getCompany({ id: company }) : undefined;
  return (
    <section className="flex flex-row items-center justify-between min-w-screen border-b p-4">
      <Logo company={comapanyData?.company} />
      <div className="flex flex-row gap-2">
        {company && (
          <LocaleLink href="/dashboard">
            <Button variant={"outline"} size={"icon"}>
              <Building2 className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Building2 className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </LocaleLink>
        )}
        <LocaleToggle />
        <ThemeToggle />
        {user && <UserDropdown user={user} />}
      </div>
    </section>
  );
}
