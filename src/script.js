(() => {
  'use strict';

  const botaoMenu = document.getElementById('botao-menu');
  const menuLateral = document.getElementById('menu-lateral');
  const fundoMenu = document.getElementById('fundo-menu');

  const abrirMenu = () => {
    if (menuLateral) {
      menuLateral.classList.add('aberto');
      menuLateral.setAttribute('aria-hidden', 'false');
    }
    if (fundoMenu) {
      fundoMenu.classList.add('aberto');
      fundoMenu.setAttribute('aria-hidden', 'false');
    }
    if (botaoMenu) {
      botaoMenu.classList.add('ativo');
      botaoMenu.setAttribute('aria-expanded', 'true');
      botaoMenu.setAttribute('aria-label', 'Fechar menu');
    }
    document.body.style.overflow = 'hidden';
  };

  const fecharMenu = () => {
    if (menuLateral) {
      menuLateral.classList.remove('aberto');
      menuLateral.setAttribute('aria-hidden', 'true');
    }
    if (fundoMenu) {
      fundoMenu.classList.remove('aberto');
      fundoMenu.setAttribute('aria-hidden', 'true');
    }
    if (botaoMenu) {
      botaoMenu.classList.remove('ativo');
      botaoMenu.setAttribute('aria-expanded', 'false');
      botaoMenu.setAttribute('aria-label', 'Abrir menu');
    }
    document.body.style.overflow = '';
  };

  if (botaoMenu) {
    botaoMenu.addEventListener('click', () => {
      if (menuLateral && menuLateral.classList.contains('aberto')) fecharMenu();
      else abrirMenu();
    });
  }
  if (fundoMenu) fundoMenu.addEventListener('click', fecharMenu);

  document.querySelectorAll('.links-menu a').forEach((link) => {
    link.addEventListener('click', fecharMenu);
  });

  const videoInicio = document.querySelector('.video-inicio');
  if (videoInicio) {
    videoInicio.addEventListener('error', function () {
      this.style.display = 'none';
      const midiaInicio = document.querySelector('.midia-inicio');
      if (midiaInicio) {
        const fundo = document.createElement('div');
        fundo.style.cssText = 'position:absolute;inset:0;background:url(src/img/Ceu estrelado.png) center/cover no-repeat;';
        midiaInicio.insertBefore(fundo, videoInicio);
      }
    });
    if (videoInicio.readyState < 2) videoInicio.load();
  }

  const elementosRevelar = document.querySelectorAll('.revelar');
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) entrada.target.classList.add('visivel');
      });
    },
    { rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
  );

  elementosRevelar.forEach((el, indice) => {
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    el.style.transitionDelay = el.closest('.conteudo-inicio') ? `${indice * 0.1}s` : '0.2s';
    observador.observe(el);
  });

  (() => {
    const trilha = document.getElementById('trilha-galeria');
    const pontos = document.getElementById('pontos-galeria');
    const anterior = document.getElementById('galeria-anterior');
    const proxima = document.getElementById('galeria-proxima');
    if (!trilha || !pontos) return;

    const slides = trilha.querySelectorAll('.slide-galeria');
    const total = slides.length;
    if (total === 0) return;

    const conteiner = trilha.parentElement;
    const largura = () => conteiner.offsetWidth;
    let indiceAtual = 0;
    let inicioX = 0;
    let inicioDeslocamento = 0;
    let arrastando = false;

    const deslocamentoAtual = () => -indiceAtual * largura();
    const aplicar = (px) => {
      trilha.style.transform = `translate3d(${px}px, 0, 0)`;
    };
    const atualizarPontos = () => {
      pontos.querySelectorAll('button').forEach((botao, i) => {
        botao.classList.toggle('ativo', i === indiceAtual);
      });
    };
    const irPara = (indice) => {
      indiceAtual = Math.max(0, Math.min(indice, total - 1));
      aplicar(deslocamentoAtual());
      atualizarPontos();
    };

    for (let i = 0; i < total; i += 1) {
      const botao = document.createElement('button');
      botao.type = 'button';
      botao.setAttribute('aria-label', `Ir para foto ${i + 1}`);
      botao.addEventListener('click', () => irPara(i));
      pontos.appendChild(botao);
    }
    atualizarPontos();

    if (anterior) anterior.addEventListener('click', () => irPara(indiceAtual - 1));
    if (proxima) proxima.addEventListener('click', () => irPara(indiceAtual + 1));

    const aoPressionar = (e) => {
      arrastando = true;
      trilha.setAttribute('data-movido', '0');
      inicioX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      inicioDeslocamento = deslocamentoAtual();
      trilha.classList.add('arrastando');
    };
    const aoMover = (e) => {
      if (!arrastando) return;
      const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      const diferenca = x - inicioX;
      if (Math.abs(diferenca) > 8) trilha.setAttribute('data-movido', '1');
      const maximo = 0;
      const minimo = -(total - 1) * largura();
      const proximo = Math.max(minimo, Math.min(maximo, inicioDeslocamento + diferenca));
      aplicar(proximo);
    };
    const aoSoltar = (e) => {
      if (!arrastando) return;
      trilha.classList.remove('arrastando');
      arrastando = false;
      const fimX = e && e.type.includes('touch') && e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : e.clientX;
      const diferenca = fimX != null ? fimX - inicioX : 0;
      const indice = Math.round(-(inicioDeslocamento + diferenca) / largura());
      irPara(indice);
    };

    trilha.addEventListener('mousedown', aoPressionar);
    trilha.addEventListener('touchstart', aoPressionar, { passive: true });
    window.addEventListener('mousemove', aoMover);
    window.addEventListener('touchmove', aoMover, { passive: true });
    window.addEventListener('mouseup', aoSoltar);
    window.addEventListener('touchend', aoSoltar, { passive: true });
    window.addEventListener('resize', () => {
      if (!arrastando) aplicar(deslocamentoAtual());
    });
  })();

  const caixaLuz = document.getElementById('caixa-luz');
  const imagemCaixaLuz = caixaLuz && caixaLuz.querySelector('.imagem-caixa-luz');
  const fecharCaixaLuzBotao = caixaLuz && caixaLuz.querySelector('.fechar-caixa-luz');

  document.querySelectorAll('[data-luz]').forEach((link) => {
    link.addEventListener('click', function (e) {
      const trilha = document.getElementById('trilha-galeria');
      if (trilha && trilha.getAttribute('data-movido') === '1') {
        e.preventDefault();
        trilha.setAttribute('data-movido', '0');
        return;
      }
      e.preventDefault();
      const href = this.getAttribute('href');
      const alt = (this.querySelector('img') && this.querySelector('img').getAttribute('alt')) || '';
      if (caixaLuz && imagemCaixaLuz && href) {
        imagemCaixaLuz.src = href;
        imagemCaixaLuz.alt = alt;
        caixaLuz.classList.add('ativa');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const fecharCaixaLuz = () => {
    if (caixaLuz) {
      caixaLuz.classList.remove('ativa');
      document.body.style.overflow = '';
    }
  };

  if (fecharCaixaLuzBotao) fecharCaixaLuzBotao.addEventListener('click', fecharCaixaLuz);
  if (caixaLuz) {
    caixaLuz.addEventListener('click', (e) => {
      if (e.target === caixaLuz) fecharCaixaLuz();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fecharCaixaLuz();
  });

  const cabecalho = document.querySelector('.cabecalho');
  if (cabecalho) {
    window.addEventListener('scroll', () => {
      cabecalho.classList.toggle('rolado', window.scrollY > 50);
    });
  }

  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    const id = link.getAttribute('href');
    if (id === '#') return;
    link.addEventListener('click', (e) => {
      const alvo = document.querySelector(id);
      if (alvo) {
        e.preventDefault();
        alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
