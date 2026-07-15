/* Tobias Franzl – kleine Interaktionen (kein Framework nötig) */
(function () {
  "use strict";

  /* Jahr im Footer */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* Sprachumschaltung */
  var translations = {
    de: {
      navContact: "Kontakt",
      heroLine1: "Industrierückbau",
      heroLine2: "Recyclinglösungen",
      contactHeading: "Kontakt",
      contactIntro: "Schreib mir eine Nachricht. Ich freue mich, von dir zu hören.",
      nameLabel: "Name",
      phoneLabel: "Telefonnummer",
      optionalLabel: "optional",
      phoneHint: "Mit Ländervorwahl, z. B. +43 664 1234567",
      emailLabel: "E-Mail",
      messageLabel: "Nachricht",
      sendButton: "Absenden",
      privacyLink: "Datenschutz",
      partnerHeading: "Partner",
      partnerIntro: "Diese Seite ist nicht mehr Teil der aktuellen Website.",
      partnerBody: "Die aktuelle Version der Website ist bewusst sehr knapp gehalten. Für Anfragen geht es direkt zur Startseite.",
      impressumHeading: "Impressum",
      impressumIntro: "Diese Seite ist nicht mehr Teil der aktuellen Website.",
      impressumBody: "Die aktuelle Version der Website ist bewusst sehr knapp gehalten. Für Anfragen geht es direkt zur Startseite.",
      backHome: "Zurück zur Startseite"
    },
    en: {
      navContact: "Contact",
      heroLine1: "Industrial deconstruction",
      heroLine2: "Recycling solutions",
      contactHeading: "Contact",
      contactIntro: "Send me a message. I would be happy to hear from you.",
      nameLabel: "Name",
      phoneLabel: "Phone number",
      optionalLabel: "optional",
      phoneHint: "With country code, e.g. +43 664 1234567",
      emailLabel: "E-mail",
      messageLabel: "Message",
      sendButton: "Send",
      privacyLink: "Privacy",
      partnerHeading: "Partner",
      partnerIntro: "This page is no longer part of the current website.",
      partnerBody: "The current version of the website is intentionally very minimal. For inquiries, please go directly to the homepage.",
      impressumHeading: "Imprint",
      impressumIntro: "This page is no longer part of the current website.",
      impressumBody: "The current version of the website is intentionally very minimal. For inquiries, please go directly to the homepage.",
      backHome: "Back to homepage"
    }
  };

  function applyLanguage(lang) {
    var currentLang = lang === "en" ? "en" : "de";

    document.querySelectorAll("[data-i18n]").forEach(function (element) {
      var key = element.getAttribute("data-i18n");
      if (translations[currentLang] && translations[currentLang][key]) {
        element.textContent = translations[currentLang][key];
      }
    });

    document.documentElement.lang = currentLang;

    document.querySelectorAll(".lang-toggle").forEach(function (button) {
      var isActive = button.getAttribute("data-lang-toggle") === currentLang;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  var initialLang = localStorage.getItem("site-lang") || "de";
  applyLanguage(initialLang);

  document.querySelectorAll(".lang-toggle").forEach(function (button) {
    button.addEventListener("click", function () {
      var selectedLang = button.getAttribute("data-lang-toggle") || "de";
      localStorage.setItem("site-lang", selectedLang);
      applyLanguage(selectedLang);
    });
  });

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
    Kein AJAX/fetch mehr, damit Netlify Forms + reCAPTCHA serverseitig sauber arbeiten.
    Dieses Script prüft nur VOR dem Absenden:
    - Pflichtfelder
    - Telefonnummer nur + und Zahlen
    - CAPTCHA bestätigt
  */

  var form = document.querySelector(".contact-form");
  var status = document.getElementById("formStatus");
  var phoneInput = document.getElementById("telefon");

  function setStatus(message, type) {
    if (!status) return;
    status.textContent = message;
    status.className = "form-status " + (type || "");
  }

  function cleanPhoneValue(value) {
    /*
      Erlaubt:
      + am Anfang
      Zahlen 0–9

      Beispiele gültig:
      +436601234567
      06601234567

      Nicht erlaubt:
      Buchstaben, Leerzeichen, Klammern, Bindestriche
    */
    var cleaned = value.replace(/[^0-9+]/g, "");

    if (cleaned.indexOf("+") > -1) {
      cleaned = cleaned.replace(/\+/g, "");
      cleaned = "+" + cleaned;
    }

    return cleaned;
  }

  function isPhoneValid(value) {
    if (!value) return true; // Telefonnummer ist optional
    return /^\+?[0-9]+$/.test(value);
  }

  function getCaptchaResponse() {
    var responseField = document.querySelector('textarea[name="g-recaptcha-response"]');

    if (responseField && responseField.value.trim().length > 0) {
      return responseField.value.trim();
    }

    if (window.grecaptcha && typeof window.grecaptcha.getResponse === "function") {
      return window.grecaptcha.getResponse();
    }

    return "";
  }

  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      var cleaned = cleanPhoneValue(phoneInput.value);
      if (phoneInput.value !== cleaned) {
        phoneInput.value = cleaned;
      }
    });
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      setStatus("", "");

      if (phoneInput) {
        phoneInput.value = cleanPhoneValue(phoneInput.value.trim());

        if (!isPhoneValid(phoneInput.value)) {
          event.preventDefault();
          setStatus("Bitte gib bei der Telefonnummer nur Zahlen und optional ein + am Anfang ein.", "err");
          phoneInput.focus();
          return;
        }
      }

      if (!form.checkValidity()) {
        event.preventDefault();
        form.reportValidity();
        return;
      }

      var captchaResponse = getCaptchaResponse();

      if (!captchaResponse) {
        event.preventDefault();
        setStatus("Bitte bestätige zuerst das CAPTCHA.", "err");

        var captchaBox = document.querySelector('[data-netlify-recaptcha="true"]');
        if (captchaBox) {
          captchaBox.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }

        return;
      }

      setStatus("Wird gesendet …", "");
      /*
        Danach läuft der normale native Formular-Submit weiter.
        Netlify übernimmt die Verarbeitung.
      */
    });
  }

  /* Dropdown (accessible) for header menu */
  (function () {
    var menuBtn = document.getElementById('menuBtn');
    var mainMenu = document.getElementById('mainMenu');

    if (menuBtn && mainMenu) {
      menuBtn.addEventListener('click', function (e) {
        var expanded = menuBtn.getAttribute('aria-expanded') === 'true';
        menuBtn.setAttribute('aria-expanded', (!expanded).toString());
        mainMenu.hidden = expanded;
      });

      // close when clicking outside
      document.addEventListener('click', function (e) {
        if (!menuBtn.contains(e.target) && !mainMenu.contains(e.target)) {
          menuBtn.setAttribute('aria-expanded', 'false');
          mainMenu.hidden = true;
        }
      });

      // close on Escape
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          menuBtn.setAttribute('aria-expanded', 'false');
          mainMenu.hidden = true;
          menuBtn.focus();
        }
      });

      // Hover / focus behavior: blur other items while one is hovered/focused
      (function () {
        var items = Array.prototype.slice.call(mainMenu.querySelectorAll('a[role="menuitem"]'));

        if (!items.length) return;

        function clearHovered() {
          items.forEach(function (it) { it.classList.remove('hovered'); });
          mainMenu.classList.remove('focus');
        }

        items.forEach(function (item) {
          item.addEventListener('mouseenter', function () {
            mainMenu.classList.add('focus');
            items.forEach(function (it) { it.classList.remove('hovered'); });
            item.classList.add('hovered');
          });

          item.addEventListener('focus', function () {
            mainMenu.classList.add('focus');
            items.forEach(function (it) { it.classList.remove('hovered'); });
            item.classList.add('hovered');
          });

          item.addEventListener('mouseleave', function () {
            item.classList.remove('hovered');
            // if no item hovered/focused, clear
            setTimeout(function () {
              var any = mainMenu.querySelector('a.hovered');
              if (!any) clearHovered();
            }, 10);
          });

          item.addEventListener('blur', function () {
            item.classList.remove('hovered');
            setTimeout(function () {
              var any = mainMenu.querySelector('a.hovered');
              if (!any) clearHovered();
            }, 10);
          });
        });

        // when leaving the menu entirely, clear
        mainMenu.addEventListener('mouseleave', function () {
          clearHovered();
        });
      })();
    }
  })();
})();
