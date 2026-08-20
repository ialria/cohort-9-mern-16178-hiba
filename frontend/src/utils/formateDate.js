function formatDate(date) {
  if (!date) return "";
  const noteDate = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now - noteDate) / 1000);
  if (diffInSeconds < 60) {
    return "Just now";
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hr ago`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return "Yesterday";
  }
  if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  }
  return noteDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: noteDate.getFullYear() !== now.getFullYear()
      ? "numeric"
      : undefined,
  });
}

export default formatDate