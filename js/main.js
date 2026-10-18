/* Tineném Laços: funcionamento da página (catálogo, filtros, pedido pelo WhatsApp).
   Os dados (WhatsApp e produtos) ficam em js/dados.js. */

function linkPedido(msg) {
  return WHATSAPP ? "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg) : INSTAGRAM;
}

function precoTexto(p) {
  return typeof p.preco === "number"
    ? p.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    : "Consulte";
}
function rotulo(p) { return p.nome + " (" + p.tam + ")"; }

const grade = document.getElementById("grade");
grade.innerHTML = produtos.map((p, i) => `
  <article class="cartela" data-index="${i}" data-cat="${p.cat.join(" ")}${p.nomeBordado ? " nome" : ""}">
    <div class="foto" role="button" tabindex="0" aria-label="Ver detalhes de ${p.nome}">
      <img src="img/produtos/${p.img}" alt="${p.nome} ${p.tam}: ${p.desc}" loading="${i < 4 ? "eager" : "lazy"}">
      <span class="tam">${p.tam}</span>
      <span class="lupa-dica" title="Toque para ver os detalhes do bordado" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="10.5" cy="10.5" r="7"/><path d="M21 21l-5.2-5.2"/><path d="M8 10.5h5M10.5 8v5"/></svg>
      </span>
      ${p.nomeBordado ? `<span class="nome-tag" title="Personalizável com nome">${p.nomeBordado}</span>` : ""}
    </div>
    <div class="info">
      <span class="tipo">${p.nomeBordado ? "Com nome bordado" : (p.cat.includes("kit") ? "Dupla / kit" : p.cat.includes("faixa") ? "Faixa / tiara" : "Laço")}</span>
      <h3>${p.nome}</h3>
      <p class="preco">${precoTexto(p)}</p>
      <p class="desc">${p.desc}</p>
    </div>
    <button type="button" class="btn btn-borda pedir" data-index="${i}">Quero esse</button>
  </article>`).join("");

document.querySelectorAll(".filtros button").forEach(b => b.addEventListener("click", () => {
  document.querySelectorAll(".filtros button").forEach(x => x.setAttribute("aria-pressed", x === b));
  const f = b.dataset.filtro;
  grade.querySelectorAll(".cartela").forEach(c => { c.hidden = f !== "todos" && !c.dataset.cat.split(" ").includes(f); });
}));

/* monte seu pedido */
const nomeEl = document.getElementById("nome"), modeloEl = document.getElementById("modelo");
const acabamentoEl = document.getElementById("acabamento"), corEl = document.getElementById("cor");
const ocasiaoEl = document.getElementById("ocasiao"), obsEl = document.getElementById("obs");
const btnPedir = document.getElementById("pedir-personalizado");
/* lista de modelos: cada produto com tamanho e valor, em ordem alfabética */
const ordem = produtos.map((p, i) => i).sort((a, b) => rotulo(produtos[a]).localeCompare(rotulo(produtos[b]), "pt-BR"));
modeloEl.innerHTML = '<option value="">Ainda não sei, quero ajuda</option>' +
  ordem.map(i => `<option value="${i}">${rotulo(produtos[i])} · ${precoTexto(produtos[i])}</option>`).join("");

function montarPedido() {
  const p = modeloEl.value === "" ? null : produtos[Number(modeloEl.value)];
  const linhas = [
    "Olá, Irlem! Quero encomendar um laço:",
    "• Modelo: " + (p ? rotulo(p) + " · " + precoTexto(p) : "Ainda não sei, quero ajuda"),
    "• Acabamento: " + acabamentoEl.value,
    "• Cor: " + corEl.value
  ];
  if (ocasiaoEl && ocasiaoEl.value && ocasiaoEl.value !== "Uso no dia a dia") {
    linhas.push("• Ocasião: " + ocasiaoEl.value);
  }
  if (nomeEl.value.trim()) linhas.push("• Nome bordado: " + nomeEl.value.trim());
  if (obsEl.value.trim()) linhas.push("• Detalhes: " + obsEl.value.trim());
  linhas.push(p && typeof p.preco === "number" ? "Pode confirmar o pedido e o prazo?" : "Pode me passar o valor?");
  const msg = linhas.join("\n");
  btnPedir.dataset.msg = msg;
  btnPedir.href = linkPedido(msg);
}
[nomeEl, modeloEl, acabamentoEl, corEl, ocasiaoEl, obsEl].forEach(el => el && el.addEventListener("input", () => {
  montarPedido();
  atualizarChips();
}));

