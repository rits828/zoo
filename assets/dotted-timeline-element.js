class DottedTimelineElement extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const timelineSection = this; // The custom element itself

    const tabButtons = timelineSection.querySelectorAll('.tab-button');
    const tabContents = timelineSection.querySelectorAll('.tab-content');
    const progressTabs = timelineSection.querySelectorAll('.progress-tabs');
    const progressContainer = timelineSection.querySelector('.progress-container');
    const progressHighlightLine = timelineSection.querySelector('.progress-highlight-line');
    let currentTabIndex = 0;
    let autoplayInterval;

    
    const activateTab = (index) => {
      tabButtons.forEach((button, i) => {
        button.classList.remove('active');
        if (i <= index) {
          setTimeout(() => {
            progressTabs[i].classList.add('is-completed');
          }, 100);
        } else {
          progressTabs[i].classList.remove('is-completed');
        }
      });
      tabContents.forEach(content => content.classList.remove('active'));

      if (tabButtons[index]) {
        tabButtons[index].classList.add('active');
        progressTabs[index].classList.add('active');

        const activeTabElement = progressTabs[index];
        const containerRect = progressContainer.getBoundingClientRect();
        const isMobile = window.innerWidth <= 767;

        if (isMobile) {
          // Mobile: Calculate width using (100/length) * activeIndex
          const totalTabs = progressTabs.length;
          const widthPercentage = (100 / totalTabs) * (index + 1);
          progressHighlightLine.style.width = `${widthPercentage}%`;
          progressHighlightLine.style.height = '2px';
        } else {
          // Desktop: Calculate height for vertical filling
          const dotOffsetY = 11 + (21 / 2);
          const activeDotCenterY = (activeTabElement.getBoundingClientRect().top - containerRect.top) + dotOffsetY;
          let highlightHeight;

          if (index === progressTabs.length - 1) {
            highlightHeight = activeDotCenterY;
          } else {
            const nextTabElement = progressTabs[index + 1];
            const nextDotCenterY = (nextTabElement.getBoundingClientRect().top - containerRect.top) + dotOffsetY;
            highlightHeight = (activeDotCenterY + nextDotCenterY) / 2;
          }

          progressHighlightLine.style.height = highlightHeight + 'px';
          progressHighlightLine.style.width = '2px';
        }
      }
      if (tabContents[index]) {
        tabContents[index].classList.add('active');
      }
    };

    const startAutoplay = () => {
      autoplayInterval = setInterval(() => {
        currentTabIndex = (currentTabIndex + 1) % tabButtons.length;
        activateTab(currentTabIndex);
      }, 3000); // Change tab every 5 seconds
    };

    const stopAutoplay = () => {
      clearInterval(autoplayInterval);
    };

    tabButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        stopAutoplay(); // Stop autoplay when a button is clicked
        currentTabIndex = index;
        activateTab(currentTabIndex);
        // Optionally restart autoplay after a delay
        // setTimeout(startAutoplay, 10000); // restart after 10 seconds of inactivity
      });

      // Pause autoplay on hover, resume on mouseleave
      button.addEventListener('mouseenter', stopAutoplay);
      button.addEventListener('mouseleave', startAutoplay);
    });

    // Initial activation and start autoplay
    activateTab(currentTabIndex);
    startAutoplay();

    // Optionally stop autoplay when the element is disconnected from the DOM
    // this.disconnectedCallback = () => {
    //   stopAutoplay();
    // };
  }
}

customElements.define('dotted-timeline', DottedTimelineElement); 