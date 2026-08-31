/**
 * NUV KHELAIYA — GALLERY & LIGHTBOX SYSTEM
 * Cultural Committee of Navrachana University
 */

document.addEventListener('DOMContentLoaded', () => {
  initGalleryFiltering();
  initLightboxModal();
});

/**
 * 1. FILTERABLE CATEGORIES & SMOOTH TRANSITION
 */
function initGalleryFiltering() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length === 0 || galleryItems.length === 0) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active filter button
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach((item) => {
        const itemCategory = item.getAttribute('data-category');

        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.85)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/**
 * 2. FULLSCREEN LIGHTBOX MODAL
 */
function initLightboxModal() {
  const lightbox = document.querySelector('.lightbox-modal');
  const lightboxImg = document.querySelector('.lightbox-image');
  const lightboxCaption = document.querySelector('.lightbox-caption-text');
  const closeBtn = document.querySelector('.lightbox-close-btn');
  const prevBtn = document.querySelector('.lightbox-nav-prev');
  const nextBtn = document.querySelector('.lightbox-nav-next');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!lightbox || !lightboxImg || galleryItems.length === 0) return;

  let currentIndex = 0;
  const itemsArray = Array.from(galleryItems);

  function openLightbox(index) {
    currentIndex = index;
    const currentItem = itemsArray[currentIndex];
    const img = currentItem.querySelector('.gallery-img');
    const caption = currentItem.querySelector('.gallery-item-caption');

    if (img) lightboxImg.src = img.src;
    if (lightboxCaption && caption) lightboxCaption.textContent = caption.textContent;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + itemsArray.length) % itemsArray.length;
    openLightbox(currentIndex);
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % itemsArray.length;
    openLightbox(currentIndex);
  }

  // Bind click on gallery items
  itemsArray.forEach((item, idx) => {
    item.addEventListener('click', () => {
      openLightbox(idx);
    });
  });

  // Controls
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);
  if (nextBtn) nextBtn.addEventListener('click', showNext);

  // Close on outside click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
}
