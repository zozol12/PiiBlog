export const useStorageUtils = () => {
  const client = useSupabaseClient();
  const getThumbnailUrl = (thumbnailName: string = "default") => {
    const storage = client.storage.from("thumbnails");
    const backgroundImageUrl =
      storage.getPublicUrl(thumbnailName).data.publicUrl;
    return backgroundImageUrl;
  };

  const getBackgroundImageStyle = (thumbnailName: string = "default") => {
    const backgroundImageUrl = getThumbnailUrl(thumbnailName);
    return { backgroundImage: `url('${backgroundImageUrl}')` };
  };
  return { getThumbnailUrl, getBackgroundImageStyle };
};
