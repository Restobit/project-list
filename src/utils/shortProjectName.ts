export const shortProjectName = (projectName: string) => {
  const splittedProjectName = projectName.trim().split(/\s+/);

  if (splittedProjectName.length > 0) {
    return splittedProjectName
      .map((name) => name.charAt(0).toUpperCase())
      .join("");
  }
  return "";
};
