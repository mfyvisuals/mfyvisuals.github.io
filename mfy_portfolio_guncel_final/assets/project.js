const yearTarget = document.querySelector('[data-year]');
if (yearTarget) yearTarget.textContent = new Date().getFullYear();

document.querySelectorAll('.video-box[data-video-id]').forEach(box => {
  const poster = box.querySelector('.project-video-poster');
  poster?.addEventListener('click', () => {
    const videoId = box.dataset.videoId;
    const title = box.dataset.videoTitle || 'YouTube videosu';
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
    iframe.title = title;
    iframe.loading = 'eager';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allowFullscreen = true;
    poster.remove();
    box.appendChild(iframe);
  });
});
