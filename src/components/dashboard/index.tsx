import { getUserPermission } from "@/app/api/permission/user/[id]/actions";
import { getCurrentUser } from "@/lib/session";
import { Search } from "../common/search";
import ResultsPerPage from "../common/results-per-page";
import { PaginationSection } from "../common/pagination";
import { getTranslations } from "next-intl/server";
import { CompanyDialog } from "./dialog";
import { CompanyAlert } from "./alert";
import Image from "next/image";
import { Building2, ChevronRight } from "lucide-react";
import LocaleLink from "../common/locale-link";

export async function UserPermissions({
  queryParams,
}: {
  queryParams:
    | {
        search?: string;
        page?: string;
        limit?: string;
      }
    | undefined;
}) {
  const t = await getTranslations("UserPermissions");
  const user = await getCurrentUser();
  const { error, message, permissions, pageCount } = await getUserPermission(
    {
      id: user?.id ?? "notFound",
    },
    {
      search: queryParams?.search,
      page: Number(queryParams?.page ?? 1),
      limit: Number(queryParams?.limit ?? 10),
    },
  );
  return error ? (
    <p className="font-semibold text-destructive">{message}</p>
  ) : (
    <>
      <div className="flex flex-col h-full w-full overflow-auto">
        <div className="flex flex-col lg:flex-row items-center lg:justify-between w-full gap-4 mb-4">
          <Search placeholder={t("search")} />
          {user && <CompanyDialog user_id={user.id} />}
        </div>
        {permissions && permissions.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-4 overflow-auto">
            {permissions?.map((permission) => (
              <div
                key={permission.id}
                className="group relative border rounded-md shadow-sm bg-secondary/15 hover:bg-secondary/40 transition-all z-0"
              >
                <LocaleLink
                  href={`/dashboard/${permission.company.id}`}
                  className="absolute inset-0 z-10 p-2"
                >
                  <ChevronRight className="hidden lg:block absolute top-4 right-5 opacity-50 duration-300 ease-in-out group-hover:translate-x-1 group-hover:scale-105 group-hover:opacity-75" />
                  <div className="flex flex-col lg:flex-row items-center gap-4 lg:text-left transition-all">
                    <div className="flex items-center justify-center h-12 overflow-hidden">
                      {permission.company.logo ? (
                        <Image
                          src={permission.company.logo}
                          alt="logo"
                          width={120}
                          height={40}
                          className="dark:invert object-contain"
                          unoptimized
                        />
                      ) : (
                        <Building2
                          size={40}
                          className="dark:rotate-90 dark:scale-0 rotate-0 scale-100 transition-all"
                        />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <p className="text-xl font-medium">
                        {permission.company.name}
                      </p>
                      <p className="mt-[-0.25rem]">
                        {t(`role.${permission.role}`)}
                      </p>
                    </div>
                  </div>
                </LocaleLink>
                <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between min-h-9 mt-32 lg:mt-16 gap-2 p-2 w-full">
                  <p>
                    {t("last_update")}{" "}
                    {new Date(permission.company.updated_at).toLocaleString()}
                  </p>
                  {permission.role !== "user" && (
                    <div className="flex flex-col lg:flex-row items-center gap-2 w-full lg:w-auto relative z-20">
                      <CompanyDialog company={permission.company} />
                      {permission.role === "owner" && (
                        <CompanyAlert id={permission.company.id} />
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full justify-center items-center">
            <p>{t("no_results")}</p>
          </div>
        )}
      </div>
      <div className="flex flex-col lg:flex-row items-center gap-4 mt-4">
        <ResultsPerPage />
        <PaginationSection pageCount={pageCount ?? 1} />
      </div>
    </>
  );
}
