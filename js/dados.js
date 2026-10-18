/* ============================================================
   DADOS DO SITE: é aqui que você edita no dia a dia.
   - WhatsApp e Instagram da loja
   - Lista de produtos do catálogo (a ordem aqui é a ordem no site)
   Fotos ficam em img/produtos/ (formato .webp, 560 px de largura).
   ============================================================ */

/* ⚙️ Coloque aqui o WhatsApp da loja: 55 + DDD + número, só dígitos. Ex.: "5591987654321".
   Enquanto estiver vazio, os botões levam ao Instagram. */
const WHATSAPP = "5591985663741";
const INSTAGRAM = "https://www.instagram.com/tinenemlacos/";

/* Cada produto:
   nome         nome do modelo (também aparece na lista "Modelo" do formulário)
   tam          tamanho mostrado na etiqueta da foto
   cat          "laco", "kit" (duplas e kits) ou "faixa" (faixas e tiaras); pode ter mais de um
   nomeBordado  (opcional) nome bordado que aparece no selinho rosa
   img          nome do arquivo dentro de img/produtos/
   preco        valor em reais, só o número (ex.: 32 ou 32.5). Sem preco, o cartão mostra "Consulte"
   desc         descrição curta */
const produtos = [
  { nome: "Laço Bela", tam: "TM M", cat: ["faixa"], nomeBordado: "Maria", img: "bela-m.webp", preco: 32,
    desc: "Faixinha lilás clara com buquê de rosas bordadas e uma abelhinha voando." },
  { nome: "Laço Aurora", tam: "TM GG", cat: ["faixa"], nomeBordado: "Helena", img: "aurora-gg.webp", preco: 45,
    desc: "Laço vermelho grande na faixa, com dois nomes bordados e rosinhas brancas." },
  { nome: "Laço Celina", tam: "Tam. único", cat: ["laco"], img: "celina.webp", preco: 38,
    desc: "Laço amplo em tecido claro com jardim de flores lilás e rosa bordado na ponta." },
  { nome: "Trio Agatha", tam: "TM P", cat: ["kit"], img: "agatha-trio.webp", preco: 68,
    desc: "Três laços em amarelo, coral e lilás, cada um com flores e detalhes diferentes." },
  { nome: "Laço Aurora", tam: "TM M", cat: ["laco"], nomeBordado: "Lívia", img: "aurora.webp", preco: 35,
    desc: "Azul serenata com borboletas e um coração em ponto corrido." },
  { nome: "Dupla Agatha", tam: "TM P", cat: ["kit"], nomeBordado: "Luiz", img: "agatha-dupla.webp", preco: 35,
    desc: "Par de laços nude com margaridas e o nome bordado em cada um." },
  { nome: "Laço Bela", tam: "TM P", cat: ["faixa"], nomeBordado: "Isadora", img: "bela-p.webp", preco: 28,
    desc: "Faixinha rosa com o nome bordado em dourado e rosas em tons de creme." },
  { nome: "Tiara Lisa", tam: "Tiara", cat: ["faixa"], img: "tiara-lisa.webp", preco: 38,
    desc: "Tiara pink com laço bordado: florzinha, cogumelo, borboleta e trilha pontilhada." },
  { nome: "Dupla Bela", tam: "TM P e G", cat: ["kit"], img: "bela-dupla-pg.webp", preco: 38,
    desc: "Laços rosa bebê com flores, cogumelinhos e borboletas bordados." },
  { nome: "Kit Sophia", tam: "TM M", cat: ["kit", "faixa"], img: "sophia-kit.webp", preco: 68,
    desc: "Quatro faixinhas em lilás, rosé, azul e areia. Para combinar com tudo." },
  { nome: "Dupla Laço Sophia", tam: "TM P", cat: ["kit"], img: "sophia-p.webp", preco: 38,
    desc: "Par de laços rosé clássicos, cada um com um pequeno coração bordado em branco." },
  { nome: "Dupla Bela", tam: "TM P", cat: ["kit"], img: "bela-dupla-p.webp", preco: 28,
    desc: "Par de laços off-white com rosinha laranja e folhas bordadas." },
];

/* ============================================================
   COLEÇÃO DE NATAL: "Do outro lado do guarda-roupa"
   ativo: true mostra a faixa no topo e a seção de Natal; false esconde tudo.
   prazo: último dia para pedir e receber antes do Natal (10 dias úteis de produção).
   Os produtos abaixo são IDEIAS com fotos provisórias: troque img, desc e
   preco quando a Irlem tiver os laços de Natal prontos e fotografados.
   ============================================================ */
const NATAL = {
  ativo: false,
  prazo: "08/12",
  /* vagas: quantos pedidos de Natal a Irlem ainda consegue fazer até o dia 24.
     Atualize sempre que ela fechar um pedido. 5 ou menos = "Últimas vagas!";
     0 = "esgotadas" (botões viram lista de espera); null = não mostra vagas.
     ⚠️ 15 é provisório: confirmar com a Irlem. */
  vagas: 15,
  /* vale-presente (cartão digital, enviado pelo WhatsApp): aparece na seção de Natal;
     depois do prazo vira o destaque da faixa. Confirmado com a Irlem em 18/10/2026.
     valores: em reais, com uma dica do que dá para escolher (alinhados aos preços do catálogo).
     validade: até quando a criança pode escolher o laço. */
  vale: {
    ativo: true,
    validade: "31/03",
    valores: [
      { valor: 28, dica: "um laço" },
      { valor: 38, dica: "laço especial ou dupla" },
      { valor: 68, dica: "um kit" },
    ],
  },
  produtos: [
    { nome: "Laço Poste de Luz", tam: "TM M", img: "aurora-gg.webp", provisoria: true,
      desc: "Vermelho com um poste de luz aceso e flocos de neve bordados." },
    { nome: "Laço Azevinho", tam: "TM P", img: "bela-dupla-p.webp", provisoria: true,
      desc: "Creme com galhinhos de azevinho e frutinhas vermelhas." },
    { nome: "Laço Bosque de Neve", tam: "Tam. único", img: "celina.webp", provisoria: true,
      desc: "Branco com pinheirinhos, estrela dourada e um passarinho de inverno." },
  ],
};
