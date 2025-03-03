import { LocaleToggle } from "../locale/toggle";
import { ThemeToggle } from "../theme/toggle";
import { Spinner } from "@/components/ui/spinner";

export function HeaderSkeleton() {
  return (
    <section className="flex flex-row items-center justify-between min-w-screen border-b p-4">
      <Spinner size={"small"} />
      <div className="flex flex-row gap-2">
        <LocaleToggle />
        <ThemeToggle />
        <Spinner size={"small"} />
      </div>
    </section>
  );
}
