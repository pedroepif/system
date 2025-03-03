import { Header } from "@/components/common/header";
import { HeaderSkeleton } from "@/components/common/header/skeleton";
import { UserPermissions } from "@/components/dashboard/grid";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{
    search?: string;
    page?: string;
    limit?: string;
  }>;
}) {
  const queryParams = await searchParams;
  return (
    <>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <section className="flex flex-col h-full justify-center items-center p-4 text-center max-h-[calc(100vh-73px)]">
        <Suspense fallback={<Spinner />}>
          <UserPermissions queryParams={queryParams} />
        </Suspense>
      </section>
    </>
  );
}
