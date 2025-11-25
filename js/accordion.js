/**
 * Accordion Component
 * Handles collapsible accordion sections (admission criteria and FAQ)
 */

document.addEventListener('DOMContentLoaded', function() {

  // Helper function to handle accordion functionality
  function initAccordion(headerSelector, itemSelector) {
    const accordionHeaders = document.querySelectorAll(headerSelector);

    accordionHeaders.forEach(header => {
      header.addEventListener('click', function() {
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
      header.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });
  }

  // Initialize admission accordion
  initAccordion('.admission-accordion__header', '.admission-accordion__item');

  // Initialize FAQ accordion
  initAccordion('.faq-accordion__header', '.faq-accordion__item');
});
