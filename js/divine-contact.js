document.addEventListener('DOMContentLoaded', () => {
  const replacements = new Map([
    ['New Delhi, India', 'K2, 1068, Durga Vihar, Devli, Khanpur, Delhi-110080'],
    ['Pan-India Operations', 'divineinteriors.v@gmail.com | +91-9717740876'],
    ['hello@heron-ai.com', 'divineinteriors.v@gmail.com'],
    ['303-569-8261', '+91-9717740876'],
  ]);

  const replaceValue = (value) => {
    replacements.forEach((replacement, original) => {
      value = value.replaceAll(original, replacement);
    });
    return value;
  };

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach((node) => {
    node.nodeValue = replaceValue(node.nodeValue);
  });

  document.querySelectorAll('meta[content], a[href], input[placeholder]').forEach((element) => {
    ['content', 'href', 'placeholder'].forEach((attribute) => {
      const value = element.getAttribute(attribute);
      if (value) element.setAttribute(attribute, replaceValue(value));
    });
  });
});
