import { Header } from "@/components/common/header";
import { HeaderSkeleton } from "@/components/common/header/skeleton";
import { Suspense } from "react";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{
    company: string;
  }>;
}) {
  const { company } = await params;
  return (
    <>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header company={company} />
      </Suspense>
      {children}
    </>
  );
}
