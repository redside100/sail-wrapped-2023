export const formatSize = (size) => {
  if (size < 1000) {
    return `${size} B`;
  } else if (size < 1000000) {
    return `${(size / 1000).toFixed(1)} KB`;
  } else if (size < 1000000000) {
    return `${(size / 1000000).toFixed(1)} MB`;
  } else {
    return `${(size / 1000000000).toFixed(1)} GB`;
  }
};