function atualizarChips() {
  document.querySelectorAll(".chips-ocasiao button").forEach(btn => {
    btn.classList.toggle("ativo", ocasiaoEl && ocasiaoEl.value === btn.dataset.val);
  });
}

document.querySelectorAll(".chips-ocasiao button").forEach(btn => {
  btn.addEventListener("click", () => {
    if (ocasiaoEl.value === btn.dataset.val) {
      ocasiaoEl.value = "Uso no dia a dia";
    } else {
      ocasiaoEl.value = btn.dataset.val;
    }
    montarPedido();
    atualizarChips();
  });
});

document.getElementById("form-laco").addEventListener("submit", e => e.preventDefault());

/* "Quero esse": leva ao formulário com o modelo já escolhido */
const formEl = document.getElementById("form-laco");
const OPC_ACABAMENTO = { faixa: 0, tiara: 2, ajuda: 3 }; // posições na lista "Acabamento"
const semAnimacao = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function escolherModelo(idx) {
  const p = produtos[idx];
  modeloEl.value = String(idx);
  acabamentoEl.selectedIndex = p.nome.startsWith("Tiara") ? OPC_ACABAMENTO.tiara
    : p.cat.includes("faixa") ? OPC_ACABAMENTO.faixa
    : OPC_ACABAMENTO.ajuda;
  montarPedido();
  document.getElementById("personalize").scrollIntoView({ behavior: semAnimacao ? "auto" : "smooth", block: "start" });
  nomeEl.focus({ preventScroll: true });
  formEl.classList.remove("destaque");
  void formEl.offsetWidth; // reinicia a animação se tocar em outro produto
  formEl.classList.add("destaque");
}
grade.querySelectorAll(".pedir").forEach(btn => btn.addEventListener("click", () => escolherModelo(Number(btn.dataset.index))));

/* links de pedido */
document.querySelectorAll(".js-whats").forEach(a => {
  a.href = linkPedido(a.dataset.msg || "");
  a.target = "_blank"; a.rel = "noopener";
});
document.getElementById("whats-texto").textContent = WHATSAPP
  ? "WhatsApp: +" + WHATSAPP.replace(/^(\d{2})(\d{2})(\d{5})(\d{4})$/, "$1 ($2) $3-$4")
  : "Pedidos pelo direct do Instagram";

/* menor preço do catálogo, na etiqueta "Valores" */
const comPreco = produtos.filter(p => typeof p.preco === "number");
if (comPreco.length) {
  const menor = Math.min(...comPreco.map(p => p.preco));
  document.getElementById("preco-minimo").textContent = "A partir de " + precoTexto({ preco: menor }).replace(",00", "");
}

/* ano do rodapé: atualiza sozinho a cada ano */
document.getElementById("ano").textContent = new Date().getFullYear();

montarPedido();

/* zoom / lightbox */
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lb-img");
const lbTitulo = document.getElementById("lb-titulo");
const lbDesc = document.getElementById("lb-desc");
const lbBtn = document.getElementById("lb-btn");
const lbFechar = document.getElementById("lb-fechar");

function abrirZoom(idx) {
  const p = produtos[idx];
  if (!p || !lightbox) return;
  lbImg.src = "img/produtos/" + p.img;
  lbImg.alt = p.nome + " " + p.tam + ": " + p.desc;
  lbTitulo.textContent = rotulo(p) + " · " + precoTexto(p);
  lbDesc.textContent = p.desc;
  const msg = "Olá, Irlem! Vi o " + rotulo(p) + " · " + precoTexto(p) + " no catálogo e quero encomendar.";
  lbBtn.dataset.msg = msg;
  lbBtn.href = linkPedido(msg);
  if (typeof lightbox.showModal === "function") {
    lightbox.showModal();
  } else {
    lightbox.setAttribute("open", "");
  }
}

