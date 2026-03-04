// Helper genérico para pedir JSON tipado desde cualquier endpoint.
export async function fetchJson<T>(
  url: string,
  // Opciones de fetch estándar + opciones Next.js (ej: revalidate).
  init?: RequestInit & { next?: NextFetchRequestConfig },
): Promise<T> {
  const res = await fetch(url, init);

  // Si el HTTP status no es 2xx, lanzamos error controlado.
  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
  }

  // Convertimos la respuesta a JSON y la tipamos como T.
  return (await res.json()) as T;
}
