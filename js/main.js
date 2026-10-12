/* Tineném Laços: funcionamento da página (catálogo, filtros, pedido pelo WhatsApp).
   Os dados (WhatsApp e produtos) ficam em js/dados.js. */

function linkPedido(msg) {
  return WHATSAPP ? "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg) : INSTAGRAM;
}

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
      <p class="desc">${p.desc}</p>
    </div>
    <a class="btn btn-borda pedir js-whats" href="#" target="_blank" rel="noopener"
       data-msg="Olá, Irlem! Vi o ${p.nome} (${p.tam}) no catálogo e quero saber valor e prazo.">Quero esse</a>
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
const modelos = [...new Set(produtos.map(p => p.nome))].sort((a, b) => a.localeCompare(b, "pt-BR"));
modeloEl.innerHTML = ["Ainda não sei, quero ajuda", ...modelos].map(m => `<option>${m}</option>`).join("");

function montarPedido() {
  const linhas = [
    "Olá, Irlem! Quero encomendar um laço:",
    "• Modelo: " + modeloEl.value,
    "• Acabamento: " + acabamentoEl.value,
    "• Cor: " + corEl.value
  ];
  if (ocasiaoEl && ocasiaoEl.value && ocasiaoEl.value !== "Uso no dia a dia") {
    linhas.push("• Ocasião: " + ocasiaoEl.value);
  }
  if (nomeEl.value.trim()) linhas.push("• Nome bordado: " + nomeEl.value.trim());
  if (obsEl.value.trim()) linhas.push("• Detalhes: " + obsEl.value.trim());
  linhas.push("Pode me passar o valor?");
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

/* links de pedido */
document.querySelectorAll(".js-whats").forEach(a => {
  a.href = linkPedido(a.dataset.msg || "");
  a.target = "_blank"; a.rel = "noopener";
});
document.getElementById("whats-texto").textContent = WHATSAPP
  ? "WhatsApp: +" + WHATSAPP.replace(/^(\d{2})(\d{2})(\d{5})(\d{4})$/, "$1 ($2) $3-$4")
  : "Pedidos pelo direct do Instagram";

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
  lbTitulo.textContent = p.nome + " (" + p.tam + ")";
  lbDesc.textContent = p.desc;
  const msg = "Olá, Irlem! Vi os detalhes do " + p.nome + " (" + p.tam + ") no catálogo e quero saber como encomendar.";
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
