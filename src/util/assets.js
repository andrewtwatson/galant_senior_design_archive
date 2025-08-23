export const asset = (path) => {
    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${process.env.PUBLIC_URL}${normalizedPath}`;
  };