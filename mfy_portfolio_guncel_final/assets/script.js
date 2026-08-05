const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.site-nav');
if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }));
}

document.getElementById('year').textContent = new Date().getFullYear();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Load the featured YouTube video only after the custom cover is clicked.
document.querySelectorAll('.video-poster-frame[data-video-id]').forEach(frame => {
  const playButton = frame.querySelector('.hero-play-button');
  const playVideo = () => {
    if (frame.classList.contains('is-playing')) return;
    const videoId = frame.dataset.videoId;
    const title = frame.dataset.videoTitle || 'YouTube videosu';
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
    iframe.title = title;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allowFullscreen = true;
    frame.classList.add('is-playing');
    frame.appendChild(iframe);
  };
  playButton?.addEventListener('click', playVideo);
});


// Play portfolio videos directly on the homepage instead of opening project pages.
document.querySelectorAll('.project-card[data-video-id]').forEach(card => {
  const playVideo = () => {
    const art = card.querySelector('.project-art');
    if (!art || art.classList.contains('is-playing')) return;

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${card.dataset.videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
    iframe.title = card.dataset.videoTitle || 'Portfolyo videosu';
    iframe.loading = 'eager';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allowFullscreen = true;

    art.classList.add('is-playing');
    card.classList.add('is-playing');
    card.setAttribute('aria-label', `${iframe.title} oynatılıyor`);
    art.appendChild(iframe);
  };

  card.addEventListener('click', playVideo);
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      playVideo();
    }
  });
});

// Service cards scroll to the most relevant portfolio example.
document.querySelectorAll('[data-service-link]').forEach(link => {
  link.addEventListener('click', event => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.classList.add('service-focus');
    window.setTimeout(() => target.classList.remove('service-focus'), 1800);
  });
});


// Photography lightbox
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.setAttribute('role', 'dialog');
lightbox.setAttribute('aria-modal', 'true');
lightbox.innerHTML = '<button class="lightbox-close" type="button" aria-label="Kapat">×</button><img alt="Büyütülmüş portfolyo fotoğrafı">';
document.body.appendChild(lightbox);
const lightboxImage = lightbox.querySelector('img');
const closeLightbox = () => {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  lightboxImage.removeAttribute('src');
};
document.querySelectorAll('[data-lightbox]').forEach(button => {
  button.addEventListener('click', () => {
    lightboxImage.src = button.dataset.lightbox;
    lightboxImage.alt = button.querySelector('img')?.alt || 'Portfolyo fotoğrafı';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lightbox-close').focus();
  });
});
lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox(); });

// Project request panel: live summary and WhatsApp/email handoff.
const orderForm = document.getElementById('project-order-form');
if (orderForm) {
  const field = name => orderForm.elements.namedItem(name);
  const selectedServices = () => [...orderForm.querySelectorAll('input[name="service"]:checked')].map(item => item.value);
  const valueOf = name => field(name)?.value?.trim() || '';
  const setText = (id, value, fallback = '—') => {
    const element = document.getElementById(id);
    if (element) element.textContent = value || fallback;
  };
  const updateSummary = () => {
    const services = selectedServices();
    setText('summary-services', services.join(', '), 'Henüz seçilmedi');
    setText('summary-format', valueOf('format'), 'Belirsiz');
    setText('summary-quantity', valueOf('quantity'));
    setText('summary-date', valueOf('date'));
    setText('summary-location', valueOf('location'));
    setText('summary-budget', valueOf('budget'), 'Belirtmek istemiyorum');
    setText('summary-title', valueOf('company') || valueOf('customerName'), 'Yeni Proje');
  };
  orderForm.addEventListener('input', updateSummary);
  orderForm.addEventListener('change', updateSummary);
  updateSummary();

  const createMessage = () => {
    const services = selectedServices();
    return [
      'Merhaba Mehmet Faruk Bey, video ve fotoğraf prodüksiyon hizmetleriniz hakkında bilgi almak istiyorum. Portfolyo siteniz üzerinden proje detaylarımı iletiyorum.',
      '',
      `Ad Soyad: ${valueOf('customerName') || '-'}`,
      `Marka / İşletme: ${valueOf('company') || '-'}`,
      `Telefon: ${valueOf('phone') || '-'}`,
      `E-posta: ${valueOf('email') || '-'}`,
      '',
      `Hizmet: ${services.length ? services.join(', ') : '-'}`,
      `Format: ${valueOf('format') || '-'}`,
      `İçerik adedi: ${valueOf('quantity') || '-'}`,
      `Planlanan tarih: ${valueOf('date') || '-'}`,
      `Çekim konumu: ${valueOf('location') || '-'}`,
      `Bütçe: ${valueOf('budget') || '-'}`,
      `Teslim beklentisi: ${valueOf('delivery') || '-'}`,
      '',
      `Proje açıklaması: ${valueOf('details') || '-'}`
    ].join('\n');
  };

  const validateServices = () => {
    let message = orderForm.querySelector('.form-message');
    if (!selectedServices().length) {
      if (!message) {
        message = document.createElement('p');
        message.className = 'form-message';
        orderForm.querySelector('.service-choice-grid').after(message);
      }
      message.textContent = 'Lütfen en az bir hizmet seçin.';
      orderForm.querySelector('.choice-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    message?.remove();
    return true;
  };

  orderForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!orderForm.reportValidity() || !validateServices()) return;
    const whatsappUrl = `https://wa.me/905437447274?text=${encodeURIComponent(createMessage())}`;
    window.open(whatsappUrl, '_blank', 'noopener');
  });

  document.getElementById('email-order')?.addEventListener('click', () => {
    if (!orderForm.reportValidity() || !validateServices()) return;
    const subject = `Yeni Proje Talebi — ${valueOf('company') || valueOf('customerName')}`;
    window.location.href = `mailto:mehmetfy1888@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(createMessage())}`;
  });
}

