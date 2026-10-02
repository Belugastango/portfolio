document.addEventListener('DOMContentLoaded', () => {
  const replacements = [
    ['AI help sits outside your model', 'Great interiors begin with a team that understands your space'],
    ["Generic AI tools can't see your project, so you keep copying, pasting, and re-explaining the same context.", 'Generic ideas are never enough. Our team studies your brief, your site, and the way your space needs to work.'],
    ['Heron works inside your design tool as an agent that sees your model, flags issues, and makes edits on your approval, so the busywork stops eating your day.', 'Divine Interiors brings design, coordination, and execution together, so your project moves smoothly from concept to handover.'],
    ["Heron runs inside the design software you already use. It reads your model, understands what you're working on, and can make changes directly, with every action shown to you first so nothing happens without your say-so.", 'Our designers, consultants, and execution teams work together to turn design intent into precise, buildable spaces with every decision clearly coordinated.'],
    ['Heron Chat widget', 'Design Coordination'],
    ['Heron fits into your process instead of replacing it. It watches quietly, speaks up when something needs attention, and only acts when you say so, so you stay in control the whole way through.', 'Divine Interiors fits into your process with thoughtful collaboration, clear communication, and hands-on control at every stage of the project.'],
    ['Heron watches your model as you design', 'We study every detail as your space takes shape'],
    ['Hand the repetitive modelling to Heron and keep your focus on design.', 'Let our team handle coordination and detailing while you stay focused on the design.'],
    ['Skip the tedious drawing cleanup and let Heron handle the repeatable parts.', 'Move past tedious drawing cleanup with a disciplined team that keeps every detail consistent.'],
    ['AI activity tasks', 'Project activity'],
  ];

  const replaceText = (value) => replacements.reduce((result, [from, to]) => result.replaceAll(from, to), value);
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach((node) => {
    node.nodeValue = replaceText(node.nodeValue);
  });

  document.querySelectorAll('img[alt], [title], [aria-label]').forEach((element) => {
    ['alt', 'title', 'aria-label'].forEach((attribute) => {
      const value = element.getAttribute(attribute);
      if (value) element.setAttribute(attribute, replaceText(value));
    });
  });
});
