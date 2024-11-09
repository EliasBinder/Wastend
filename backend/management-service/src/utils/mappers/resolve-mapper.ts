export const mapResolve = (resolve: any) => ({
  id: resolve._id,
  findingId: resolve.finding_id,
  item: resolve.item,
  longitude: resolve.longitude,
  latitude: resolve.latitude,
  createdAt: resolve.created_at,
  updatedAt: resolve.updated_at,
});
