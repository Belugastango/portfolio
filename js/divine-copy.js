document.addEventListener('DOMContentLoaded', () => {
  const replacements = [
    ['Architects spend hours on manual modelling, coordination, and cleanup, work that pulls focus away from the actual design.', 'Transforming design concepts into flawless built environments requires seamless coordination between architecture, engineering, and site execution.'],
    ["Most of it is repetitive and rule-based, the kind of task that shouldn't need a person doing it by hand every time.", 'From civil contracting and MEP systems to bespoke joinery, every detail demands precision craftsmanship and disciplined project oversight.'],
    ['AI help sits outside your model', 'Great interiors begin with a team that understands your space'],
    ["Generic AI tools can't see your project, so you keep copying, pasting, and re-explaining the same context.", 'Generic ideas are never enough. Our team studies your brief, your site, and the way your space needs to work.'],
    ['Heron works inside your design tool as an agent that sees your model, flags issues, and makes edits on your approval, so the busywork stops eating your day.', 'Divine Interiors bridges the gap between vision and execution, delivering turnkey commercial and residential spaces on time and without compromise.'],
    ["Heron runs inside the design software you already use. It reads your model, understands what you're working on, and can make changes directly, with every action shown to you first so nothing happens without your say-so.", 'Our designers, consultants, and execution teams work together to turn design intent into precise, buildable spaces with every decision clearly coordinated.'],
    ['RUN AN AGENT NATIVELY IN YOUR MODEL', 'TURN DESIGN INTENT INTO BUILT REALITY'],
    ['Works with Revit, Rhino, ArchiCAD, SketchUp.', 'Full-spectrum Civil, MEP, HVAC & Turnkey Fit-Outs.'],
    ['Understands your geometry and intent.', 'Translates complex architectural intent into buildable spaces.'],
    ['Suggests fixes while you work.', 'Proactive on-site engineering and rigorous quality control.'],
    ['Edits automatically after your approval.', 'Flawless handover with zero-tolerance execution standards.'],
    ['Heron Chat widget', 'Turnkey Fit-Outs & Joinery'],
    ['A chat that floats over your design tool. Ask it about your model or tell it what to change, and it acts inside the software on your approval.', 'From structural civil work to bespoke millwork, our site execution teams manage every millimeter of fit-out with absolute craftsmanship and complete accountability.'],
    ['Ask code questions about your building and get answers that reflect how the code applies to your layout, occupancy, and conditions, not just what the requirements say in isolation.', 'Integrated electrical, HVAC, plumbing, and fire safety systems engineered in strict compliance with national building codes and architectural specifications.'],
    ['Heron fits into your process instead of replacing it. It watches quietly, speaks up when something needs attention, and only acts when you say so, so you stay in control the whole way through.', 'Divine Interiors delivers end-to-end turnkey spatial solutions. We oversee every phase from BOQ estimation to site handover, ensuring uncompromising luxury and absolute project control.'],
    ['Heron watches your model as you design', 'Detailed spatial surveys and precision site feasibility'],
    ['It flags issues and suggests fixes in plain language', 'Cross-disciplinary alignment between design, MEP, and site teams'],
    ['With your approval, it makes the edit directly in the model', 'Turnkey execution with strict tolerance, premium finishes, and timely delivery'],
    ["It picks up your firm's standards and gets more useful over time", 'Upholding corporate brand standards and bespoke luxury craftsmanship'],
    ['Hand the repetitive modelling to Heron and keep your focus on design.', 'Let our team handle execution and detailing while you stay focused on the design.'],
    ['Skip the tedious drawing cleanup and let Heron handle the repeatable parts.', 'Move past site uncertainties with a disciplined team that keeps every detail consistent.'],
    ['AI activity tasks', 'Project milestones'],
    ['ACT: WITH YOUR APPROVAL IT MAKES EDIT', 'EXECUTION: RIGOROUS QUALITY CONTROL & CRAFTSMANSHIP'],
    ['IT FLAGS ISSUES AND SUGGEST FIXES', 'PROACTIVE ONSITE COORDINATION & SOLVING ISSUES'],
    ['IT PICKS UP FIRM STANDARDS', 'UNCOMPROMISING LUXURY & BESPOKE QUALITY STANDARDS'],
    ['An AI agent that works inside your design tools', 'Interior Architecture & Spatial Precision'],
    ['Concept Crafted by Bearplus', 'Interior Architecture Studio'],
    ['Heron AI', 'Divine Interiors'],
    ['Bearplus', 'Divine Interiors'],
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
