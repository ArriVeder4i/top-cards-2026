const VERIFIED_DATE = "25 апреля 2026";

const bankLinks = {
  tbank: {
    referral: "https://tbank.ru/baf/5VUQwL4JWnQ",
    official: "https://www.tbank.ru/cards/debit-cards/tinkoff-black/"
  },
  alfabank: {
    referral: "https://alfa.me/Uv0Efl",
    official: "https://alfabank.ru/everyday/debit-cards/alfacard/"
  },
  vtb: {
    referral: "https://vtb.ru/l/k63b6tp8",
    official: "https://www.vtb.ru/personal/karty/debetovye/multikarta/"
  },
  ozon: {
    referral: "",
    official: "https://finance.ozon.ru/promo/cards",
    expiresAt: ""
  },
  otp: {
    referral: "https://r.otpbank.ru/cc/E3GPjG",
    official: "https://www.otpbank.ru/retail/cards/all-cards/"
  }
};

function getBankDestination(config) {
  if (!config) {
    return { href: "#", sponsored: false };
  }

  if (config.referral) {
    if (!config.expiresAt) {
      return { href: config.referral, sponsored: true };
    }

    const expiresAt = Date.parse(config.expiresAt);

    if (!Number.isNaN(expiresAt) && Date.now() < expiresAt) {
      return { href: config.referral, sponsored: true };
    }
  }

  return { href: config.official, sponsored: false };
}

document.querySelectorAll("[data-verified-date]").forEach((element) => {
  element.textContent = VERIFIED_DATE;
});

document.querySelectorAll("[data-bank]").forEach((link) => {
  const bankKey = link.dataset.bank;
  const config = bankLinks[bankKey];

  if (!config) {
    return;
  }

  const destination = getBankDestination(config);

  link.href = destination.href;
  link.target = "_blank";
  link.rel = destination.sponsored ? "nofollow sponsored noopener" : "noopener";
});

const revealItems = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
