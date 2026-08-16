/**
 * HOLA MUNDO — Aplicación moderna con efectos parallax y animaciones
 * -------------------------------------------------------------------
 * Todo el código (HTML inyectado, CSS y JS) vive en este único archivo.
 * Uso: incluir en una página vacía con:
 *   <script src="hola-mundo.js"></script>
 * El script construye el DOM, inyecta los estilos y arranca las animaciones.
 */

(function () {
  "use strict";

  /* ============================================================
   * 1. ESTILOS (CSS inyectado dinámicamente)
   * ============================================================ */
  const css = `
    :root {
      --bg-1: #0f0c29;
      --bg-2: #302b63;
      --bg-3: #24243e;
      --accent: #00e5ff;
      --accent-2: #ff2ee0;
      --text: #f5f5ff;
    }

    * { box-sizing: border-box; }

    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
      overflow-x: hidden;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      background: linear-gradient(135deg, var(--bg-1), var(--bg-2), var(--bg-3));
      background-size: 400% 400%;
      animation: gradientShift 18s ease infinite;
      color: var(--text);
    }

    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    #hm-container {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    /* Capas de parallax (círculos flotantes de fondo) */
    .hm-layer {
      position: absolute;
      inset: 0;
      pointer-events: none;
      will-change: transform;
    }

    .hm-shape {
      position: absolute;
      border-radius: 50%;
      filter: blur(2px);
      opacity: 0.55;
    }

    /* Tarjeta central */
    .hm-card {
      position: relative;
      z-index: 10;
      text-align: center;
      padding: 3rem 4rem;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 24px;
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.45);
      transform-style: preserve-3d;
      transition: transform 0.15s ease-out;
      animation: cardEntrance 1.2s cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    @keyframes cardEntrance {
      0%   { opacity: 0; transform: translateY(60px) scale(0.85) rotateX(15deg); }
      100% { opacity: 1; transform: translateY(0) scale(1) rotateX(0deg); }
    }

    .hm-title {
      margin: 0;
      font-size: clamp(2.2rem, 6vw, 4.5rem);
      font-weight: 800;
      letter-spacing: -0.02em;
      background: linear-gradient(90deg, var(--accent), var(--accent-2), var(--accent));
      background-size: 200% auto;
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      animation: shine 4s linear infinite;
    }

    @keyframes shine {
      to { background-position: 200% center; }
    }

    .hm-subtitle {
      margin-top: 0.75rem;
      font-size: clamp(1rem, 2vw, 1.3rem);
      opacity: 0;
      color: rgba(245, 245, 255, 0.75);
      animation: fadeUp 1s ease 0.8s forwards;
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(15px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .hm-btn {
      margin-top: 2rem;
      padding: 0.9rem 2.2rem;
      font-size: 1rem;
      font-weight: 600;
      color: var(--bg-1);
      background: linear-gradient(90deg, var(--accent), var(--accent-2));
      border: none;
      border-radius: 50px;
      cursor: pointer;
      opacity: 0;
      animation: fadeUp 1s ease 1.1s forwards;
      transition: transform 0.25s ease, box-shadow 0.25s ease;
      box-shadow: 0 8px 25px rgba(0, 229, 255, 0.25);
    }

    .hm-btn:hover {
      transform: translateY(-4px) scale(1.05);
      box-shadow: 0 14px 35px rgba(255, 46, 224, 0.35);
    }

    .hm-btn:active {
      transform: translateY(-1px) scale(0.98);
    }

    .hm-hint {
      position: absolute;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.85rem;
      opacity: 0.5;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      animation: pulse 2.5s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.35; }
      50% { opacity: 0.8; }
    }

    /* Efecto de partícula al hacer click */
    .hm-particle {
      position: fixed;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 999;
    }
  `;

  const styleTag = document.createElement("style");
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  /* ============================================================
   * 2. ESTRUCTURA HTML (inyectada vía JS)
   * ============================================================ */
  const container = document.createElement("div");
  container.id = "hm-container";

  // Capas de parallax con formas decorativas
  const layerConfigs = [
    { depth: 0.02, count: 3, colorFrom: "#00e5ff", colorTo: "#0a84ff" },
    { depth: 0.05, count: 4, colorFrom: "#ff2ee0", colorTo: "#7a00ff" },
    { depth: 0.09, count: 2, colorFrom: "#ffd200", colorTo: "#ff8c00" },
  ];

  const layers = [];

  layerConfigs.forEach((cfg, layerIndex) => {
    const layer = document.createElement("div");
    layer.className = "hm-layer";
    layer.dataset.depth = cfg.depth;

    for (let i = 0; i < cfg.count; i++) {
      const shape = document.createElement("div");
      shape.className = "hm-shape";
      const size = 60 + Math.random() * 160;
      shape.style.width = size + "px";
      shape.style.height = size + "px";
      shape.style.left = Math.random() * 100 + "%";
      shape.style.top = Math.random() * 100 + "%";
      shape.style.background = `radial-gradient(circle at 30% 30%, ${cfg.colorFrom}, ${cfg.colorTo})`;
      shape.style.animation = `floaty ${6 + Math.random() * 6}s ease-in-out ${Math.random() * 3}s infinite`;
      layer.appendChild(shape);
    }

    container.appendChild(layer);
    layers.push({ el: layer, depth: cfg.depth });
  });

  // Keyframe de flotación suave para las formas
  const floatKeyframes = document.createElement("style");
  floatKeyframes.textContent = `
    @keyframes floaty {
      0%, 100% { transform: translateY(0) translateX(0); }
      50% { transform: translateY(-30px) translateX(20px); }
    }
  `;
  document.head.appendChild(floatKeyframes);

  // Tarjeta central
  const card = document.createElement("div");
  card.className = "hm-card";
  card.id = "hm-card";

  const title = document.createElement("h1");
  title.className = "hm-title";
  title.textContent = "¡Hola, Mundo!";

  const subtitle = document.createElement("p");
  subtitle.className = "hm-subtitle";
  subtitle.textContent = "Una app moderna, animada y con efecto parallax — todo en un solo archivo JS.";

  const button = document.createElement("button");
  button.className = "hm-btn";
  button.textContent = "Haz clic aquí ✨";

  card.appendChild(title);
  card.appendChild(subtitle);
  card.appendChild(button);
  container.appendChild(card);

  const hint = document.createElement("div");
  hint.className = "hm-hint";
  hint.textContent = "Mueve el mouse para explorar el parallax";
  container.appendChild(hint);

  document.body.appendChild(container);

  /* ============================================================
   * 3. INTERACTIVIDAD: Parallax con mouse + tilt de tarjeta
   * ============================================================ */
  window.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;

    layers.forEach(({ el, depth }) => {
      const moveX = x * depth * 1000;
      const moveY = y * depth * 1000;
      el.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    // Tilt 3D sutil en la tarjeta
    const rotateX = (-y * 10).toFixed(2);
    const rotateY = (x * 10).toFixed(2);
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  window.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0) rotateY(0)";
  });

  /* Parallax también con scroll, por si el contenido crece */
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    layers.forEach(({ el, depth }) => {
      el.style.transform += ` translateY(${scrollY * depth}px)`;
    });
  });

  /* ============================================================
   * 4. EFECTO DE PARTÍCULAS AL HACER CLIC EN EL BOTÓN
   * ============================================================ */
  const colors = ["#00e5ff", "#ff2ee0", "#ffd200", "#7a00ff"];

  function spawnParticles(x, y) {
    const particleCount = 18;
    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement("div");
      p.className = "hm-particle";
      p.style.left = x + "px";
      p.style.top = y + "px";
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      document.body.appendChild(p);

      const angle = Math.random() * Math.PI * 2;
      const distance = 60 + Math.random() * 120;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;
      const duration = 600 + Math.random() * 500;

      p.animate(
        [
          { transform: "translate(0, 0) scale(1)", opacity: 1 },
          { transform: `translate(${dx}px, ${dy}px) scale(0)`, opacity: 0 },
        ],
        {
          duration,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        }
      ).onfinish = () => p.remove();
    }
  }

  button.addEventListener("click", (e) => {
    spawnParticles(e.clientX, e.clientY);

    // Pequeño "pulso" en el título al hacer clic
    title.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.08)" },
        { transform: "scale(1)" },
      ],
      { duration: 400, easing: "ease-out" }
    );

    // Cambia el mensaje de saludo de forma aleatoria
    const greetings = [
      "¡Hola, Mundo!",
      "¡Hello, World!",
      "¡Bonjour, Monde!",
      "¡Ciao, Mondo!",
      "¡Olá, Mundo!",
      "こんにちは、世界！",
    ];
    const current = greetings.indexOf(title.textContent);
    let next;
    do {
      next = greetings[Math.floor(Math.random() * greetings.length)];
    } while (next === greetings[current]);
    title.textContent = next;
  });

  /* ============================================================
   * 5. Ajuste responsivo simple para pantallas pequeñas
   * ============================================================ */
  function adjustForScreen() {
    if (window.innerWidth < 480) {
      card.style.padding = "2rem 1.5rem";
    } else {
      card.style.padding = "3rem 4rem";
    }
  }
  adjustForScreen();
  window.addEventListener("resize", adjustForScreen);
})();