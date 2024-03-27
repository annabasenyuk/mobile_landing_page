import Swiper from "https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.esm.browser.min.js";

window.addEventListener('DOMContentLoaded', () => {
  let pageSlider = null;

  if (!pageSlider) {
    pageSlider = new Swiper(".page-slider", {
      direction: "vertical",
      spaceBetween: 0,
      slidesPerView: "auto",
      speed: 800,
      keyboard: {
        enabled: true,
        onlyInViewport: true,
        pageUpDown: true,
      },
      mousewheel: {
        sensitivity: 1,
      },
      watchOverflow: true,
      init: false,
      allowTouchMove: false,
    });
    pageSlider.init();
  } else {
    pageSlider.destroy(true, true);
  }

  
  const nextBtn = document.querySelector('.swiper-button-next');

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      pageSlider.slideNext();
    });
  }

});