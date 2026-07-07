/* Tobias Franzl – kleine Interaktionen (kein Framework nötig) */
(function () {
  "use strict";

  /* Jahr im Footer */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Aktiver Navigationslink beim Scrollen */
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".nav a");

  function setActive(id) {
    navLinks.forEach(function (a) {
      a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
    });
  }

  if ("IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { navObserver.observe(s); });

    /* Scroll-Reveal */
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("in");
    });
  }

  /* Formular: freundliche Rückmeldung.
     - Auf Netlify wird das Formular serverseitig verarbeitet.
     - Diese AJAX-Variante zeigt eine Bestätigung ohne Seitenwechsel und
       funktioniert auf Netlify. Auf anderen Hosts (z. B. GitHub Pages ohne
       Formular-Backend) greift automatisch der E-Mail-Hinweis. */
  var form = document.querySelector(".contact-form");
  var status = document.getElementById("formStatus");

  function encode(data) {
    return Object.keys(data)
      .map(function (k) {
        return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
      })
      .join("&");
  }

  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });

      status.textContent = "Wird gesendet …";
      status.className = "form-status";

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode(data)
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            status.textContent = "Danke! Deine Nachricht wurde gesendet.";
            status.className = "form-status ok";
          } else {
            throw new Error("bad response");
          }
        })
        .catch(function () {
          /* Fallback: E-Mail-Programm öffnen (funktioniert überall) */
          var subject = encodeURIComponent("Nachricht über tobiasfranzl.com");
          var body = encodeURIComponent(
            "Name: " + (data.name || "") + "\n" +
            "E-Mail: " + (data.email || "") + "\n\n" +
            (data.nachricht || "")
          );
          status.innerHTML =
            'Der Versand ist auf diesem Host nicht aktiv. ' +
            '<a href="mailto:hello@tobiasfranzl.com?subject=' + subject +
            '&body=' + body + '" style="border-bottom:1.5px solid currentColor">' +
            'Hier per E-Mail senden</a>.';
          status.className = "form-status err";
        });
    });
  }
})();