function fecharZoom() {
  if (!lightbox) return;
  if (typeof lightbox.close === "function") {
    lightbox.close();
  } else {
    lightbox.removeAttribute("open");
  }
}

grade.querySelectorAll(".foto").forEach(el => {
  const acao = () => {
    const cartela = el.closest(".cartela");
    if (cartela) abrirZoom(Number(cartela.dataset.index));
  };
  el.addEventListener("click", acao);
  el.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      acao();
    }
  });
});

if (lbFechar) lbFechar.addEventListener("click", fecharZoom);
if (lightbox) {
  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) fecharZoom();
  });
}

/* Contagem até o prazo de Natal ("dd/mm"). Devolve quantos dias faltam
   (0 = é hoje) ou encerrado = true depois do prazo. Conta dias de calendário. */
function contagemNatal(prazo, hoje = new Date()) {
  const [dia, mes] = String(prazo).split("/").map(Number);
  if (!dia || !mes) return null;
  const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  const limite = new Date(hoje.getFullYear(), mes - 1, dia);
  const dias = Math.round((limite - inicioHoje) / 86400000);
  return { dias, encerrado: dias < 0 };
}

/* ============================================================
   Coleção de Natal (liga/desliga em js/dados.js → NATAL.ativo)
   ============================================================ */
