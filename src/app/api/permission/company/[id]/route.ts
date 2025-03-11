import { getLocaleFromRequest } from "@/lib/locale";
import {
  GetCompanyPermissionParamsType,
  GetCompanyPermissionReponseType,
} from "./types";
import { getTranslations } from "next-intl/server";
import { database } from "@/lib/database";
import { ZodError } from "zod";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<GetCompanyPermissionParamsType> },
) {
  let response: GetCompanyPermissionReponseType;
  const searchParams = request.nextUrl.searchParams;
  const locale = getLocaleFromRequest(request);
  const t = await getTranslations({ locale, namespace: "api" });
  try {
    const { id } = await params;

    const search = searchParams.get("search");
    const page = Number(searchParams.get("page") ?? 1);
    const take = Number(searchParams.get("limit") ?? 10);
    const skip = page ? (page - 1) * take : 0;

    const permissions = await database.permission.findMany({
      where: {
        company_id: id,
        ...(search && {
          user: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          },
        }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      skip,
      take,
      orderBy: {
        updated_at: "desc",
      },
    });
    const totalCount = await database.permission.count({
      where: {
        company_id: id,
        ...(search && {
          user: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          },
        }),
      },
    });

    response = {
      status: 200,
      body: {
        message: t("permission.success", { type: "company", mode: "got" }),
        permissions,
        pageCount: Math.ceil(totalCount / take) || 1,
      },
    };
    return Response.json(response, { status: 200 });
  } catch (err) {
    console.log(err);
    if (err instanceof ZodError) {
      response = {
        status: 422,
        body: {
          error: t("permission.invalid_body"),
          details: err,
        },
      };
    }
    response = { status: 500, body: { error: t("permission.intern_error") } };
    return Response.json(response, { status: response.status });
  }
}
