/* Tobias Franzl – kleine Interaktionen (kein Framework nötig) */
(function () {
  "use strict";

  /* Jahr im Footer */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

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
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-45% 0px -50% 0px",
        threshold: 0
      }
    );

    sections.forEach(function (section) {
      navObserver.observe(section);
    });

    /* Scroll-Reveal */
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12
      }
    );

    document.querySelectorAll(".reveal").forEach(function (element) {
      revealObserver.observe(element);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (element) {
      element.classList.add("in");
    });
  }

  /*
    Kontaktformular:

    Wichtig:
    Das Formular wird bewusst NICHT per JavaScript abgefangen.

    Warum?
    Netlify Forms + Netlify reCAPTCHA sollen den Submit serverseitig prüfen.
    Wenn JavaScript den Submit mit fetch() abfängt, kann die Seite eine
    Erfolgsmeldung anzeigen, obwohl das CAPTCHA nicht bestätigt wurde.

    Deshalb bleibt der normale/native Formular-Submit aktiv.
    Netlify übernimmt Verarbeitung, Spam-Schutz, Honeypot und reCAPTCHA.
  */
})();
