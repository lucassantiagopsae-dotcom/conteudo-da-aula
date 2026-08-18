/* ============================================================
   Larvia Consórcios — interações da landing page (FAQ accordion)
   O formulário de simulação vive em simulacao.html / simulacao.js
   ============================================================ */

document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});
