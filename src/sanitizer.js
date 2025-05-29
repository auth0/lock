import DOMPurify from 'dompurify';

export function initSanitizer() {
  // Extracted from the example at
  // https://github.com/cure53/DOMPurify/blob/main/demos/hooks-target-blank-demo.html
  DOMPurify.addHook('afterSanitizeAttributes', function (node) {
    // set all elements owning target to target=_blank
    if ('target' in node) {
      node.setAttribute('target', '_blank');
      // prevent https://www.owasp.org/index.php/Reverse_Tabnabbing
      node.setAttribute('rel', 'noopener noreferrer');
    }

    // set non-HTML/MathML links to xlink:show=new
    if (
      !node.hasAttribute('target') &&
      (node.hasAttribute('xlink:href') || node.hasAttribute('href'))
    ) {
      node.setAttribute('xlink:show', 'new');
    }
  });
}
