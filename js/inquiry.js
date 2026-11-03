/* Sends EL1Express inquiry forms through Web3Forms.
   The success panel is shown only after Web3Forms returns success: true. */
(function () {
  var CONFIG = window.EL1_FORM_CONFIG || {};
  var PLACEHOLDER = "YOUR_WEB3FORMS_ACCESS_KEY";
  var SUBJECT_SUFFIX = " - EL1Express website";

  var FORMS = {
    contactForm: {
      buttonId: "formSubmit",
      successId: "formSuccess",
      errorId: "contactFormError",
      successDisplay: "flex",
      hide: "fields",
      inquiryId: "finquiry",
      nameIds: ["fname"],
      contactIds: ["fphone", "femail"],
      contactMode: "any",
      missingWho: "Please enter your name and at least a phone number or email."
    },
    quoteForm: {
      buttonId: "qSubmit",
      successId: "formSuccess",
      errorId: "quoteFormError",
      successDisplay: "block",
      hide: "form",
      inquiryId: "qinquiry",
      nameIds: ["qname"],
      contactIds: ["qphone", "qemail"],
      contactMode: "any",
      missingWho: "Please enter your name and at least a phone number or email."
    },
    applyForm: {
      buttonId: "applySubmit",
      successId: "applySuccess",
      errorId: "applyFormError",
      successDisplay: "block",
      hide: "form",
      inquiryId: "dinquiry",
      nameIds: ["fname"],
      contactIds: ["fphone"],
      contactMode: "all",
      missingWho: "Please enter your name and phone number."
    },
    cateringForm: {
      buttonId: "ce_submit",
      successId: "cateringSuccess",
      errorId: "cateringFormError",
      successDisplay: "block",
      hide: "form",
      inquiryId: "ce_inquiry",
      nameIds: ["ce_name"],
      contactIds: ["ce_phone"],
      contactMode: "all",
      missingWho: "Please enter your name and phone number."
    }
  };

  function val(id) {
    var el = document.getElementById(id);
    return el ? String(el.value || "").trim() : "";
  }

  function showError(cfg, message) {
    var el = document.getElementById(cfg.errorId);
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
  }

  function clearError(cfg) {
    var el = document.getElementById(cfg.errorId);
    if (!el) return;
    el.textContent = "";
    el.hidden = true;
  }

  function collect(form) {
    var data = {};
    form.querySelectorAll("input, select, textarea").forEach(function (el) {
      if (!el.name || el.type === "checkbox" || el.type === "button" || el.type === "submit") return;
      data[el.name] = String(el.value || "").trim();
    });
    return data;
  }

  function fromName(cfg) {
    return cfg.nameIds.map(val).filter(Boolean).join(" ");
  }

  function showSuccess(form, cfg) {
    var success = document.getElementById(cfg.successId);
    if (cfg.hide === "form") {
      form.hidden = false;
      form.style.display = "none";
    } else {
      form.querySelectorAll(".form-row, .el1-form-error, .form-submit").forEach(function (el) {
        el.style.display = "none";
      });
    }
    if (success) {
      success.hidden = false;
      success.style.display = cfg.successDisplay;
    }
  }

  function setBusy(btn, busy) {
    var label = btn.querySelector(".form-submit-text") || btn;
    if (busy) {
      if (!btn.dataset.el1Label) btn.dataset.el1Label = label.textContent;
      label.textContent = "Sending…";
      btn.disabled = true;
      btn.setAttribute("aria-busy", "true");
    } else {
      if (btn.dataset.el1Label) label.textContent = btn.dataset.el1Label;
      btn.disabled = false;
      btn.removeAttribute("aria-busy");
    }
  }

  async function submitForm(form, cfg, btn) {
    clearError(cfg);
    var inquiry = val(cfg.inquiryId);
    var name = fromName(cfg);
    var contacts = cfg.contactIds.map(val);
    var hasContact = cfg.contactMode === "all"
      ? contacts.every(Boolean)
      : contacts.some(Boolean);

    if (!inquiry) {
      showError(cfg, "Please select an inquiry type (Driver, Vendor, or Route).");
      return;
    }
    if (!name || !hasContact) {
      showError(cfg, cfg.missingWho);
      return;
    }

    var bot = form.querySelector('input[name="botcheck"]');
    if (bot && bot.checked) return;

    var key = String(CONFIG.accessKey || "").trim();
    if (!key || key === PLACEHOLDER) {
      console.error("EL1Express form: replace YOUR_WEB3FORMS_ACCESS_KEY in js/form-config.js. Mail is delivered to " + (CONFIG.to || "hamzah@elexpresss.org") + " once that key is active.");
      showError(cfg, "This form isn't set up to send yet. Please call or text Hamzah at (346) 668-6922.");
      return;
    }

    var fields = collect(form);
    var payload = Object.assign({}, fields, {
      access_key: key,
      subject: inquiry + SUBJECT_SUFFIX,
      from_name: name,
      inquiry_type: inquiry,
      page: window.location.href
    });
    if (payload.email) payload.replyto = payload.email;
    else delete payload.email;

    setBusy(btn, true);
    try {
      var response = await fetch(CONFIG.endpoint || "https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });
      var data = {};
      try { data = await response.json(); } catch (e) { data = {}; }
      if (response.ok && data && data.success === true) {
        clearError(cfg);
        showSuccess(form, cfg);
        return;
      }
      showError(cfg, "We couldn't send your inquiry. Please call or text Hamzah at (346) 668-6922.");
    } catch (err) {
      showError(cfg, "We couldn't send your inquiry. Please call or text Hamzah at (346) 668-6922.");
    } finally {
      if (btn.isConnected && btn.style.display !== "none" && form.style.display !== "none") setBusy(btn, false);
    }
  }

  function boot() {
    if (!document.getElementById("el1-form-error-style")) {
      var style = document.createElement("style");
      style.id = "el1-form-error-style";
      style.textContent = ".el1-form-error{margin:0 0 12px;padding:10px 12px;border-left:3px solid #F5A800;font-size:13px;line-height:1.5;color:inherit}.el1-form-error[hidden]{display:none !important}";
      document.head.appendChild(style);
    }

    Object.keys(FORMS).forEach(function (formId) {
      var form = document.getElementById(formId);
      var cfg = FORMS[formId];
      if (!form) return;
      var btn = document.getElementById(cfg.buttonId);
      if (!btn || btn.dataset.el1Bound === "1") return;
      btn.dataset.el1Bound = "1";
      btn.type = "button";
      btn.addEventListener("click", function () {
        submitForm(form, cfg, btn);
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
