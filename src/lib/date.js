export function formatPostDate(date) {
  if (!date) return null;

  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-CA",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );
}