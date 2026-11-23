export const isDesktopApp =
  typeof window !== 'undefined' && window.location.protocol === 'app:';
