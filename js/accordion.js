/**
 * Accordion Component
 * Handles collapsible accordion sections (admission criteria, FAQ, and programs)
 */

document.addEventListener('DOMContentLoaded', function () {

  // Helper function to handle accordion functionality
  function initAccordion(headerSelector, itemSelector) {
    const accordionHeaders = document.querySelectorAll(headerSelector);

    accordionHeaders.forEach(header => {
      header.addEventListener('click', function () {
        const item = this.closest(itemSelector);
        const content = this.nextElementSibling;
        const isActive = item.classList.contains(`${itemSelector.slice(1)}--active`);

        // Close all accordion items of the same type
        document.querySelectorAll(itemSelector).forEach(accordionItem => {
          accordionItem.classList.remove(`${itemSelector.slice(1)}--active`);
        });

        // If the clicked item was not active, open it
        if (!isActive) {
          item.classList.add(`${itemSelector.slice(1)}--active`);
        }
      });

      // Keyboard navigation
      header.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });
  }

  // Initialize admission accordion
  initAccordion('.admission-accordion__header', '.admission-accordion__item');

  // Initialize FAQ accordion (legacy)
  initAccordion('.faq-accordion__header', '.faq-accordion__item');

  // Initialize FAQ item component
  initAccordion('.faq-item__header', '.faq-item');

  // Initialize Programs accordion (mobile)
  initProgramsAccordion();
});

/**
 * Programs Accordion - Special handling for mobile programs section
 */
function initProgramsAccordion() {
  const headers = document.querySelectorAll('.programs-accordion__header');

  headers.forEach(header => {
    header.addEventListener('click', function () {
      const panel = this.nextElementSibling;
      const isOpen = panel.classList.contains('programs-accordion__panel--open');

      // Close all panels first
      document.querySelectorAll('.programs-accordion__panel').forEach(p => {
        p.classList.remove('programs-accordion__panel--open');
      });
      document.querySelectorAll('.programs-accordion__header').forEach(h => {
        h.classList.remove('programs-accordion__header--active');
      });

      // If it wasn't open, open it
      if (!isOpen) {
        panel.classList.add('programs-accordion__panel--open');
        this.classList.add('programs-accordion__header--active');
      }
    });

    // Keyboard navigation
    header.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
}
