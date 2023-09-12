export const useConfig = () => {
  const blogName = "PiiBlog";
  const blogDesc = "PiiBlog. Created for demonstration purposes";
  const showLoginButton = false; // TODO make it work lol
  const copyRightNotice = true;
  return {
    blogName,
    blogDesc,
    copyRightNotice,
    showLoginButton,
  };
};