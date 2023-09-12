export const useConfig = () => {
  const blogName = "PiiBlog";
  const blogDesc = "PiiBlog. Created for demonstration purposes";
  const showLoginButton = true;
  const copyRightNotice = true;
  return {
    blogName,
    blogDesc,
    copyRightNotice,
    showLoginButton,
  };
};
