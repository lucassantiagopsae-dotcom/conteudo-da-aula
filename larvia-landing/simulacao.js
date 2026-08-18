/* ============================================================
   Larvia Consórcios — Simulação (página dedicada, estilo Typeform)
   Versão enxuta: 4 perguntas de qualificação + nome, telefone e e-mail.
   1 pergunta por tela -> resposta -> avanço automático -> próxima pergunta.
   ============================================================ */

const STEPS = [
  {
    id: 'intro',
    type: 'intro',
    eyebrow: 'Simulação Larvia',
    title: 'Vamos encontrar uma opção para o seu objetivo?',
    desc: 'Responda algumas perguntas rápidas para entendermos o imóvel que você procura e o seu momento atual.',
    hint: 'Leva menos de 2 minutos.',
    button: 'Começar simulação',
  },
  {
    id: 'objetivo', type: 'choice', question: 'Qual é o seu principal objetivo com o consórcio?',
    options: ['Comprar minha primeira casa', 'Trocar de casa ou apartamento', 'Comprar um imóvel para investimento', 'Ainda estou avaliando'],
  },
  {
    id: 'valor_imovel', type: 'choice', question: 'Qual valor aproximado do imóvel que você pretende adquirir?',
    options: ['Até R$ 200 mil', 'De R$ 200 mil a R$ 500 mil', 'De R$ 500 mil a R$ 1 milhão', 'Ainda não sei'],
  },
  {
    id: 'prazo', type: 'choice', question: 'Quando você pretende adquirir esse imóvel?',
    options: ['Assim que possível', 'Nos próximos 6 a 12 meses', 'Daqui a mais de 1 ano', 'Ainda estou apenas pesquisando'],
  },
  {
    id: 'parcela', type: 'choice', question: 'Quanto você considera confortável investir por mês nesse planejamento?',
    options: ['Até R$ 1.000/mês', 'De R$ 1.000 a R$ 3.500/mês', 'Acima de R$ 3.500/mês', 'Ainda preciso avaliar'],
  },
  {
    id: 'nome', type: 'text', question: 'Como podemos te chamar?', placeholder: 'Digite seu nome', inputType: 'text', autocomplete: 'name',
  },
  {
    id: 'telefone', type: 'text', question: 'Qual é o melhor WhatsApp para falar com você?', placeholder: '(00) 00000-0000', inputType: 'tel', autocomplete: 'tel',
    hint: 'Utilizaremos este número para entrar em contato sobre sua simulação.', button: 'Finalizar simulação',
  },
  { id: 'success', type: 'success' },
];

// Passos que contam para a barra de progresso (exclui intro/success)
const QUESTION_STEP_IDS = STEPS.filter(s => !['intro', 'success'].includes(s.type)).map(s => s.id);

const state = { index: 0, answers: {} };

const stage = document.getElementById('formStage');
const progressFill = document.getElementById('progressFill');
const progressLabel = document.getElementById('progressLabel');

function goTo(i) {
  state.index = Math.max(0, Math.min(STEPS.length - 1, i));
  render();
}
function next() { goTo(state.index + 1); }

function updateProgress(step) {
  const qIdx = QUESTION_STEP_IDS.indexOf(step.id);
  if (step.type === 'intro') {
    progressFill.style.width = '0%';
    progressLabel.textContent = 'Início';
    return;
  }
  if (step.type === 'success') {
    progressFill.style.width = '100%';
    progressLabel.textContent = 'Concluído';
    return;
  }
  const pct = Math.round(((qIdx + 1) / QUESTION_STEP_IDS.length) * 100);
  progressFill.style.width = pct + '%';
  progressLabel.textContent = `Etapa ${qIdx + 1} de ${QUESTION_STEP_IDS.length}`;
}

function render() {
  const step = STEPS[state.index];
  updateProgress(step);
  stage.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'form-step active';

  if (step.type === 'intro') {
    wrap.classList.add('form-intro');
    wrap.innerHTML = `
      <span class="step-eyebrow">${step.eyebrow}</span>
      <h2>${step.title}</h2>
      <p class="step-desc">${step.desc}</p>
      <p class="micro-copy">${step.hint}</p>
      <button class="btn btn-primary" id="introBtn">${step.button}</button>
    `;
    stage.appendChild(wrap);
    wrap.querySelector('#introBtn').addEventListener('click', next);
    return;
  }

  if (step.type === 'success') {
    const name = state.answers.nome ? state.answers.nome.split(' ')[0] : '';
    wrap.classList.add('form-success');
    const waMessage = encodeURIComponent(`Olá! Sou ${state.answers.nome || ''} e acabei de fazer minha simulação de consórcio imobiliário na Larvia.`);
    wrap.innerHTML = `
      <div class="success-badge">✓</div>
      <h2>Pronto, recebemos sua simulação.</h2>
      <p class="step-desc">Obrigado, <strong>${name || 'você'}</strong>. Nossa equipe vai analisar suas respostas e apresentar as possibilidades disponíveis para o seu objetivo.</p>
      <p class="step-desc">Um especialista da Larvia Consórcios poderá entrar em contato pelo WhatsApp informado.</p>
      <a class="btn btn-primary" href="https://wa.me/5500000000000?text=${waMessage}" target="_blank" rel="noopener">Falar com um especialista no WhatsApp</a>
    `;
    stage.appendChild(wrap);
    return;
  }

  if (step.type === 'choice') {
    wrap.innerHTML = `<h2>${step.question}</h2><div class="choice-list"></div>`;
    stage.appendChild(wrap);
    const list = wrap.querySelector('.choice-list');
    step.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.type = 'button';
      btn.textContent = opt;
      if (state.answers[step.id] === opt) btn.classList.add('selected');
      btn.addEventListener('click', () => {
        state.answers[step.id] = opt;
        setTimeout(next, 180);
      });
      list.appendChild(btn);
    });
    return;
  }

  if (step.type === 'text') {
    wrap.innerHTML = `
      <h2>${step.question}</h2>
      <input class="field-input" id="fieldInput" type="${step.inputType || 'text'}" placeholder="${step.placeholder}" autocomplete="${step.autocomplete || 'off'}">
      ${step.hint ? `<p class="micro-copy">${step.hint}</p>` : ''}
      <div class="form-actions">
        <button class="btn btn-primary" id="continueBtn">${step.button || 'Continuar'}</button>
      </div>
    `;
    stage.appendChild(wrap);
    const input = wrap.querySelector('#fieldInput');
    input.value = state.answers[step.id] || '';
    input.focus();

    const submit = () => {
      const val = input.value.trim();
      if (!val) {
        input.focus();
        input.style.borderColor = '#c0392b';
        return;
      }
      state.answers[step.id] = val;
      next();
    };

    wrap.querySelector('#continueBtn').addEventListener('click', submit);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); submit(); }
    });
    return;
  }
}

render();
