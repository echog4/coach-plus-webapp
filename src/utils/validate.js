export const isValidYouTubeUrl = (url) => {
  // eslint-disable-next-line no-useless-escape
  const regex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
  return regex.test(url);
};

export const getYouTubeVideoId = (url) => {
  const parsedUrl = new URL(url);
  let videoId = null;

  // Check for standard YouTube URL with video ID in query parameters
  if (parsedUrl.hostname.includes("youtube.com")) {
    videoId = parsedUrl.searchParams.get("v");
  }
  // Check for shortened YouTube URL format (youtu.be)
  else if (parsedUrl.hostname.includes("youtu.be")) {
    videoId = parsedUrl.pathname.split("/")[1];
  }

  return videoId;
};

export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};
