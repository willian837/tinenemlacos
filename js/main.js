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
