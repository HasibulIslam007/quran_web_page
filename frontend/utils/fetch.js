export async function fetchSurahs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/surahs`);
  return res.json();
}