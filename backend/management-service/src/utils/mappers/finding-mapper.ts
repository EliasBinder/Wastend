export const mapFinding = (finding: any) => ({
  id: finding._id,
  longitude: finding.longitude,
  latitude: finding.latitude,
  createdAt: finding.created_at,
  updatedAt: finding.updated_at,
});
