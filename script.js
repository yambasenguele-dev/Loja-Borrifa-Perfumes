// CONFIG SUPABASE
const SUPABASE_URL = "https://zghlywrgykhypttyripv.supabase.co";
const SUPABASE_KEY = "sb_publishable_B6fAbPQTmh2YfcrneDOMNw_3M1cu7o8";
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// SLIDER HERO CROSSFADE DE CORES
function iniciarSliderHero() {
  const slides = document.querySelectorAll(".slide-fundo");
  if (slides.length === 0) return;
  let indiceAtual = 0;

  setInterval(() => {
    slides[indiceAtual].classList.remove("ativo");
    indiceAtual = (indiceAtual + 1) % slides.length;
    slides[indiceAtual].classList.add("ativo");
  }, 5000); // Transição muito lenta a cada 5 segundos
}

// BUSCAR PRODUTOS E RENDERIZAR FILTROS
async function carregarProdutos(filtro = "todos") {
  const grelha = document.getElementById("grelhaFragrancias");
  grelha.innerHTML = '<div class="loader">A carregar fragrâncias...</div>';

  let query = db.from("produtos").select("*");
  if (filtro !== "todos") query = query.eq("familia", filtro);

  const { data: produtos, error } = await query.order("criado_em", {
    ascending: false,
  });

  if (error) {
    grelha.innerHTML =
      '<div class="loader">Erro ao carregar produtos. Verifique a ligação ao Supabase.</div>';
    return;
  }

  if (!produtos || produtos.length === 0) {
    grelha.innerHTML =
      '<div class="loader">Nenhum produto cadastrado ainda. Adicione produtos no painel admin.</div>';
    return;
  }

  grelha.innerHTML = "";
  produtos.forEach((produto) => {
    const cartao = document.createElement("article");
    cartao.className = "cartao-fragrancia revelar";
    const imagemSrc =
      produto.imagem_url ||
      "https://via.placeholder.com/400x400?text=Borrifa+Perfumes";
    cartao.innerHTML = `
            <img src="${imagemSrc}" alt="${produto.nome}" class="imagem-produto">
            <div class="informacao-produto">
                <h3 class="nome-produto">${produto.nome}</h3>
                <p class="descricao-sensorial">${produto.descricao || ""}</p>
                <div class="detalhes-produto">
                    <span class="tamanho-produto">${produto.tamanho || ""}</span>
                    <span class="preco-produto">${produto.preco || ""}</span>
                </div>
                <a href="https://wa.me/244943091218?text=Olá!%20Gostaria%20de%20pedir%20o%20perfume%20${encodeURIComponent(produto.nome)}." target="_blank" rel="noopener" class="botao-pedir">Pedir no WhatsApp</a>
            </div>
        `;
    grelha.appendChild(cartao);
  });

  observarRevelacao();
}

// GERAR BOTÕES DE FILTRO DINAMICAMENTE
async function gerarFiltros() {
  const { data: produtos, error } = await db.from("produtos").select("familia");
  if (error || !produtos) return;

  const familias = [
    "todos",
    ...new Set(produtos.map((p) => p.familia.toLowerCase())),
  ];
  const container = document.getElementById("filtrosCatalogo");
  container.innerHTML = "";

  familias.forEach((familia) => {
    const btn = document.createElement("button");
    btn.className = "filtro-botao" + (familia === "todos" ? " ativo" : "");
    btn.dataset.familia = familia;
    btn.innerText = familia.charAt(0).toUpperCase() + familia.slice(1);
    btn.onclick = (e) => {
      document
        .querySelectorAll(".filtro-botao")
        .forEach((b) => b.classList.remove("ativo"));
      e.target.classList.add("ativo");
      carregarProdutos(familia);
    };
    container.appendChild(btn);
  });
}

