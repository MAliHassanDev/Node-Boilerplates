export async function executeInsertTakeFirstOrThrow<T>(
  query: Promise<T[]>,
): Promise<T> {
  const result = await query;
  if (!result[0]) throw new Error("No record returned from  query");
  return result[0];
}