(function natal() {
  const secao = document.getElementById("natal");
  const faixa = document.getElementById("faixa-natal");
  if (!secao) return;
  /* a faixa e a seção começam escondidas no HTML: só aparecem com o Natal ligado */
  if (typeof NATAL === "undefined" || !NATAL.ativo) return;
  secao.hidden = false;
  if (faixa) faixa.hidden = false;

  document.querySelectorAll(".js-natal-prazo").forEach(el => { el.textContent = NATAL.prazo; });

  /* contagem regressiva até o prazo */
  const conta = contagemNatal(NATAL.prazo);
  const encerrado = !!(conta && conta.encerrado);
  if (conta) {
    const faixaPrazo = document.getElementById("faixa-prazo");
    const secaoPrazo = document.getElementById("natal-prazo");
    const ate = `<span class="faixa-longo"> (até <b>${NATAL.prazo}</b>)</span>`;
    if (encerrado) {
      faixaPrazo.innerHTML = "encomendas de Natal encerradas";
      secaoPrazo.textContent = "❄ As encomendas de Natal deste ano foram encerradas. Fale com a Irlem para consultar disponibilidade.";
    } else if (conta.dias === 0) {
      faixaPrazo.innerHTML = "<b>último dia</b> para encomendar para o Natal!";
      secaoPrazo.innerHTML = "❄ <b>Hoje é o último dia</b> para encomendar e receber antes do dia 24.";
    } else if (conta.dias <= 30) {
      const falta = conta.dias === 1 ? "falta 1 dia" : `faltam ${conta.dias} dias`;
      faixaPrazo.innerHTML = `<b>${falta}</b><span class="faixa-longo"> para encomendar</span>${ate}`;
      secaoPrazo.innerHTML = `❄ <b>${falta[0].toUpperCase() + falta.slice(1)}</b>: pedidos de Natal até <b>${NATAL.prazo}</b> para receber antes do dia 24.`;
    }
  }

  /* vagas limitadas: número real, atualizado à mão em js/dados.js */
  const vagas = typeof NATAL.vagas === "number" ? Math.max(0, Math.floor(NATAL.vagas)) : null;
  const esgotado = vagas === 0 && !encerrado;
  if (vagas !== null && !encerrado) {
    const textoVagas = esgotado ? "Vagas de Natal esgotadas"
      : vagas <= 5 ? (vagas === 1 ? "Última vaga de Natal!" : `Últimas ${vagas} vagas de Natal!`)
      : `Restam ${vagas} vagas de Natal`;
    const caixa = document.getElementById("vagas-natal");
    caixa.textContent = textoVagas + (esgotado ? ". Entre na lista de espera: se abrir vaga, a Irlem chama você." : "");
    caixa.classList.toggle("poucas", vagas <= 5);
    caixa.classList.toggle("esgotado", esgotado);
    caixa.hidden = false;
    const naFaixa = document.querySelector(".js-vagas-faixa");
    if (naFaixa) { naFaixa.textContent = " · " + textoVagas.replace("!", "").replace(" de Natal", ""); naFaixa.hidden = false; }
  }

  const grade = document.getElementById("natal-grade");
  grade.innerHTML = NATAL.produtos.map(p => `
    <article class="cartela">
      <div class="foto">
        <img src="img/produtos/${p.img}" alt="${p.nome}: ${p.desc}" loading="lazy">
        <span class="tam">${p.tam}</span>
        ${p.provisoria ? '<span class="provisoria">Foto provisória</span>' : ""}
      </div>
      <div class="info">
        <span class="tipo">Coleção de Natal</span>
        <h3>${p.nome}</h3>
        <p class="preco">${typeof p.preco === "number" ? precoTexto(p) : "Valor em breve"}</p>
        <p class="desc">${p.desc}</p>
      </div>
      <a class="btn btn-natal pedir" href="${linkPedido(encerrado
          ? `Olá, Irlem! Vi o ${p.nome} (${p.tam}) da Coleção de Natal. Ainda tem disponibilidade?`
          : esgotado
          ? `Olá, Irlem! Vi que as vagas de Natal esgotaram. Quero entrar na lista de espera para o ${p.nome} (${p.tam}).`
          : `Olá, Irlem! Vi o ${p.nome} (${p.tam}) da Coleção de Natal e quero encomendar para o Natal.`)}"
         target="_blank" rel="noopener">${encerrado ? "Consultar disponibilidade" : esgotado ? "Entrar na lista de espera" : "Quero para o Natal"}</a>
    </article>`).join("");

  /* vale-presente */
  const valeAtivo = !!(NATAL.vale && NATAL.vale.ativo);
  const valeBox = document.getElementById("vale-presente");
  if (!valeAtivo) {
    if (valeBox) valeBox.hidden = true;
  } else {
    document.querySelectorAll(".js-vale-validade").forEach(el => { el.textContent = NATAL.vale.validade; });
    const valoresEl = document.getElementById("vale-valores");
    const outroEl = document.getElementById("vale-outro");
    const paraEl = document.getElementById("vale-para"), deEl = document.getElementById("vale-de");
    const msgEl = document.getElementById("vale-msg"), btnVale = document.getElementById("pedir-vale");
    const reais = v => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    valoresEl.innerHTML = NATAL.vale.valores.map((v, i) =>
      `<button type="button" data-valor="${v.valor}" aria-pressed="${i === 0}">${reais(v.valor).replace(",00", "")}` +
      (v.dica ? `<small>${v.dica}</small>` : "") + `</button>`).join("") +
      `<button type="button" data-valor="outro" aria-pressed="false">Outro valor</button>`;

    function montarVale() {
      const sel = valoresEl.querySelector('[aria-pressed="true"]');
      const outro = sel && sel.dataset.valor === "outro";
      outroEl.hidden = !outro;
      const num = outro ? Number(outroEl.value.replace(/[^\d,]/g, "").replace(",", ".")) : Number(sel.dataset.valor);
      const linhas = ["Olá, Irlem! Quero um Vale-Presente Tineném (cartão digital):",
        "• Valor: " + (num > 0 ? reais(num) : "(quero combinar)")];
      if (paraEl.value.trim()) linhas.push("• Para: " + paraEl.value.trim());
      if (deEl.value.trim()) linhas.push("• De: " + deEl.value.trim());
      if (msgEl.value.trim()) linhas.push("• Mensagem do cartão: " + msgEl.value.trim());
      linhas.push("Como faço o pagamento?");
      btnVale.href = linkPedido(linhas.join("\n"));
    }
    valoresEl.addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      valoresEl.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b));
      montarVale();
      if (b.dataset.valor === "outro") outroEl.focus();
    });
    [outroEl, paraEl, deEl, msgEl].forEach(el => el.addEventListener("input", montarVale));
    document.getElementById("form-vale").addEventListener("submit", e => e.preventDefault());
    montarVale();

    /* depois do prazo, o vale vira o destaque da faixa */
    if (encerrado) {
      document.getElementById("faixa-prazo").innerHTML = 'não deu tempo? Dê um <b>Vale-Presente Tineném</b>';
      if (faixa) faixa.href = "#vale-presente";
      document.getElementById("natal-prazo").textContent =
        "❄ As encomendas de Natal foram encerradas, mas ainda dá tempo de dar um Vale-Presente: a pequena escolhe o laço depois.";
    }
  }

  /* vídeo do guarda-roupa: toca uma vez quando aparece na tela e para no quadro do poste */
  const video = document.getElementById("natal-video");
  const replay = document.getElementById("natal-replay");
  if (video) {
    const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (semMovimento) {
      video.poster = "img/natal/guarda-roupa-fim.webp";   // só o quadro final, parado (o vídeo não é baixado)
    } else {
      video.preload = "metadata";                          // só começa a baixar com o Natal ligado
      let tocou = false;
      const tocar = () => { video.currentTime = 0; video.play().catch(() => {}); };
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(([e], obs) => {
          if (e.isIntersecting && !tocou) { tocou = true; tocar(); obs.disconnect(); }
        }, { threshold: 0.5 }).observe(video);
      }
      video.addEventListener("ended", () => { replay.hidden = false; });
      replay.addEventListener("click", () => { replay.hidden = true; tocar(); });
    }
  }

  /* modo Natal leve no resto da página (passarinho, linha dourada, azevinho, floquinho) */
  document.documentElement.classList.add("modo-natal");

  /* neve: densa e branca na seção de Natal; rala e azulada no topo claro */
  nevar(secao, secao.querySelector(".neve"), { cor: "rgba(244,241,236,.85)", max: 90, espaco: 14 });
  const hero = document.querySelector(".hero");
  if (hero) {
    const c = document.createElement("canvas");
    c.className = "neve-topo"; c.setAttribute("aria-hidden", "true");
    hero.prepend(c);
    nevar(hero, c, { cor: "rgba(140,165,190,.35)", max: 28, espaco: 45 });
  }
})();

