import { NextRequest, NextResponse } from "next/server";
import { queryPostalCodes } from "@/lib/postal-codes";

function parseNumber(value: string | null, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const result = await queryPostalCodes({
      page: parseNumber(searchParams.get("page"), 1),
      limit: parseNumber(searchParams.get("limit"), 20),
      estado: searchParams.get("estado") ?? undefined,
      colonia: searchParams.get("colonia") ?? undefined,
      ciudad: searchParams.get("ciudad") ?? undefined,
      codigoPostal: searchParams.get("codigoPostal") ?? undefined,
      nombre: searchParams.get("nombre") ?? undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json(
      { error: "No se pudo consultar codigos postales", message },
      { status: 500 },
    );
  }
}