// One-at-a-time photo carousels with arrows, dots and mobile swipe.
document.querySelectorAll('[data-carousel]').forEach(carousel => {
  const track = carousel.querySelector('.photo-carousel-track');
  const viewport = carousel.querySelector('.photo-carousel-viewport');
  const slides = [...carousel.querySelectorAll('.photo-slide')];
  const previous = carousel.querySelector('.carousel-prev');
  const next = carousel.querySelector('.carousel-next');
  const counter = carousel.querySelector('.carousel-counter');
  const dotsContainer = carousel.querySelector('.carousel-dots');
  if (!track || !viewport || !slides.length) return;

  let current = 0;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchDeltaX = 0;
  let touchDeltaY = 0;
  let didSwipe = false;

  const dots = slides.map((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `${index + 1}. fotoğrafa git`);
    dot.addEventListener('click', () => goTo(index));
    dotsContainer?.appendChild(dot);
    return dot;
  });

  const update = () => {
    track.style.transform = `translate3d(-${current * 100}%, 0, 0)`;
    slides.forEach((slide, index) => {
      slide.setAttribute('aria-hidden', String(index !== current));
      slide.tabIndex = index === current ? 0 : -1;
    });
    dots.forEach((dot, index) => dot.classList.toggle('active', index === current));
    previous && (previous.disabled = current === 0);
    next && (next.disabled = current === slides.length - 1);
    if (counter) counter.textContent = `${current + 1} / ${slides.length}`;
  };

  function goTo(index) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    update();
  }

  previous?.addEventListener('click', () => goTo(current - 1));
  next?.addEventListener('click', () => goTo(current + 1));

  viewport.addEventListener('touchstart', event => {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
    touchDeltaX = 0;
    touchDeltaY = 0;
    didSwipe = false;
  }, { passive: true });
  viewport.addEventListener('touchmove', event => {
    touchDeltaX = event.touches[0].clientX - touchStartX;
    touchDeltaY = event.touches[0].clientY - touchStartY;
    const horizontalGesture = Math.abs(touchDeltaX) > Math.abs(touchDeltaY) && Math.abs(touchDeltaX) > 8;
    if (horizontalGesture) {
      event.preventDefault();
      didSwipe = true;
    }
  }, { passive: false });
  viewport.addEventListener('touchend', () => {
    if (Math.abs(touchDeltaX) > 45) goTo(current + (touchDeltaX < 0 ? 1 : -1));
    window.setTimeout(() => { didSwipe = false; }, 80);
  });
  viewport.addEventListener('click', event => {
    if (didSwipe) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  carousel.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') goTo(current - 1);
    if (event.key === 'ArrowRight') goTo(current + 1);
  });

  update();
});
