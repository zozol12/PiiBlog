export const useConfig = () => {
  const blogName = "PiiBlog";
  const blogDesc = "PiiBlog. Created for demonstration purposes";
  const showLoginButton = false;
  const copyRightNotice = true;
  return {
    blogName,
    blogDesc,
    copyRightNotice,
    showLoginButton,
  };
};
