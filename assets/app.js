/* ============================================================
   MASAI Café · Resto · Bar — Lógica del sitio (vanilla JS)
   Persistencia local (localStorage) + sección de administración.
   ============================================================ */
(function () {
  "use strict";

  const STORE_KEY = "masai_state_v1";
  const MAX_UPLOAD_MB = 5;

  /* ---------- Estado ---------- */
  function deepClone(o) { return JSON.parse(JSON.stringify(o)); }

  function defaultState() {
    const d = deepClone(window.MASAI_DEFAULTS);
    d.reservations = [];
    d.photos = window.MASAI_DEFAULTS.seedPhotos.map(function (src, i) {
      return { id: "seed-" + i, src: src, name: "", comment: "", status: "approved", createdAt: null, seed: true };
    });
    return d;
  }

  let state = defaultState();

  function saveState() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      toast("No se pudo guardar: el almacenamiento local está lleno.", "error");
      return false;
    }
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return;
      const s = JSON.parse(raw);
      const def = defaultState();
      state = {
        business: Object.assign({}, def.business, s.business || {}),
        menu: (s.menu && s.menu.length) ? s.menu : def.menu,
        promos: (s.promos && s.promos.length) ? s.promos : def.promos,
        cumples: (s.cumples && s.cumples.length) ? s.cumples : def.cumples,
        cumpleNote: s.cumpleNote || def.cumpleNote,
        events: s.events || [],
        reservations: s.reservations || [],
        photos: (s.photos && s.photos.length) ? s.photos : def.photos
      };
    } catch (e) {
      state = defaultState();
    }
  }

  /* ---------- Utilidades ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function fmtPrice(n) { return "$" + Number(n).toLocaleString("es-AR"); }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function waLink(text) {
    return "https://wa.me/" + state.business.phoneDigits + "?text=" + encodeURIComponent(text);
  }

  function fmtDate(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" }) +
      " " + d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
  }

  function uid() { return "id-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7); }

  let toastTimer = null;
  function toast(msg, type) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = msg;
    el.className = "toast show " + (type || "ok");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.className = "toast"; }, 4200);
  }

  function compressImage(file, maxDim, quality) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
          const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
          const w = Math.round(img.width * scale);
          const h = Math.round(img.height * scale);
          const canvas = document.createElement("canvas");
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /* ---------- Navegación ---------- */
  function initNav() {
    const burger = $("#burger");
    const nav = $("#site-nav");
    if (burger && nav) {
      burger.addEventListener("click", function () {
        const open = nav.classList.toggle("open");
        burger.setAttribute("aria-expanded", open ? "true" : "false");
      });
      $all("a", nav).forEach(function (a) {
        a.addEventListener("click", function () {
          nav.classList.remove("open");
          burger.setAttribute("aria-expanded", "false");
        });
      });
    }

    $all('a[data-scroll]').forEach(function (a) {
      a.addEventListener("click", function (ev) {
        const target = $(a.getAttribute("href"));
        if (target) {
          ev.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          if (history.replaceState) history.replaceState(null, "", a.getAttribute("href"));
        }
      });
    });
  }

  /* ---------- Tema claro / oscuro ---------- */
  function initTheme() {
    const toggle = $("#theme-toggle");
    if (!toggle) return;
    toggle.addEventListener("click", function () {
      const root = document.documentElement;
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("masai_theme", next); } catch (e) {}
    });
  }

  /* ---------- Header / footer de datos ---------- */
  function renderBusiness() {
    $all("[data-brand-name]").forEach(function (el) { el.textContent = state.business.name; });
    $all("[data-brand-full]").forEach(function (el) { el.textContent = state.business.fullName; });
    $all("[data-tagline]").forEach(function (el) { el.textContent = state.business.tagline; });
    $all("[data-phone]").forEach(function (el) { el.textContent = state.business.phone; });
    $all("[data-phone-href]").forEach(function (el) { el.href = "tel:+5493517439039"; });

    const hoursList = $("#hours-list");
    if (hoursList) {
      hoursList.innerHTML = state.business.hours.map(function (h) {
        return '<li><span class="h-days">' + esc(h.days) + '</span><span class="h-time">' + esc(h.time) + '</span></li>';
      }).join("");
    }
    $all("[data-zone]").forEach(function (el) { el.textContent = state.business.zone; });
    $all("[data-address]").forEach(function (el) { el.textContent = state.business.addressDisplay; });
  }

  /* ---------- Carta ---------- */
  let menuUI = { group: 0, cat: null };

  function renderMenu() {
    const wrap = $("#menu-content");
    if (!wrap) return;

    let html = "";
    state.menu.forEach(function (group, gi) {
      group.categories.forEach(function (cat) {
        html += '<section class="menu-category" data-group="' + gi + '" data-cat="' + esc(cat.id) + '">';
        html += '<h3 class="menu-cat-title">' + esc(cat.name) + '</h3>';
        if (cat.note) html += '<p class="menu-cat-note">' + esc(cat.note) + '</p>';
        html += '<ul class="menu-items">';
        cat.items.forEach(function (it) {
          html += '<li class="menu-item" data-search="' + esc((it.name + " " + (it.desc || "")).toLowerCase()) + '">';
          html += '<div class="mi-name">' + esc(it.name) + '</div>';
          if (it.desc) html += '<div class="mi-desc">' + esc(it.desc) + '</div>';
          html += '<div class="mi-price">' + fmtPrice(it.price) + '</div>';
          html += '</li>';
        });
        html += '</ul></section>';
      });
    });
    wrap.innerHTML = html;

    const tabs = $("#menu-group-tabs");
    if (tabs) {
      tabs.innerHTML = state.menu.map(function (g, i) {
        return '<button class="gtab' + (i === menuUI.group ? " active" : "") + '" data-group="' + i + '" role="tab">' + esc(g.group) + '</button>';
      }).join("");
    }
    renderMenuChips();
    applyMenu();
  }

  function renderMenuChips() {
    const chips = $("#menu-filters");
    if (!chips) return;
    const group = state.menu[menuUI.group];
    if (!menuUI.cat || !group.categories.some(function (c) { return c.id === menuUI.cat; })) {
      menuUI.cat = group.categories.length ? group.categories[0].id : null;
    }
    chips.innerHTML = group.categories.map(function (cat) {
      return '<button class="chip' + (cat.id === menuUI.cat ? " active" : "") + '" data-cat="' + esc(cat.id) + '">' + esc(cat.name) + '</button>';
    }).join("");
  }

  function applyMenu() {
    const q = $("#menu-search") ? $("#menu-search").value.toLowerCase().trim() : "";
    const activeGroup = menuUI.group;
    const activeCat = menuUI.cat;

    let anyVisible = false;
    $all(".menu-category").forEach(function (cat) {
      const inGroup = Number(cat.getAttribute("data-group")) === activeGroup;
      let hasItem = false;
      $all(".menu-item", cat).forEach(function (it) {
        const match = !q || it.getAttribute("data-search").indexOf(q) !== -1;
        it.style.display = match ? "" : "none";
        if (match) hasItem = true;
      });
      let visible;
      if (q) visible = inGroup && hasItem;
      else visible = inGroup && cat.getAttribute("data-cat") === activeCat;
      cat.style.display = visible ? "" : "none";
      if (visible) anyVisible = true;
    });

    const empty = $("#menu-empty");
    if (empty) empty.style.display = anyVisible ? "none" : "";
  }

  function initMenuControls() {
    const tabs = $("#menu-group-tabs");
    if (tabs) {
      tabs.addEventListener("click", function (ev) {
        const btn = ev.target.closest(".gtab");
        if (!btn) return;
        menuUI.group = Number(btn.getAttribute("data-group"));
        menuUI.cat = null;
        $all(".gtab", tabs).forEach(function (b) { b.classList.toggle("active", b === btn); });
        renderMenuChips();
        applyMenu();
      });
    }
    const chips = $("#menu-filters");
    if (chips) {
      chips.addEventListener("click", function (ev) {
        const btn = ev.target.closest(".chip");
        if (!btn) return;
        menuUI.cat = btn.getAttribute("data-cat");
        $all(".chip", chips).forEach(function (c) { c.classList.toggle("active", c === btn); });
        applyMenu();
      });
    }
    const search = $("#menu-search");
    if (search) {
      search.addEventListener("input", applyMenu);
    }
  }

  /* ---------- Promociones ---------- */
  function renderPromos() {
    const wrap = $("#promos-list");
    if (!wrap) return;
    wrap.innerHTML = state.promos.map(function (p) {
      let body = "";
      if (p.detail) body += '<p class="promo-detail">' + esc(p.detail) + '</p>';
      if (p.items && p.items.length) {
        body += '<ul class="promo-items">' + p.items.map(function (i) {
          return '<li><span>' + esc(i.name) + '</span><strong>' + fmtPrice(i.price) + '</strong></li>';
        }).join("") + '</ul>';
      } else if (p.price) {
        body += '<p class="promo-price">' + fmtPrice(p.price) + '</p>';
      }
      const meta = [];
      if (p.days) meta.push(esc(p.days));
      if (p.hours) meta.push(esc(p.hours));
      if (p.note) meta.push(esc(p.note));
      const metaHtml = meta.length ? '<p class="promo-meta">' + meta.join(" · ") + '</p>' : "";

      return '<article class="promo-card">' +
        '<h3 class="promo-title">' + esc(p.title) + '</h3>' +
        body + metaHtml +
        '</article>';
    }).join("");
  }

  /* ---------- Cumpleaños ---------- */
  function renderCumples() {
    const wrap = $("#cumple-cards");
    if (!wrap) return;
    wrap.innerHTML = state.cumples.map(function (c) {
      return '<article class="cumple-card">' +
        '<div class="cumple-head"><h3>' + esc(c.name) + '</h3>' +
        '<span class="cumple-people">' + esc(c.people) + ' personas</span></div>' +
        '<div class="cumple-price">' + fmtPrice(c.price) + '</div>' +
        '<ul class="cumple-includes">' + c.includes.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join("") + '</ul>' +
        '<p class="cumple-gift">' + esc(c.gift) + '</p>' +
        '<button class="btn btn-solid" data-open-cumple="' + esc(c.id) + '">Consultar disponibilidad</button>' +
        '</article>';
    }).join("");

    const note = $("#cumple-note");
    if (note) note.textContent = state.cumpleNote;

    const select = $("#cumple-paquete");
    if (select) {
      select.innerHTML = '<option value="">Elegí un paquete…</option>' + state.cumples.map(function (c) {
        return '<option value="' + esc(c.name) + '">' + esc(c.name) + ' (' + esc(c.people) + ' personas)</option>';
      }).join("");
    }
  }

  /* ---------- Fotos ---------- */
  function renderPhotos() {
    const grid = $("#gallery-grid");
    if (!grid) return;
    const approved = state.photos.filter(function (p) { return p.status === "approved"; });
    if (!approved.length) {
      grid.innerHTML = '<p class="empty">Todavía no hay fotos publicadas. ¡Subí la tuya!</p>';
      return;
    }
    grid.innerHTML = approved.map(function (p) {
      const label = p.name ? esc(p.name) : "";
      return '<figure class="gallery-item" data-src="' + esc(p.src) + '">' +
        '<img src="' + esc(p.src) + '" alt="' + (p.name ? esc("Foto de " + p.name) : "Foto de tu visita a MASAI") + '" loading="lazy">' +
        (label ? '<figcaption>' + label + '</figcaption>' : '') +
        '</figure>';
    }).join("");
  }

  function initLightbox() {
    const overlay = $("#lightbox");
    if (!overlay) return;
    const img = $("#lightbox-img");
    $("#gallery-grid").addEventListener("click", function (ev) {
      const item = ev.target.closest(".gallery-item");
      if (!item) return;
      img.src = item.getAttribute("data-src");
      overlay.classList.add("show");
      document.body.classList.add("no-scroll");
    });
    overlay.addEventListener("click", function () {
      overlay.classList.remove("show");
      document.body.classList.remove("no-scroll");
    });
  }

  function initPhotoUpload() {
    const form = $("#photo-form");
    if (!form) return;
    const input = $("#photo-file");
    const preview = $("#photo-preview");

    input.addEventListener("change", function () {
      const file = input.files[0];
      if (!file) return;
      const okTypes = ["image/jpeg", "image/png", "image/webp"];
      if (okTypes.indexOf(file.type) === -1) {
        toast("Formato no permitido. Usá JPG, PNG o WebP.", "error");
        input.value = "";
        return;
      }
      if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
        toast("La imagen supera los " + MAX_UPLOAD_MB + " MB.", "error");
        input.value = "";
        return;
      }
      if (preview) {
        preview.innerHTML = "";
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.alt = "Vista previa";
        preview.appendChild(img);
      }
    });

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      const file = input.files[0];
      const name = $("#photo-name").value.trim();
      const comment = $("#photo-comment").value.trim();
      const consent = $("#photo-consent").checked;

      if (!file) { toast("Elegí una foto para subir.", "error"); return; }
      if (!consent) { toast("Tenés que aceptar la publicación de la imagen.", "error"); return; }

      const btn = $("#photo-submit");
      btn.disabled = true;
      btn.textContent = "Procesando…";

      compressImage(file, 900, 0.8).then(function (dataUrl) {
        state.photos.push({ id: uid(), src: dataUrl, name: name, comment: comment, status: "pending", createdAt: new Date().toISOString(), seed: false });
        saveState();
        form.reset();
        if (preview) preview.innerHTML = "";
        btn.disabled = false;
        btn.textContent = "Subir foto";
        toast("¡Gracias! Tu foto quedó pendiente de aprobación.");
      }).catch(function () {
        btn.disabled = false;
        btn.textContent = "Subir foto";
        toast("No se pudo procesar la imagen.", "error");
      });
    });
  }

  /* ---------- Reservas ---------- */
  function initReservationForm() {
    const form = $("#reserva-form");
    if (!form) return;
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      const nombre = $("#r-nombre").value.trim();
      const telefono = $("#r-telefono").value.trim();
      const fecha = $("#r-fecha").value;
      const horario = $("#r-horario").value;
      const cantidad = $("#r-cantidad").value;
      const comentario = $("#r-comentario").value.trim();

      if (!nombre) { toast("Contanos tu nombre.", "error"); return; }
      if (!telefono) { toast("Dejá un teléfono para contactarte.", "error"); return; }
      if (!fecha) { toast("Elegí una fecha.", "error"); return; }
      if (!horario) { toast("Elegí un horario.", "error"); return; }
      if (!cantidad || Number(cantidad) < 1) { toast("Indicá la cantidad de personas.", "error"); return; }

      const res = {
        id: uid(), type: "mesa", nombre: nombre, telefono: telefono,
        fecha: fecha, horario: horario, cantidad: Number(cantidad),
        comentario: comentario, status: "pendiente", createdAt: new Date().toISOString()
      };
      state.reservations.push(res);
      saveState();

      showReservaConfirm(res);
      form.reset();
    });
  }

  function showReservaConfirm(res) {
    const box = $("#reserva-confirm");
    if (!box) return;
    const msg = "¡Hola! Quiero confirmar mi reserva en MASAI. Nombre: " + res.nombre +
      ". Fecha: " + res.fecha + " " + res.horario + ". Personas: " + res.cantidad +
      (res.comentario ? ". Comentario: " + res.comentario : "");
    box.innerHTML =
      '<div class="confirm-box">' +
      '<h4>¡Solicitud registrada!</h4>' +
      '<p>Tu reserva queda <strong>pendiente de confirmación</strong> por parte del local. No la damos por confirmada hasta que MASAI te responda.</p>' +
      '<div class="confirm-actions">' +
      '<a class="btn btn-wa" href="' + waLink(msg) + '" target="_blank" rel="noopener">Confirmar por WhatsApp</a>' +
      '<a class="btn btn-ghost" href="tel:+5493517439039">Llamar</a>' +
      '</div></div>';
    box.scrollIntoView({ behavior: "smooth", block: "center" });
    toast("Solicitud registrada. Queda pendiente de confirmación.");
  }

  function initCumpleForm() {
    const form = $("#cumple-form");
    if (!form) return;
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      const nombre = $("#c-nombre").value.trim();
      const telefono = $("#c-telefono").value.trim();
      const fecha = $("#c-fecha").value;
      const paquete = $("#cumple-paquete").value;
      const mensaje = $("#c-mensaje").value.trim();

      if (!nombre) { toast("Contanos tu nombre.", "error"); return; }
      if (!telefono) { toast("Dejá un teléfono para contactarte.", "error"); return; }
      if (!fecha) { toast("Elegí una fecha.", "error"); return; }
      if (!paquete) { toast("Elegí un paquete.", "error"); return; }

      const res = {
        id: uid(), type: "cumple", nombre: nombre, telefono: telefono,
        fecha: fecha, paquete: paquete, mensaje: mensaje,
        status: "pendiente", createdAt: new Date().toISOString()
      };
      state.reservations.push(res);
      saveState();

      const msg = "¡Hola! Quiero consultar disponibilidad para un cumpleaños en MASAI. " + paquete +
        ". Fecha: " + fecha + ". Nombre: " + nombre + (mensaje ? ". Mensaje: " + mensaje : "");
      const box = $("#cumple-confirm");
      if (box) {
        box.innerHTML =
          '<div class="confirm-box">' +
          '<h4>¡Consulta enviada!</h4>' +
          '<p>El salón <strong>no queda reservado</strong> hasta que MASAI confirme la disponibilidad.</p>' +
          '<div class="confirm-actions">' +
          '<a class="btn btn-wa" href="' + waLink(msg) + '" target="_blank" rel="noopener">Consultar por WhatsApp</a>' +
          '<a class="btn btn-ghost" href="tel:+5493517439039">Llamar</a>' +
          '</div></div>';
      }
      form.reset();
      toast("Consulta enviada. No queda confirmada hasta respuesta del local.");
    });

    $all("[data-open-cumple]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const id = btn.getAttribute("data-open-cumple");
        const sel = $("#cumple-paquete");
        const c = state.cumples.find(function (x) { return x.id === id; });
        if (sel && c) sel.value = c.name;
        $("#cumple-form").scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });
  }

  /* ---------- Eventos ---------- */
  function renderEvents() {
    const wrap = $("#events-list");
    if (!wrap) return;
    if (!state.events.length) {
      wrap.innerHTML = '<p class="empty">Todavía no hay eventos cargados. ¡Volvé pronto para enterarte de todo!</p>';
      return;
    }
    wrap.innerHTML = state.events.map(function (ev) {
      return '<article class="event-card">' +
        '<div class="event-date"><span class="ev-day">' + esc(ev.day || "") + '</span><span class="ev-hour">' + esc(ev.hour || "") + '</span></div>' +
        '<div class="event-body"><h3>' + esc(ev.title) + '</h3><p>' + esc(ev.desc) + '</p></div>' +
        '</article>';
    }).join("");
  }

  /* ============================================================
     ADMINISTRACIÓN
     ============================================================ */
  function showAdmin() {
    $("#admin").classList.add("show");
    document.body.classList.add("no-scroll");
    renderAdmin();
  }
  function hideAdmin() {
    $("#admin").classList.remove("show");
    document.body.classList.remove("no-scroll");
    if (history.replaceState) history.replaceState(null, "", "#");
  }

  function renderAdmin() {
    renderAdminReservations();
    renderAdminPhotos();
    renderAdminMenu();
    renderAdminBusiness();
  }

  function renderAdminReservations() {
    const wrap = $("#admin-reservas");
    if (!wrap) return;
    const list = state.reservations.slice().reverse();
    if (!list.length) {
      wrap.innerHTML = '<p class="empty">No hay solicitudes todavía.</p>';
      return;
    }
    wrap.innerHTML = list.map(function (r) {
      const tipo = r.type === "cumple" ? "Cumpleaños" : "Reserva de mesa";
      let det = "";
      if (r.type === "cumple") {
        det = '<p class="a-row"><strong>Paquete:</strong> ' + esc(r.paquete || "") + (r.mensaje ? ' — ' + esc(r.mensaje) : '') + '</p>';
      } else {
        det = '<p class="a-row"><strong>Fecha:</strong> ' + esc(r.fecha) + ' ' + esc(r.horario) + ' · <strong>' + esc(r.cantidad) + ' personas</strong>' +
          (r.comentario ? ' — ' + esc(r.comentario) : '') + '</p>';
      }
      return '<div class="admin-card" data-id="' + esc(r.id) + '">' +
        '<div class="admin-card-head"><span class="badge badge-' + esc(r.status) + '">' + esc(r.status) + '</span><span class="a-type">' + tipo + '</span></div>' +
        '<p class="a-row"><strong>' + esc(r.nombre) + '</strong> · <a href="tel:+5493517439039">' + esc(r.telefono) + '</a></p>' +
        det +
        '<p class="a-date">' + fmtDate(r.createdAt) + '</p>' +
        '<div class="admin-actions">' +
        (r.status !== "atendida" ? '<button class="btn btn-small" data-act="attend">Marcar atendida</button>' : '') +
        '<button class="btn btn-small btn-danger" data-act="delete">Eliminar</button>' +
        '</div></div>';
    }).join("");
  }

  function renderAdminPhotos() {
    const wrap = $("#admin-fotos");
    if (!wrap) return;
    const pending = state.photos.filter(function (p) { return p.status === "pending"; });
    const approved = state.photos.filter(function (p) { return p.status === "approved"; });

    let html = '<h4 class="admin-sub">Pendientes de aprobación (' + pending.length + ')</h4>';
    if (!pending.length) html += '<p class="empty">No hay fotos pendientes.</p>';
    html += pending.map(function (p) {
      return '<div class="admin-card admin-photo" data-id="' + esc(p.id) + '">' +
        '<img src="' + esc(p.src) + '" alt="Foto pendiente" class="a-thumb">' +
        '<div class="admin-card-body"><p class="a-row"><strong>' + esc(p.name || "Sin nombre") + '</strong>' + (p.comment ? ' — ' + esc(p.comment) : '') + '</p>' +
        '<p class="a-date">' + fmtDate(p.createdAt) + '</p>' +
        '<div class="admin-actions"><button class="btn btn-small" data-act="approve">Aprobar</button><button class="btn btn-small btn-danger" data-act="reject">Rechazar</button></div></div>' +
        '</div>';
    }).join("");

    html += '<h4 class="admin-sub">Publicadas (' + approved.length + ')</h4>';
    if (!approved.length) html += '<p class="empty">No hay fotos publicadas.</p>';
    html += approved.map(function (p) {
      return '<div class="admin-card admin-photo" data-id="' + esc(p.id) + '">' +
        '<img src="' + esc(p.src) + '" alt="Foto publicada" class="a-thumb">' +
        '<div class="admin-card-body"><p class="a-row">' + (p.seed ? '<em>Foto del local</em>' : '<strong>' + esc(p.name || "Sin nombre") + '</strong>') + '</p>' +
        '<div class="admin-actions"><button class="btn btn-small btn-danger" data-act="reject">Retirar</button></div></div>' +
        '</div>';
    }).join("");

    wrap.innerHTML = html;
  }

  function renderAdminMenu() {
    const wrap = $("#admin-menu");
    if (!wrap) return;
    let html = "";
    state.menu.forEach(function (group, gi) {
      html += '<h4 class="admin-sub">' + esc(group.group) + '</h4>';
      group.categories.forEach(function (cat, ci) {
        html += '<div class="admin-cat" data-g="' + gi + '" data-c="' + ci + '">';
        html += '<div class="admin-cat-head"><input type="text" class="a-cat-name" value="' + esc(cat.name) + '"></div>';
        html += '<div class="admin-items">';
        cat.items.forEach(function (it, ii) {
          html += '<div class="admin-item" data-i="' + ii + '">' +
            '<input type="text" class="a-name" value="' + esc(it.name) + '">' +
            '<input type="number" class="a-price" value="' + it.price + '" min="0" step="100">' +
            '<input type="text" class="a-desc" value="' + esc(it.desc || "") + '" placeholder="Descripción (opcional)">' +
            '<button class="btn btn-small btn-danger" data-act="del-item" title="Eliminar">✕</button>' +
            '</div>';
        }).join("");
        html += '</div>';
        html += '<button class="btn btn-small" data-act="add-item">+ Agregar producto</button>';
        html += '</div>';
      });
    });
    wrap.innerHTML = html;
  }

  function renderAdminBusiness() {
    const wrap = $("#admin-datos");
    if (!wrap) return;
    const b = state.business;
    let hours = b.hours.map(function (h) {
      return '<div class="admin-item a-hours"><input type="text" class="a-h-days" value="' + esc(h.days) + '"><input type="text" class="a-h-time" value="' + esc(h.time) + '"><button class="btn btn-small btn-danger" data-act="del-hour">✕</button></div>';
    }).join("");

    let events = state.events.map(function (ev, i) {
      return '<div class="admin-item a-event" data-i="' + i + '">' +
        '<input type="text" class="a-ev-title" value="' + esc(ev.title) + '" placeholder="Título">' +
        '<input type="text" class="a-ev-day" value="' + esc(ev.day || "") + '" placeholder="Fecha (ej. Sáb 15/11)">' +
        '<input type="text" class="a-ev-hour" value="' + esc(ev.hour || "") + '" placeholder="Hora">' +
        '<input type="text" class="a-ev-desc" value="' + esc(ev.desc || "") + '" placeholder="Descripción">' +
        '<button class="btn btn-small btn-danger" data-act="del-event">✕</button></div>';
    }).join("");

    wrap.innerHTML =
      '<h4 class="admin-sub">Datos del negocio</h4>' +
      '<label class="a-label">Nombre visible <input type="text" id="a-name" value="' + esc(b.name) + '"></label>' +
      '<label class="a-label">Nombre completo <input type="text" id="a-fullname" value="' + esc(b.fullName) + '"></label>' +
      '<label class="a-label">Frase de marca <input type="text" id="a-tagline" value="' + esc(b.tagline) + '"></label>' +
      '<label class="a-label">Teléfono <input type="text" id="a-phone" value="' + esc(b.phone) + '"></label>' +
      '<label class="a-label">Zona mostrada <input type="text" id="a-address" value="' + esc(b.addressDisplay) + '"></label>' +
      '<label class="a-label">Nota interna de dirección (discrepancia) <textarea id="a-address-note" rows="3">' + esc(b.addressNote) + '</textarea></label>' +
      '<div class="a-warning">⚠ Dirección pendiente de confirmación: <span id="a-address-note-preview">' + esc(b.addressNote) + '</span></div>' +
      '<h4 class="admin-sub">Horarios</h4>' +
      '<div id="a-hours">' + hours + '</div>' +
      '<button class="btn btn-small" data-act="add-hour">+ Agregar horario</button>' +
      '<h4 class="admin-sub">Eventos</h4>' +
      '<div id="a-events">' + (events || '<p class="empty">Sin eventos.</p>') + '</div>' +
      '<button class="btn btn-small" data-act="add-event">+ Agregar evento</button>' +
      '<div class="admin-save-row"><button class="btn btn-solid" data-act="save-business">Guardar datos</button></div>';
  }

  /* ---------- Delegación de eventos del admin ---------- */
  function initAdmin() {
    const panel = $("#admin");
    if (!panel) return;

    $("#admin-close").addEventListener("click", hideAdmin);

    $all("[data-admin-tab]").forEach(function (t) {
      t.addEventListener("click", function () {
        $all("[data-admin-tab]").forEach(function (x) { x.classList.remove("active"); });
        $all(".admin-pane").forEach(function (p) { p.classList.remove("active"); });
        t.classList.add("active");
        $("#admin-" + t.getAttribute("data-admin-tab")).classList.add("active");
      });
    });

    // Reservas
    $("#admin-reservas").addEventListener("click", function (ev) {
      const btn = ev.target.closest("[data-act]");
      if (!btn) return;
      const card = ev.target.closest(".admin-card");
      const id = card.getAttribute("data-id");
      const idx = state.reservations.findIndex(function (r) { return r.id === id; });
      if (idx === -1) return;
      if (btn.getAttribute("data-act") === "attend") { state.reservations[idx].status = "atendida"; }
      else if (btn.getAttribute("data-act") === "delete") { state.reservations.splice(idx, 1); }
      saveState();
      renderAdminReservations();
    });

    // Fotos
    $("#admin-fotos").addEventListener("click", function (ev) {
      const btn = ev.target.closest("[data-act]");
      if (!btn) return;
      const card = ev.target.closest(".admin-card");
      const id = card.getAttribute("data-id");
      const idx = state.photos.findIndex(function (p) { return p.id === id; });
      if (idx === -1) return;
      const act = btn.getAttribute("data-act");
      if (act === "approve") { state.photos[idx].status = "approved"; }
      else if (act === "reject") { state.photos.splice(idx, 1); }
      saveState();
      renderAdminPhotos();
      renderPhotos();
    });

    // Menú
    $("#admin-menu").addEventListener("click", function (ev) {
      const btn = ev.target.closest("[data-act]");
      if (!btn) return;
      const cat = ev.target.closest(".admin-cat");
      const gi = Number(cat.getAttribute("data-g"));
      const ci = Number(cat.getAttribute("data-c"));
      const catData = state.menu[gi].categories[ci];
      if (btn.getAttribute("data-act") === "add-item") {
        catData.items.push({ name: "Nuevo producto", price: 0, desc: "" });
      } else if (btn.getAttribute("data-act") === "del-item") {
        const item = ev.target.closest(".admin-item");
        const ii = Number(item.getAttribute("data-i"));
        catData.items.splice(ii, 1);
      }
      renderAdminMenu();
    });
    $("#admin-menu").addEventListener("input", function (ev) {
      const cat = ev.target.closest(".admin-cat");
      if (!cat) return;
      const gi = Number(cat.getAttribute("data-g"));
      const ci = Number(cat.getAttribute("data-c"));
      const catData = state.menu[gi].categories[ci];
      if (ev.target.classList.contains("a-cat-name")) {
        catData.name = ev.target.value;
        return;
      }
      const item = ev.target.closest(".admin-item");
      if (!item) return;
      const ii = Number(item.getAttribute("data-i"));
      const it = catData.items[ii];
      if (ev.target.classList.contains("a-name")) it.name = ev.target.value;
      else if (ev.target.classList.contains("a-price")) it.price = Number(ev.target.value) || 0;
      else if (ev.target.classList.contains("a-desc")) it.desc = ev.target.value;
    });

    // Datos (lectura en vivo + guardado)
    const datos = $("#admin-datos");
    datos.addEventListener("input", function (ev) {
      const el = ev.target;
      const b = state.business;
      if (el.id === "a-name") b.name = el.value;
      else if (el.id === "a-fullname") b.fullName = el.value;
      else if (el.id === "a-tagline") b.tagline = el.value;
      else if (el.id === "a-phone") b.phone = el.value;
      else if (el.id === "a-address") b.addressDisplay = el.value;
      else if (el.id === "a-address-note") {
        b.addressNote = el.value;
        $("#a-address-note-preview").textContent = el.value;
      } else if (el.classList.contains("a-h-days") || el.classList.contains("a-h-time")) {
        syncHoursFromDom();
      } else if (el.classList.contains("a-ev-title") || el.classList.contains("a-ev-day") || el.classList.contains("a-ev-hour") || el.classList.contains("a-ev-desc")) {
        syncEventsFromDom();
      }
    });

    datos.addEventListener("click", function (ev) {
      const btn = ev.target.closest("[data-act]");
      if (!btn) return;
      const act = btn.getAttribute("data-act");
      if (act === "add-hour") {
        state.business.hours.push({ days: "Nuevo", time: "00:00 – 00:00" });
        renderAdminBusiness();
      } else if (act === "del-hour") {
        syncHoursFromDom();
        const item = ev.target.closest(".admin-item");
        const idx = $all("#a-hours .admin-item").indexOf(item);
        if (idx !== -1) state.business.hours.splice(idx, 1);
        renderAdminBusiness();
      } else if (act === "add-event") {
        state.events.push({ title: "Nuevo evento", day: "", hour: "", desc: "" });
        renderAdminBusiness();
      } else if (act === "del-event") {
        syncEventsFromDom();
        const item = ev.target.closest(".admin-item");
        const idx = $all("#a-events .admin-item").indexOf(item);
        if (idx !== -1) state.events.splice(idx, 1);
        renderAdminBusiness();
      } else if (act === "save-business") {
        syncHoursFromDom();
        syncEventsFromDom();
        saveState();
        renderBusiness();
        renderEvents();
        toast("Datos guardados.");
      }
    });

    function syncHoursFromDom() {
      const items = $all("#a-hours .admin-item");
      state.business.hours = items.map(function (it) {
        return { days: $(".a-h-days", it).value, time: $(".a-h-time", it).value };
      });
    }
    function syncEventsFromDom() {
      const items = $all("#a-events .admin-item");
      state.events = items.map(function (it) {
        return { title: $(".a-ev-title", it).value, day: $(".a-ev-day", it).value, hour: $(".a-ev-hour", it).value, desc: $(".a-ev-desc", it).value };
      });
    }

    // Botón "Guardar carta"
    $("#admin-save-menu").addEventListener("click", function () {
      saveState();
      renderMenu();
      toast("Carta guardada.");
    });
  }

  /* ---------- Rutas por hash ---------- */
  function handleHash() {
    const h = location.hash;
    if (h === "#admin") { showAdmin(); }
  }

  /* ---------- Init ---------- */
  function init() {
    loadState();
    renderBusiness();
    initNav();
    initTheme();
    renderMenu();
    initMenuControls();
    renderPromos();
    renderCumples();
    renderPhotos();
    initLightbox();
    initPhotoUpload();
    initReservationForm();
    initCumpleForm();
    renderEvents();
    initAdmin();

    window.addEventListener("hashchange", handleHash);
    handleHash();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
