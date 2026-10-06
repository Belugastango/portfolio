function initServices() {
  const services = [
    {
      label: 'CIVIL AND INTERIOR',
      number: '[01]',
      title: 'CIVIL AND INTERIOR',
      description: 'Complete civil construction and interior execution for retail, hospitality, and office spaces - from structural build to fully finished fit-out, delivered on schedule.',
      image: 'assets/service-civil-interior.png',
    },
    {
      label: 'MEP',
      number: '[02]',
      title: 'MEP',
      description: 'Comprehensive mechanical, electrical, and plumbing systems for commercial fit-outs - coordinated, code-compliant, and installed to spec across single and multi-location projects.',
      image: 'assets/service-mep.png',
    },
    {
      label: 'HVAC',
      number: '[03]',
      title: 'HVAC',
      description: 'End-to-end HVAC design and installation for retail, hospitality, and commercial spaces - keeping every project comfortable, efficient, and fully compliant.',
      image: 'assets/service-hvac.png',
    },
    {
      label: 'FACADE WORKS',
      number: '[04]',
      title: 'FACADE WORKS',
      description: 'External facade design and execution across retail and commercial projects - built to brand standards and compliant with mall and building authority requirements.',
      image: 'assets/service-facade.png',
    },
  ];

  document.querySelectorAll('.home-problem-item').forEach((card, index) => {
    const service = services[index];
    if (!service) return;

    const label = card.querySelector('.home-problem-item-head-title .txt');
    const num = card.querySelector('.home-problem-item-head-num .txt');
    const title = card.querySelector('.home-problem-item-title .heading');
    const description = card.querySelector('.home-problem-item-sub .txt');
    const imgInner = card.querySelector('.home-problem-item-img-inner');

    if (label) label.textContent = service.label;
    if (num) num.textContent = service.number;
    if (title) title.innerHTML = service.title;
    if (description) description.textContent = service.description;

    if (imgInner && service.image) {
      imgInner.innerHTML = `<img src="${service.image}" alt="${service.title}" class="service-art-img" loading="lazy" />`;
    }
  });

  // Interactive Signature Projects Accordion & Image Switcher
  const faqItems = document.querySelectorAll('.home-usecase-faq-item');
  const imgItems = document.querySelectorAll('.home-usecase-img-item');
  if (faqItems.length && imgItems.length) {
    function activateProject(targetIdx) {
      faqItems.forEach((item, i) => {
        item.classList.toggle('active', i === targetIdx);
        const sub = item.querySelector('.home-usecase-faq-item-sub');
        if (sub) {
          sub.style.display = i === targetIdx ? 'block' : 'none';
        }
      });
      imgItems.forEach((img, i) => {
        img.classList.toggle('active', i === targetIdx);
      });
    }

    faqItems.forEach((item, idx) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        activateProject(idx);
      });
      item.addEventListener('mouseenter', () => activateProject(idx));
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initServices);
} else {
  initServices();
}