/* Neve caindo devagar dentro de um elemento. Só anima quando ele está na tela;
   fica parada para quem pediu menos animação no aparelho. */
function nevar(area, canvas, { cor, max, espaco }) {
  if (!area || !canvas) return;
  const ctx = canvas.getContext("2d");
  const parada = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let flocos = [], w = 0, h = 0, visivel = false;

  function medir() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = area.clientWidth; h = area.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    flocos = Array.from({ length: Math.round(Math.min(max, w / espaco)) }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: 0.8 + Math.random() * 2.2, v: 0.25 + Math.random() * 0.6, d: Math.random() * Math.PI * 2,
    }));
  }
  function desenhar() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = cor;
    for (const f of flocos) { ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill(); }
  }
  function passo() {
    if (!visivel) return;
    for (const f of flocos) {
      f.y += f.v; f.d += 0.01; f.x += Math.sin(f.d) * 0.3;
      if (f.y > h + 4) { f.y = -4; f.x = Math.random() * w; }
    }
    desenhar();
    requestAnimationFrame(passo);
  }

  medir(); desenhar();
  window.addEventListener("resize", () => { medir(); desenhar(); });
  if (!parada && "IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => {
      const antes = visivel; visivel = e.isIntersecting;
      if (visivel && !antes) requestAnimationFrame(passo);
    }).observe(area);
  }
}
