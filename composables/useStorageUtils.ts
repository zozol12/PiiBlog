export const useStorageUtils = () => {
  const client = useSupabaseClient();
  const getThumbnailUrl = (thumbnailName: string = "default") => {
    const storage = client.storage.from("thumbnails");
    const backgroundImageUrl =
      storage.getPublicUrl(thumbnailName).data.publicUrl;
    return backgroundImageUrl;
  };
  return { getThumbnailUrl };
};
