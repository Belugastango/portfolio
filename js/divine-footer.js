document.addEventListener('DOMContentLoaded', () => {
  const footerStyle = document.createElement('style');
  footerStyle.textContent = `
    .footer-menu {
      border-top: 1px solid rgba(40, 40, 40, 0.24);
      border-bottom: 1px solid rgba(40, 40, 40, 0.24);
    }
    .footer-menu-item {
      border-right: 1px solid rgba(40, 40, 40, 0.24);
      border-bottom: 1px solid rgba(40, 40, 40, 0.24);
    }
    .footer-menu-item:last-child {
      border-right: 1px solid rgba(40, 40, 40, 0.24) !important;
    }
    .footer-info-wrap {
      border-top: 1px solid rgba(40, 40, 40, 0.24);
      border-bottom: 1px solid rgba(40, 40, 40, 0.24);
    }
    .footer-info-item {
      border-right: 1px solid rgba(40, 40, 40, 0.24);
      border-bottom: 1px solid rgba(40, 40, 40, 0.24);
    }
    .footer-info-item:last-child {
      border-right: 1px solid rgba(40, 40, 40, 0.24) !important;
    }
  `;
  document.head.appendChild(footerStyle);

  const footerItems = document.querySelectorAll('.footer-menu-item');
  if (!footerItems.length) return;

  const setLabel = (item, text) => {
    const label = item.querySelector('.footer-menu-item-label .txt');
    if (label) label.textContent = text;
  };

  setLabel(footerItems[0], 'Company');
  setLabel(footerItems[1], 'Services');
  setLabel(footerItems[2], 'Portfolio');

  document.querySelectorAll('.footer-menu-item-link').forEach((link) => {
    if (link.textContent.trim().toLowerCase().includes('about')) link.remove();
  });

  const serviceLinks = footerItems[1]?.querySelectorAll('.footer-menu-item-link');
  ['Civil and Interior', 'MEP', 'HVAC', 'Facade Works'].forEach((text, index) => {
    if (serviceLinks?.[index]) serviceLinks[index].querySelector('.txt').textContent = text;
  });
});
