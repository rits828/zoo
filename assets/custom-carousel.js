if (!customElements.get("custom-carousel")) {
  class CustomCarousel extends HTMLElement {
    constructor() {
      super();
      this.splideInstance = null;
      this.observer = null;
      this.options = {
        type: 'slide',
        perPage: parseFloat(this.dataset.perPage) || 1,
        perMove: 1,
        gap: parseInt(this.dataset.gap) || 20,
        pagination: this.dataset.showPagination === 'true',
        arrows: this.dataset.showArrows === 'true',
        padding: {
          right: parseInt(this.dataset.paddingRight) || 0,
          left: parseInt(this.dataset.paddingLeft) || 0
        },
        breakpoints: {
          750: {
            perPage: parseFloat(this.dataset.perPageMobile) || 1,
            gap: parseInt(this.dataset.gapMobile) || 10,
            padding: {
              right: parseInt(this.dataset.paddingRightMobile) || 0,
              left: parseInt(this.dataset.paddingLeftMobile) || 0,
            }
          }
        }
      };
    }

    connectedCallback() {
      this.initSplide();

      if (this.classList.contains('hero-carousel')) {
        const header = document.querySelector('.section-header');
        if (!header) return;

        this.observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            header.classList.add('hero-banner-visible');
            header.classList.remove('hero-banner-not-visible');
          } else {
            header.classList.add('hero-banner-not-visible');
            header.classList.remove('hero-banner-visible');
          }
        }, { threshold: 0.1 });

        this.observer.observe(this);
      }
    }

    disconnectedCallback() {
      if (this.splideInstance) {
        this.splideInstance.destroy();
      }

      if (this.observer) {
        this.observer.disconnect();
      }
    }

    initSplide() {
      if (typeof Splide === 'undefined') return;
      this.splideInstance = new Splide(this, this.options).mount();
    }
  }

  customElements.define('custom-carousel', CustomCarousel);
}
