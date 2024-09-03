export const errorMessageToStatusCode = (message: string): number => {
  if (message.includes('Server returned 404 Not Found')) {
    return 404;
  }
  if (message === 'audio duration calculation failed') {
    return 400;
  }
  if (message === 'audio conversion failed') {
    return 400;
  }
  if (message === 'service unavailable') {
    return 503;
  }
  if (message === 'Unauthorized') {
    return 401;
  }
  return 500;
};
