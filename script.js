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
})();