// CARROSSEL DE AVALIAÇÕES
const listaAvaliacoes = [
  {
    nome: "Maria de Fátima",
    local: "Luanda",
    texto:
      "A fragrância durou o dia todo, entregaram super rápido! Qualidade premium.",
    estrelas: 5,
  },
  {
    nome: "João Bernardo",
    local: "Talatona",
    texto: "Atendimento incrível, ajudaram-me a escolher o perfume perfeito.",
    estrelas: 5,
  },
  {
    nome: "Patrícia Lopes",
    local: "Luanda",
    texto: "Cheiro divinal e embalagem impecável. Recomendo a Borrifa!",
    estrelas: 5,
  },
  {
    nome: "Carlos Eduardo",
    local: "Benfica",
    texto: "Profissionalismo do início ao fim. Os melhores de Luanda.",
    estrelas: 5,
  },
  {
    nome: "Ana Cristina",
    local: "Maianga",
    texto: "Os perfumes são originais e duram na pele. Nunca dececiona.",
    estrelas: 5,
  },
  {
    nome: "Miguel Santos",
    local: "Kilamba",
    texto: "Site elegante e produtos de alta qualidade. Entrega no mesmo dia.",
    estrelas: 4,
  },
  {
    nome: "Sofia Mateus",
    local: "Viana",
    texto: "Comprei o Oud Wood e superei as expectativas. Aroma sofisticado.",
    estrelas: 5,
  },
];

function renderizarAvaliacoes() {
  const track = document.getElementById("carrosselTrack");
  const avaliacoesDuplicadas = [...listaAvaliacoes, ...listaAvaliacoes];
  track.innerHTML = "";
  avaliacoesDuplicadas.forEach((aval) => {
    const iniciais = aval.nome
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2);
    const estrelasHtml =
      "★".repeat(aval.estrelas) + "☆".repeat(5 - aval.estrelas);
    const cartao = document.createElement("div");
    cartao.className = "cartao-avaliacao";
    cartao.innerHTML = `
            <div class="estrelas">${estrelasHtml}</div>
            <p class="texto-avaliacao">"${aval.texto}"</p>
            <div class="cliente-info">
                <div class="cliente-avatar">${iniciais}</div>
                <div>
                    <div class="cliente-nome">${aval.nome}</div>
                    <div class="cliente-local">${aval.local}, Angola</div>
                </div>
            </div>
        `;
    track.appendChild(cartao);
  });
}

// CABEÇALHO E BARRA DE PROGRESSO
window.addEventListener("scroll", () => {
  document
    .getElementById("cabecalho")
    .classList.toggle("ativo", window.scrollY > 50);
  const alturaTotal =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  document.getElementById("barraProgresso").style.width =
    (window.scrollY / alturaTotal) * 100 + "%";
});

// MENU MOBILE OTIMIZADO
const botaoMenu = document.getElementById("botaoMenuMobile");
const menuOverlay = document.getElementById("menuMobileOverlay");
const botaoFechar = document.getElementById("botaoFecharMenu");

function abrirMenu() {
  botaoMenu.classList.add("ativo");
  menuOverlay.classList.add("ativo");
}
function fecharMenu() {
  botaoMenu.classList.remove("ativo");
  menuOverlay.classList.remove("ativo");
}

botaoMenu.addEventListener("click", () => {
  if (menuOverlay.classList.contains("ativo")) {
    fecharMenu();
  } else {
    abrirMenu();
  }
});
botaoFechar.addEventListener("click", fecharMenu);
document.querySelectorAll(".menu-mobile-overlay a").forEach((link) => {
  link.addEventListener("click", fecharMenu);
});

// SCROLL SUAVE
function rolarParaSecao(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

// ANIMAÇÃO DE REVELAÇÃO
function observarRevelacao() {
  const elementos = document.querySelectorAll(
    ".revelar, .revelar-esquerda, .revelar-direita",
  );
  const observador = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("ativo");
          observador.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  elementos.forEach((el) => observador.observe(el));
}

// INICIALIZAÇÃO
document.addEventListener("DOMContentLoaded", () => {
  iniciarSliderHero();
  gerarFiltros();
  carregarProdutos();
  renderizarAvaliacoes();
  observarRevelacao();
});
