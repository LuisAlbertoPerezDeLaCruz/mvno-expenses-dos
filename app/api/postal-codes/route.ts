import { NextRequest, NextResponse } from "next/server";
import {
  parsePostalCodeFiltersFromSearchParams,
  queryPostalCodes,
} from "@/lib/postal-codes";

export async function GET(request: NextRequest) {
  try {
    const filters = parsePostalCodeFiltersFromSearchParams(
      request.nextUrl.searchParams,
    );
    const result = await queryPostalCodes(filters);

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
