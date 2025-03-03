"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";

export function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (search) {
        params.set("search", search);
      } else {
        params.delete("search");
      }
      router.replace(`${pathname}?${params.toString()}`);
    }, 300);
    return () => clearTimeout(handler);
  }, [search, pathname, router, searchParams]);

  return (
    <div className="flex flex-row items-center w-full lg:w-96">
      <Input
        placeholder={placeholder}
        onChange={(ev) => setSearch(ev.currentTarget.value)}
        value={search}
        className="pr-10 w-full"
      />
      <SearchIcon className="ml-[-2rem] text-base text-muted-foreground" />
    </div>
  );
}
