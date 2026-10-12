/* Tineném Laços: funcionamento da página (catálogo, filtros, pedido pelo WhatsApp).
   Os dados (WhatsApp e produtos) ficam em js/dados.js. */

function linkPedido(msg) {
  return WHATSAPP ? "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg) : INSTAGRAM;
}

const grade = document.getElementById("grade");
grade.innerHTML = produtos.map((p, i) => `
  <article class="cartela" data-cat="${p.cat.join(" ")}${p.nomeBordado ? " nome" : ""}">
    <div class="foto">
      <img src="img/produtos/${p.img}" alt="${p.nome} ${p.tam}: ${p.desc}" loading="${i < 4 ? "eager" : "lazy"}">
      <span class="tam">${p.tam}</span>
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
const corEl = document.getElementById("cor"), obsEl = document.getElementById("obs");
const btnPedir = document.getElementById("pedir-personalizado");
const modelos = [...new Set(produtos.map(p => p.nome))].sort((a, b) => a.localeCompare(b, "pt-BR"));
modeloEl.innerHTML = ["Ainda não sei, quero ajuda", ...modelos].map(m => `<option>${m}</option>`).join("");

function montarPedido() {
  const linhas = ["Olá, Irlem! Quero encomendar um laço:", "• Modelo: " + modeloEl.value, "• Cor: " + corEl.value];
  if (nomeEl.value.trim()) linhas.push("• Nome bordado: " + nomeEl.value.trim());
  if (obsEl.value.trim()) linhas.push("• Detalhes: " + obsEl.value.trim());
  linhas.push("Pode me passar o valor?");
  const msg = linhas.join("\n");
  btnPedir.dataset.msg = msg;
  btnPedir.href = linkPedido(msg);
}
[nomeEl, modeloEl, corEl, obsEl].forEach(el => el.addEventListener("input", montarPedido));
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
