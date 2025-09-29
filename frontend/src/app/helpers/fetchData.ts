const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Cache to store promises and prevent infinite loops
const promiseCache = new Map<string, Promise<unknown>>();

export default function fetchData(endpoint: string, token: string) {
  if (!token) {
    throw new Error("No token found");
  }

  const cacheKey = `${API_URL}${endpoint}-${token}`;

  if (!promiseCache.has(cacheKey)) {
    const promise = fetch(`${API_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching data");
        }
        return response;
      })
      .then((res) => res.json())
      .then((result) => result.data);

    promiseCache.set(cacheKey, promise);
  }

  return promiseCache.get(cacheKey)!;
}
