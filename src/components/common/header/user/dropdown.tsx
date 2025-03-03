"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { UserDialog } from "./dialog";
import { useTranslations } from "next-intl";
import { invalidateUserSession } from "@/app/api/user/session/[token]/actions";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

export function UserDropdown({
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
  const router = useRouter();
  const { locale } = useParams();

  const logOut = async () => {
    const { error, message } = await invalidateUserSession();

    if (error) {
      toast.error(message);
    } else {
      router.replace(`/${locale}/sign-in`);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Avatar className="rounded-sm">
            <AvatarImage className="rounded-sm" src={user.avatar ?? ""} />
            <AvatarFallback className="rounded-sm">
              {user.name.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <UserDialog user={user} />
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logOut}>
          {t("log_out")}
          <DropdownMenuShortcut>
            <LogOut />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
