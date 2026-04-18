export async function fetchSurahs() {
  const res = await globalThis.fetch(`${globalThis.process?.env?.NEXT_PUBLIC_API_URL}/api/surahs`);
  return res.json();
}