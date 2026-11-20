/* ============================================================
   OneClicq — main.js
   Behaviour only. The header and footer are plain HTML in every
   page (written by tools/build.js), so navigation works without JS.
   ============================================================ */
(function () {
  "use strict";

  var CONTACT = {
    phone: "+91-9667555188",
    phoneDisplay: "+91 96675 55188",
    whatsapp: "919667555188",
    email: "contact@oneclicq.com",
    hours: "Mon–Fri, 9:00–18:00 IST"
  };

  var inSub = /\/(services|solutions|case-studies|blog)\//.test(location.pathname);
  var P = inSub ? "../" : "";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Sticky nav ---- */
  function navScroll() {
    var navEl = document.getElementById("qNav");
    if (!navEl) return;
    var onScroll = function () { navEl.classList.toggle("scrolled", window.scrollY > 24); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---- Mobile menu ---- */
  function mobileMenu() {
    var burger = document.getElementById("qBurger");
    var mob = document.getElementById("qMobile");
    if (!burger || !mob) return;

    function setOpen(open) {
      mob.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open);
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      mob.setAttribute("aria-hidden", !open);
      burger.querySelector("i").className = open ? "bi bi-x-lg" : "bi bi-list";
      document.body.style.overflow = open ? "hidden" : "";
      document.body.classList.toggle("mobile-nav-open", open);
    }

    burger.addEventListener("click", function () { setOpen(!mob.classList.contains("open")); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mob.classList.contains("open")) { setOpen(false); burger.focus(); }
    });
    mob.querySelectorAll(".m-item > button.m-link").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var isOpen = btn.closest(".m-item").classList.toggle("open");
        btn.setAttribute("aria-expanded", isOpen);
      });
    });
    mob.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
  }

  /* ---- Reveal on scroll ---- */
  function reveal() {
    var revs = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || reduce) {
      revs.forEach(function (r) { r.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revs.forEach(function (r) { io.observe(r); });
  }

  /* ---- Count-up numbers (the real value is already in the HTML) ---- */
  function counters() {
    var els = document.querySelectorAll("[data-count]");
    if (!els.length || reduce || !("IntersectionObserver" in window)) return;
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        animateCount(e.target);
        cio.unobserve(e.target);
      });
    }, { threshold: 0.5 });
    els.forEach(function (c) { cio.observe(c); });
  }

  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1400, start = performance.now();
    function tick(now) {
      var p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---- "Talk to us" panel (replaces the old canned-reply chat bot) ----
     Every option here reaches a real person: phone, WhatsApp, email
     or the contact form. No promises about reply times we can't keep. */
  function contactWidget() {
    if (document.getElementById("talkWidget")) return;
    var wa = CONTACT.whatsapp
      ? '<a class="talk-opt" href="https://wa.me/' + CONTACT.whatsapp + '?text=' + encodeURIComponent("Hi OneClicq, I'd like to discuss a project.") + '" target="_blank" rel="noopener"><i class="bi bi-whatsapp" aria-hidden="true"></i><span><b>WhatsApp</b><small>Message our team</small></span></a>'
      : "";
    var html =
      '<div class="talk-widget" id="talkWidget">' +
      '<button type="button" class="talk-fab" id="talkFab" aria-label="Contact options" aria-expanded="false" aria-controls="talkPanel"><i class="bi bi-chat-dots-fill" aria-hidden="true"></i></button>' +
      '<div class="talk-panel" id="talkPanel" role="dialog" aria-labelledby="talkTitle" hidden>' +
      '<div class="talk-head"><div><p class="talk-title" id="talkTitle">Talk to OneClicq</p><small>' + CONTACT.hours + '</small></div>' +
      '<button type="button" class="talk-close" id="talkClose" aria-label="Close contact options"><i class="bi bi-x-lg" aria-hidden="true"></i></button></div>' +
      '<div class="talk-body">' +
      '<a class="talk-opt" href="tel:' + CONTACT.phone + '"><i class="bi bi-telephone" aria-hidden="true"></i><span><b>Call us</b><small>' + CONTACT.phoneDisplay + '</small></span></a>' +
      wa +
      '<a class="talk-opt" href="mailto:' + CONTACT.email + '"><i class="bi bi-envelope" aria-hidden="true"></i><span><b>Email</b><small>' + CONTACT.email + '</small></span></a>' +
      '<a class="talk-opt" href="' + P + 'contact.html"><i class="bi bi-pencil-square" aria-hidden="true"></i><span><b>Send a project enquiry</b><small>Use our contact form</small></span></a>' +
      '</div></div></div>' +
      '<button type="button" id="backToTopBtn" class="back-to-top-btn" aria-label="Back to top"><i class="bi bi-arrow-up" aria-hidden="true"></i></button>';
    document.body.insertAdjacentHTML("beforeend", html);

    var widget = document.getElementById("talkWidget");
    var fab = document.getElementById("talkFab");
    var panel = document.getElementById("talkPanel");
    var closeBtn = document.getElementById("talkClose");

    function setOpen(open) {
      widget.classList.toggle("open", open);
      fab.setAttribute("aria-expanded", open);
      panel.hidden = !open;
      fab.querySelector("i").className = open ? "bi bi-x-lg" : "bi bi-chat-dots-fill";
      if (open) panel.querySelector(".talk-opt").focus();
    }
    fab.addEventListener("click", function () { setOpen(panel.hidden); });
    closeBtn.addEventListener("click", function () { setOpen(false); fab.focus(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !panel.hidden) { setOpen(false); fab.focus(); }
    });
    document.addEventListener("click", function (e) {
      if (!panel.hidden && !widget.contains(e.target)) setOpen(false);
    });

    var top = document.getElementById("backToTopBtn");
    window.addEventListener("scroll", function () { top.classList.toggle("show", window.scrollY > 300); }, { passive: true });
    top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });
  }

  /* ---- AJAX form submit with a real success / error message ----
     Forms keep a normal action + method, so they also work without JS. */
  function ajaxForms() {
    document.querySelectorAll("form[data-ajax]").forEach(function (form) {
      var status = form.querySelector("[data-form-status]");
      var btn = form.querySelector('button[type="submit"]');
      var ts = form.querySelector('input[name="form_ts"]');
      if (ts) ts.value = String(Date.now());
      function show(msg, ok) {
        if (!status) return;
        status.hidden = false;
        status.className = "form-status " + (ok ? "is-ok" : "is-err");
        status.textContent = msg;
        status.focus();
      }
      form.addEventListener("submit", function (e) {
        if (!window.fetch || !window.FormData) return; // fall back to normal post
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }
        var file = form.querySelector('input[type="file"]');
        if (file && file.files[0]) {
          var max = parseInt(file.getAttribute("data-max-bytes") || "0", 10);
          if (max && file.files[0].size > max) { show("Your file is larger than " + Math.round(max / 1048576) + " MB. Please upload a smaller file.", false); return; }
        }
        var label = btn ? btn.innerHTML : "";
        if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
        fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
          .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
          .then(function (res) {
            if (res && res.ok) { form.reset(); show(res.message || "Thank you — your message has been sent.", true); }
            else show((res && res.message) || "Sorry, something went wrong. Please email " + CONTACT.email + " instead.", false);
          })
          .catch(function () { show("We couldn't send that — please check your connection, or email " + CONTACT.email + ".", false); })
          .then(function () { if (btn) { btn.disabled = false; btn.innerHTML = label; } });
      });
    });
  }

  /* ---- Pre-select the product on the contact form (?product=…) ---- */
  function prefill() {
    var m = location.search.match(/[?&](product|service)=([^&]+)/);
    var msg = document.getElementById("ms");
    if (m && msg && !msg.value) {
      var name = decodeURIComponent(m[2].replace(/\+/g, " ")).replace(/[^\w &.\-]/g, "").slice(0, 60);
      msg.value = "I'd like to discuss the " + name + " prototype for my business. ";
    }
  }

  /* ---- Home: services tabs (WAI-ARIA tabs pattern; panels stay readable without JS) ---- */
  function serviceTabs() {
    document.querySelectorAll("[data-svc]").forEach(function (root) {
      var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
      function select(tab, focus) {
        tabs.forEach(function (t) {
          var on = t === tab;
          t.classList.toggle("is-active", on);
          t.setAttribute("aria-selected", on ? "true" : "false");
          t.tabIndex = on ? 0 : -1;
          var panel = document.getElementById(t.getAttribute("aria-controls"));
          if (panel) panel.classList.toggle("is-active", on);
        });
        if (focus) tab.focus();
      }
      tabs.forEach(function (tab, i) {
        tab.addEventListener("click", function () { select(tab, false); });
        tab.addEventListener("keydown", function (e) {
          var next = null;
          if (e.key === "ArrowDown" || e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
          else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
          else if (e.key === "Home") next = tabs[0];
          else if (e.key === "End") next = tabs[tabs.length - 1];
          if (next) { e.preventDefault(); select(next, true); }
        });
      });
    });
  }

  /* ---- Legal pages: highlight the current section; contents list starts collapsed on small screens ---- */
  function legalToc() {
    var toc = document.querySelector(".legal-toc");
    if (!toc) return;
    // collapsed on small screens, always open on desktop (also when the window is resized)
    var small = window.matchMedia("(max-width: 991.98px)");
    var sync = function () { toc.open = !small.matches; };
    sync();
    if (small.addEventListener) small.addEventListener("change", sync); else if (small.addListener) small.addListener(sync);
    var links = Array.prototype.slice.call(toc.querySelectorAll('a[href^="#"]'));
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove("is-current"); a.removeAttribute("aria-current"); });
        var a = byId[e.target.id];
        if (a) { a.classList.add("is-current"); a.setAttribute("aria-current", "true"); }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    document.querySelectorAll(".legal-section[id]").forEach(function (s) { io.observe(s); });
  }

  function init() {
    legalToc();
    serviceTabs();
    navScroll();
    mobileMenu();
    reveal();
    counters();
    contactWidget();
    ajaxForms();
    prefill();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
