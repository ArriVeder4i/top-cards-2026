const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const siteName = "Cashback Select";
const siteUrl = "https://topdebitcard.ru";
const verifiedDate = "28 апреля 2026";

const bankLinks = {
  tbank: {
    href: "https://tbank.ru/baf/5VUQwL4JWnQ",
    rel: "nofollow sponsored noopener"
  },
  alfabank: {
    href: "https://alfa.me/Uv0Efl",
    rel: "nofollow sponsored noopener"
  },
  vtb: {
    href: "https://vtb.ru/l/k63b6tp8",
    rel: "nofollow sponsored noopener"
  },
  ozon: {
    href: "https://finance.ozon.ru/promo/cards",
    rel: "noopener"
  },
  otp: {
    href: "https://r.otpbank.ru/cc/E3GPjG",
    rel: "nofollow sponsored noopener"
  }
};

function bankButton(bank, label, className = "button button--primary") {
  const link = bankLinks[bank];
  return `<a class="${className}" data-bank="${bank}" href="${link.href}" target="_blank" rel="${link.rel}">${label}</a>`;
}

function internalButton(href, label, className = "button button--secondary") {
  return `<a class="${className}" href="${href}">${label}</a>`;
}

function faqHtml(items) {
  return items
    .map(
      (item) => `            <details class="faq-item">
              <summary>${item.q}</summary>
              <p>${item.a}</p>
            </details>`
    )
    .join("\n");
}

function pageSchema(page) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.heading,
    description: page.description,
    url: `${siteUrl}/${page.slug}/`
  };
}

function faqSchema(page) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a
      }
    }))
  };
}

function renderCta(button) {
  if (button.bank) {
    return bankButton(button.bank, button.label, button.className);
  }

  return internalButton(button.href, button.label, button.className);
}

function renderFacts(page) {
  return page.facts
    .map(
      (fact) => `            <div class="metric-card">
              <strong>${fact.value}</strong>
              <span>${fact.label}</span>
            </div>`
    )
    .join("\n");
}

function renderToc(page) {
  const items = [...page.sections.map((section) => ({ id: section.id, label: section.toc || section.title }))];

  if (page.faq.length) {
    items.push({ id: "faq", label: "FAQ" });
  }

  items.push({ id: "related", label: "Что почитать дальше" });

  return items
    .map((item) => `              <a href="#${item.id}">${item.label}</a>`)
    .join("\n");
}

function renderSections(page) {
  return page.sections
    .map(
      (section) => `          <section class="article-section" id="${section.id}" data-reveal>
            <h2>${section.title}</h2>
${section.html}
          </section>`
    )
    .join("\n\n");
}

function renderRelated(page, meta) {
  return page.related
    .map((slug) => {
      const related = meta[slug];

      return `            <article class="related-card">
              <h3><a href="../${slug}/">${related.heading}</a></h3>
              <p>${related.excerpt}</p>
            </article>`;
    })
    .join("\n");
}

function renderPage(page, meta) {
  const webpageJson = JSON.stringify(pageSchema(page), null, 2);
  const faqJson = JSON.stringify(faqSchema(page), null, 2);
  const heroButtons = page.heroButtons.map(renderCta).join("\n              ");
  const sidebarButtons = page.sidebarButtons.map(renderCta).join("\n                ");

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.title}</title>
  <meta name="description" content="${page.description}">
  <meta name="robots" content="index,follow">
  <meta name="theme-color" content="#081321">
  <style>
    html, body {
      background: #040914;
    }
  </style>
  <link rel="canonical" href="${siteUrl}/${page.slug}/">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${page.title}">
  <meta property="og:description" content="${page.description}">
  <meta property="og:url" content="${siteUrl}/${page.slug}/">
  <meta property="og:image" content="${siteUrl}/favicon.png">
  <link rel="icon" type="image/png" href="../favicon.png">
  <link rel="apple-touch-icon" href="../favicon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&family=Sora:wght@500;600;700;800&display=swap"
    rel="stylesheet"
  >
  <link rel="stylesheet" href="../styles.css">
  <script defer src="../script.js"></script>
  <script type="application/ld+json">
${webpageJson}
  </script>
  <script type="application/ld+json">
${faqJson}
  </script>
  <!-- Yandex.Metrika counter -->
  <script type="text/javascript">
    (function(m,e,t,r,i,k,a){
      m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();
      for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a);
    })(window, document,"script","https://mc.yandex.ru/metrika/tag.js?id=108760945", "ym");

    ym(108760945, "init", {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
  </script>
  <!-- /Yandex.Metrika counter -->
</head>
<body>
  <noscript><div><img src="https://mc.yandex.ru/watch/108760945" style="position:absolute; left:-9999px;" alt=""></div></noscript>
  <div class="site-shell">
    <header class="page-hero">
      <div class="container">
        <nav class="nav">
          <a class="brand" href="../index.html">${siteName}</a>
          <div class="nav-links">
            <a href="../index.html#rating">Рейтинг</a>
            <a href="../index.html#cards">Карты</a>
            <a href="../index.html#guides">Гайды</a>
            <a href="../index.html#faq">FAQ</a>
          </div>
          <a class="button button--nav" href="../index.html#rating">К главному рейтингу</a>
        </nav>

        <div class="page-hero__panel" data-reveal>
          <div class="breadcrumbs">
            <a href="../index.html">Главная</a>
            <span>/</span>
            <span>${page.heading}</span>
          </div>
          <p class="eyebrow">Обновлено <span data-verified-date>${verifiedDate}</span></p>
          <h1>${page.heading}</h1>
          <p class="page-hero__lead">${page.lead}</p>
          <div class="page-facts">
${renderFacts(page)}
          </div>
          <div class="hero-actions">
              ${heroButtons}
          </div>
        </div>
      </div>
    </header>

    <main>
      <section class="section section--article">
        <div class="container">
          <div class="article-layout">
            <div class="article-stack">
              <aside class="toc-card" data-reveal>
                <h2>На странице</h2>
                <div class="toc-list">
${renderToc(page)}
                </div>
              </aside>

              <div class="page-cta-panel" data-reveal>
                <p class="section-kicker">Быстрый переход</p>
                <h2>${page.sidebarTitle}</h2>
                <p>${page.sidebarText}</p>
                <div class="hero-actions">
                ${sidebarButtons}
                </div>
              </div>
            </div>

            <div class="article-stack">
${renderSections(page)}

              <section class="article-section" id="faq" data-reveal>
                <h2>FAQ</h2>
                <div class="faq-list">
${faqHtml(page.faq)}
                </div>
              </section>

              <section class="article-section" id="related" data-reveal>
                <h2>Что почитать дальше</h2>
                <div class="related-grid">
${renderRelated(page, meta)}
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="container footer-inner">
        <p>${siteName} 2026</p>
        <p><a href="../index.html">Главный рейтинг дебетовых карт</a></p>
        <p><a href="https://www.flaticon.com/ru/free-icons/-" target="_blank" rel="noopener">Кредитная карта иконки от vectorsmarket15 - Flaticon</a></p>
      </div>
    </footer>
  </div>
</body>
</html>
`;
}

const pages = [
  {
    slug: "cashback-10-percent",
    title: "Дебетовые карты с кэшбэком до 10% в 2026 году",
    description: "Где реально встречается кэшбэк 10% по дебетовым картам, какие есть ограничения и на какие условия смотреть в 2026 году.",
    heading: "Карты с кэшбэком до 10%",
    excerpt: "Разбираем, где 10% действительно достижимы и какие лимиты режут реальную выгоду.",
    lead: "Запрос про 10% почти всегда означает поиск максимальной выгоды в категориях. На практике такой процент обычно дают не на все покупки, а на отдельные категории месяца, партнерские акции или маркетплейсные предложения.",
    facts: [
      { value: "до 10%+", label: "реально в категориях и по промо" },
      { value: "не на всё", label: "базовый кэшбэк обычно ниже" },
      { value: "лимит важен", label: "месячный потолок влияет на выгоду" }
    ],
    heroButtons: [
      { href: "../index.html#rating", label: "Сравнить все карты", className: "button button--secondary" },
      { bank: "tbank", label: "Оформить T-Bank Black", className: "button button--primary" }
    ],
    sidebarTitle: "Нужна карта с высоким кэшбэком",
    sidebarText: "Если хотите не просто рекламный максимум, а удобную карту на каждый день, сначала сравните T-Bank, Альфу и ВТБ.",
    sidebarButtons: [
      { bank: "tbank", label: "Получить 500 ₽", className: "button button--primary" },
      { bank: "alfabank", label: "Оформить Альфа-Карту", className: "button button--secondary" }
    ],
    sections: [
      {
        id: "table",
        title: "Таблица: где обещают кэшбэк до 10% и выше",
        html: `
            <p>Ниже собраны карты, где высокий кэшбэк действительно встречается в категориях, партнерских акциях или экосистемных предложениях.</p>
            <div class="seo-table-wrap">
              <table class="seo-table">
                <thead>
                  <tr>
                    <th>Карта</th>
                    <th>%</th>
                    <th>Условия</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td data-label="Карта"><strong>T-Bank Black</strong><br>4 категории на выбор ежемесячно</td>
                    <td data-label="%">до 15%</td>
                    <td data-label="Условия">Повышенный кэшбэк действует в выбранных категориях, базово есть 1% на покупки и до 30% по спецпредложениям.</td>
                  </tr>
                  <tr>
                    <td data-label="Карта"><strong>Альфа-Карта</strong><br>суперкэшбэк и категории</td>
                    <td data-label="%">до 30%</td>
                    <td data-label="Условия">Сильнее всего раскрывается при выборе категорий месяца и в барабане суперкэшбэка, где могут выпадать повышенные проценты.</td>
                  </tr>
                  <tr>
                    <td data-label="Карта"><strong>ВТБ</strong><br>Карта для жизни</td>
                    <td data-label="%">до 15%</td>
                    <td data-label="Условия">Банк начисляет кэшбэк рублями в категориях, а отдельные партнерские предложения дают заметно больше базового уровня.</td>
                  </tr>
                  <tr>
                    <td data-label="Карта"><strong>Ozon Карта</strong><br>для активных покупателей Ozon</td>
                    <td data-label="%">до 25%</td>
                    <td data-label="Условия">Максимум обычно получают внутри экосистемы Ozon или в любимых категориях месяца вне маркетплейса.</td>
                  </tr>
                  <tr>
                    <td data-label="Карта"><strong>ОТП Карта</strong><br>ставка на промо</td>
                    <td data-label="%">до 10%+</td>
                    <td data-label="Условия">Высокий процент чаще появляется в коротких акциях на популярные категории, поэтому условия стоит перепроверять перед оформлением.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>Если смотреть именно на сочетание высокого процента и удобства на каждый день, чаще всего в шорт-лист попадают T-Bank Black и Альфа-Карта.</p>`
      },
      {
        id: "real-10",
        title: "Где реально дают 10%",
        html: `
            <p>Реальные 10% обычно встречаются в четырех сценариях:</p>
            <ul class="article-list">
              <li>категория месяца совпала с вашими постоянными тратами, например такси, рестораны или маркетплейсы;</li>
              <li>банк запустил промо для новых клиентов и усилил кэшбэк на короткий период;</li>
              <li>экосистемная карта дает повышенную выгоду внутри своего сервиса, как это бывает у Ozon;</li>
              <li>партнерские предложения внутри приложения дают выше базового уровня.</li>
            </ul>
            <div class="content-note">
              <strong>Главный вывод:</strong> искать нужно не просто цифру 10%, а карту, у которой категории реально совпадут с вашими повседневными покупками.
            </div>`
      },
      {
        id: "limits",
        title: "Какие ограничения режут выгоду",
        html: `
            <p>Даже у карт с очень заметным рекламным максимумом итоговая выгода зависит от ограничений. Вот что сильнее всего влияет на результат:</p>
            <div class="page-card-grid">
              <article class="page-card">
                <h3>Категории</h3>
                <p>10% почти никогда не действует на все покупки. Чаще это одна или несколько категорий месяца.</p>
              </article>
              <article class="page-card">
                <h3>Лимит кэшбэка</h3>
                <p>Если у банка потолок по выплате в месяц, высокий процент может быстро перестать ощущаться на больших тратах.</p>
              </article>
              <article class="page-card">
                <h3>MCC-коды</h3>
                <p>Похожие покупки у разных магазинов иногда проходят разными кодами, из-за этого одна и та же трата может попасть или не попасть в категорию.</p>
              </article>
              <article class="page-card">
                <h3>Условия активности</h3>
                <p>У части офферов нужен оборот по карте, подписка или выполнение промо-условия в конкретный срок.</p>
              </article>
            </div>`
      },
      {
        id: "choice",
        title: "Что выбрать, если нужен высокий процент, но без лишней сложности",
        html: `
            <p>Если нужен баланс между высоким максимумом и удобством, лучше смотреть так:</p>
            <ul class="article-list">
              <li><strong>T-Bank Black</strong> - для тех, кто хочет сильное приложение, кэшбэк рублями и гибкие категории.</li>
              <li><strong>Альфа-Карта</strong> - если важны бесплатное обслуживание без условий и агрессивный кэшбэк по акциям.</li>
              <li><strong>ВТБ</strong> - если нужен крупный банк с понятным начислением рублями.</li>
            </ul>
            <p>Остальные варианты тоже могут быть выгодны, но обычно уже под более узкий сценарий.</p>`
      }
    ],
    faq: [
      {
        q: "Бывает ли кэшбэк 10% на все покупки?",
        a: "Для массовых дебетовых карт это редкость. Обычно 10% дают только на отдельные категории, партнерские акции или внутри экосистемы банка."
      },
      {
        q: "Какая карта чаще всего подходит под запрос про высокий кэшбэк?",
        a: "Если нужен универсальный вариант, чаще всего смотрят в сторону T-Bank Black и Альфа-Карты, потому что у них высокий максимум сочетается с нормальным everyday-сценарием."
      },
      {
        q: "Почему у карты написано до 30%, а по факту выходит меньше?",
        a: "Потому что максимум обычно привязан к одной категории, лимиту по выплате или короткому промо. На обычные покупки возвращается заметно меньше."
      },
      {
        q: "Стоит ли брать карту только ради одного месяца с 10%?",
        a: "Если карта бесплатная и удобна сама по себе, да. Если высокая выгода держится только на одном промо, лучше смотреть на совокупность условий."
      }
    ],
    related: ["best-debit-cards-2026", "which-debit-card-to-choose", "debit-cards-no-maintenance"]
  },
  {
    slug: "debit-card-bonus-1000",
    title: "Дебетовые карты с бонусом 1000 ₽ в 2026 году",
    description: "Какие дебетовые карты дают бонус 1000 рублей, какие условия нужно выполнить и где проще получить стартовое вознаграждение.",
    heading: "Карты с бонусом 1000 ₽",
    excerpt: "Собрали карты с денежным бонусом за оформление и честно сравнили условия получения.",
    lead: "Если нужен именно денежный бонус за оформление, а не кэшбэк в категориях, смотрите не только на сумму, но и на условия получения. Иногда оффер на 500 ₽ конвертирует лучше, чем 1 000 ₽, потому что выполнить его проще.",
    facts: [
      { value: "1 000 ₽", label: "самый заметный оффер сейчас у ВТБ" },
      { value: "новым клиентам", label: "бонусы обычно доступны не всем" },
      { value: "нужны покупки", label: "вознаграждение часто идет после выполнения условия" }
    ],
    heroButtons: [
      { bank: "vtb", label: "Получить 1 000 ₽ от ВТБ", className: "button button--primary" },
      { href: "../index.html#rating", label: "Сравнить все бонусы", className: "button button--secondary" }
    ],
    sidebarTitle: "Нужен денежный оффер, а не бонусы",
    sidebarText: "Если приоритет именно в стартовом вознаграждении, сначала смотрите ВТБ, затем Альфу, T-Bank и ОТП как более простые по входу альтернативы.",
    sidebarButtons: [
      { bank: "vtb", label: "Оформить ВТБ", className: "button button--primary" },
      { bank: "alfabank", label: "Получить 500 ₽ от Альфы", className: "button button--secondary" }
    ],
    sections: [
      {
        id: "banks",
        title: "Какие банки сейчас дают денежный бонус",
        html: `
            <p>Если брать текущую подборку из самых заметных дебетовых карт, расклад по бонусам такой:</p>
            <div class="page-card-grid">
              <article class="page-card">
                <h3>ВТБ</h3>
                <p><strong>1 000 ₽</strong> при покупках от 5 000 ₽ в течение месяца после оформления. Это самый сильный денежный оффер в текущем списке.</p>
              </article>
              <article class="page-card">
                <h3>T-Bank Black</h3>
                <p><strong>500 ₽</strong> после покупки от 500 ₽. Бонус ниже, но выполнить условие заметно легче.</p>
              </article>
              <article class="page-card">
                <h3>Альфа-Карта</h3>
                <p><strong>500 ₽</strong> после первой покупки. Это один из самых простых welcome-офферов для нового клиента.</p>
              </article>
              <article class="page-card">
                <h3>ОТП Карта</h3>
                <p><strong>500 ₽</strong> при тратах от 15 000 ₽ за 30 дней. Подходит тем, кто готов прогонять больший оборот ради бонуса.</p>
              </article>
            </div>
            <p>Если нужен именно четырехзначный бонус, то в текущей витрине наиболее прямой вариант - ВТБ.</p>`
      },
      {
        id: "terms",
        title: "Условия получения бонуса",
        html: `
            <div class="seo-table-wrap">
              <table class="seo-table">
                <thead>
                  <tr>
                    <th>Карта</th>
                    <th>Бонус</th>
                    <th>Что сделать</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td data-label="Карта"><strong>ВТБ</strong></td>
                    <td data-label="Бонус">1 000 ₽</td>
                    <td data-label="Что сделать">Оформить карту по ссылке и совершить покупки от 5 000 ₽ в течение месяца после заявки.</td>
                  </tr>
                  <tr>
                    <td data-label="Карта"><strong>T-Bank Black</strong></td>
                    <td data-label="Бонус">500 ₽</td>
                    <td data-label="Что сделать">Оформить карту и сделать покупку минимум на 500 ₽.</td>
                  </tr>
                  <tr>
                    <td data-label="Карта"><strong>Альфа-Карта</strong></td>
                    <td data-label="Бонус">500 ₽</td>
                    <td data-label="Что сделать">Оформить карту и выполнить первую покупку.</td>
                  </tr>
                  <tr>
                    <td data-label="Карта"><strong>ОТП Карта</strong></td>
                    <td data-label="Бонус">500 ₽</td>
                    <td data-label="Что сделать">Потратить по карте 15 000 ₽ в течение 30 дней.</td>
                  </tr>
                </tbody>
              </table>
            </div>`
      },
      {
        id: "how-to-get",
        title: "Как получить бонус без лишних ошибок",
        html: `
            <ol class="article-ordered">
              <li>Переходите по правильной ссылке и оформляйте карту как новый клиент.</li>
              <li>Смотрите на срок выполнения условия: у части банков это первая покупка, у части - траты в конкретный период.</li>
              <li>Не откладывайте первую операцию, чтобы не потерять бонус из-за забывчивости.</li>
              <li>Держите под рукой push или чат банка, чтобы проверить, зачлось ли условие.</li>
            </ol>
            <div class="content-note">
              <strong>Практически:</strong> если нужен максимально простой оффер, легче всего заходят T-Bank и Альфа. Если нужен максимальный бонус деньгами, сильнее смотрится ВТБ.
            </div>`
      },
      {
        id: "pitfalls",
        title: "Подводные камни",
        html: `
            <ul class="article-list">
              <li>бонус может быть только для новых клиентов банка;</li>
              <li>покупки по некоторым MCC-кодам не всегда засчитываются в условие акции;</li>
              <li>деньги могут прийти не мгновенно, а после окончания расчетного периода;</li>
              <li>часть офферов действует ограниченное время, поэтому условия нужно читать перед заявкой.</li>
            </ul>`
      }
    ],
    faq: [
      {
        q: "Какая карта реально дает 1 000 ₽, а не бонусы баллами?",
        a: "Из текущих офферов самый понятный денежный бонус на 1 000 ₽ дает ВТБ, если выполнить условие по тратам."
      },
      {
        q: "Что выгоднее: 1 000 ₽ от ВТБ или 500 ₽ от T-Bank и Альфы?",
        a: "Если ориентироваться только на размер бонуса, сильнее ВТБ. Если смотреть на простоту выполнения, 500 ₽ от T-Bank и Альфы часто получить легче."
      },
      {
        q: "Нужно ли ждать конца месяца, чтобы получить бонус?",
        a: "Часто да. Банк сначала проверяет выполнение условий акции, а потом уже начисляет вознаграждение."
      },
      {
        q: "Можно ли получить несколько welcome-бонусов одновременно?",
        a: "Да, если вы оформляете разные карты разных банков и подходите под условия каждой акции."
      }
    ],
    related: ["order-debit-card-online", "best-debit-cards-2026", "tinkoff-black-2026"]
  },
  {
    slug: "alfa-debit-card-review",
    title: "Альфа дебетовая карта: условия, кэшбэк и полный обзор 2026",
    description: "Полный обзор дебетовой Альфа-Карты: обслуживание, кэшбэк, снятие наличных, плюсы и минусы, а также как оформить карту онлайн.",
    heading: "Альфа дебетовая карта - полный обзор",
    excerpt: "Условия Альфа-Карты, кэшбэк, бесплатность и подводные моменты в одном материале.",
    lead: "Альфа-Карта остается одной из самых заметных дебетовых карт для массового пользователя: обслуживание бесплатно без условий, кэшбэк приходит рублями, а welcome-оффер легко понять даже без долгого чтения тарифов.",
    facts: [
      { value: "0 ₽", label: "обслуживание навсегда и без условий" },
      { value: "до 30%", label: "кэшбэк в категориях на выбор" },
      { value: "500 ₽", label: "бонус после первой покупки" }
    ],
    heroButtons: [
      { bank: "alfabank", label: "Заказать Альфа-Карту", className: "button button--primary" },
      { href: "../index.html#cards", label: "Сравнить с другими", className: "button button--secondary" }
    ],
    sidebarTitle: "Хотите бесплатную карту без условий",
    sidebarText: "Альфа хорошо подходит тем, кто не хочет следить за платой за обслуживание и предпочитает кэшбэк рублями.",
    sidebarButtons: [
      { bank: "alfabank", label: "Получить 500 ₽", className: "button button--primary" },
      { href: "../best-debit-cards-2026/", label: "Открыть общий рейтинг", className: "button button--secondary" }
    ],
    sections: [
      {
        id: "conditions",
        title: "Основные условия Альфа-Карты",
        html: `
            <div class="seo-table-wrap">
              <table class="seo-table">
                <thead>
                  <tr>
                    <th>Параметр</th>
                    <th>Что важно знать</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td data-label="Параметр"><strong>Выпуск и обслуживание</strong></td>
                    <td data-label="Что важно знать">Бесплатно навсегда и без условий.</td>
                  </tr>
                  <tr>
                    <td data-label="Параметр"><strong>Снятие наличных</strong></td>
                    <td data-label="Что важно знать">Бесплатно до 1 млн ₽ в банкоматах банка и партнеров, до 100 000 ₽ в банкоматах других банков.</td>
                  </tr>
                  <tr>
                    <td data-label="Параметр"><strong>Лимиты</strong></td>
                    <td data-label="Что важно знать">Есть суточные и месячные ограничения, поэтому перед крупным снятием лучше проверить актуальный тариф.</td>
                  </tr>
                  <tr>
                    <td data-label="Параметр"><strong>Бонус</strong></td>
                    <td data-label="Что важно знать">500 ₽ после первой покупки по карте.</td>
                  </tr>
                  <tr>
                    <td data-label="Параметр"><strong>Оформление</strong></td>
                    <td data-label="Что важно знать">Онлайн-заявка и бесплатная доставка в доступных городах.</td>
                  </tr>
                </tbody>
              </table>
            </div>`
      },
      {
        id: "cashback",
        title: "Как работает кэшбэк",
        html: `
            <p>Альфа делает ставку на понятную связку из трех элементов:</p>
            <ul class="article-list">
              <li>до 30% в категориях на выбор;</li>
              <li>суперкэшбэк в барабане, где иногда выпадают 40%, 60% и даже 100% на одну категорию;</li>
              <li>рублевое начисление, которое проще воспринимать, чем баллы или мили.</li>
            </ul>
            <p>На практике Альфа особенно хорошо заходит тем, кто любит каждый месяц выбирать категории и готов пользоваться промо внутри приложения.</p>`
      },
      {
        id: "pros-cons",
        title: "Плюсы и минусы",
        html: `
            <div class="pros-cons">
              <div class="pros-cons__col">
                <h3>Плюсы</h3>
                <ul class="article-list">
                  <li>обслуживание бесплатно без условий;</li>
                  <li>удобный денежный welcome-бонус;</li>
                  <li>бесплатное снятие наличных и платежи без комиссии;</li>
                  <li>сильная программа лояльности для массовой карты.</li>
                </ul>
              </div>
              <div class="pros-cons__col">
                <h3>Минусы</h3>
                <ul class="article-list">
                  <li>максимум по кэшбэку обычно завязан на категории и промо;</li>
                  <li>барабан суперкэшбэка дает элемент случайности;</li>
                  <li>если не пользоваться категориями месяца, карта раскрывается слабее.</li>
                </ul>
              </div>
            </div>`
      },
      {
        id: "apply",
        title: "Как оформить карту онлайн",
        html: `
            <ol class="article-ordered">
              <li>Откройте страницу оформления по ссылке и заполните анкету.</li>
              <li>Подтвердите номер телефона и данные для выпуска карты.</li>
              <li>Выберите формат получения: доставка или отделение, если доступно в вашем городе.</li>
              <li>После получения сделайте первую покупку, чтобы забрать бонус 500 ₽.</li>
            </ol>
            <p>Если для вас важен нулевой ежемесячный платеж за карту, Альфа остается одним из самых простых вариантов на рынке.</p>`
      }
    ],
    faq: [
      {
        q: "Альфа-Карта действительно бесплатная?",
        a: "Да, на официальной странице банк указывает бесплатное обслуживание навсегда и без условий."
      },
      {
        q: "Когда приходит бонус 500 ₽?",
        a: "После оформления карты и выполнения условия с первой покупкой, обычно не в момент операции, а после ее обработки банком."
      },
      {
        q: "Можно ли снимать наличные без комиссии?",
        a: "Да, у карты есть бесплатное снятие наличных, но лимиты зависят от банкомата и текущих условий тарифа."
      },
      {
        q: "Кому Альфа-Карта подходит лучше всего?",
        a: "Тем, кто хочет бесплатную карту без условий, кэшбэк рублями и не хочет переплачивать только за сам факт обслуживания."
      }
    ],
    related: ["debit-cards-no-maintenance", "which-debit-card-to-choose", "best-debit-cards-2026"]
  },
  {
    slug: "tinkoff-black-2026",
    title: "Тинькофф Black (T-Bank Black): условия 2026",
    description: "Условия карты T-Bank Black в 2026 году: тарифы, кэшбэк, комиссии, снятие наличных и стоит ли оформлять карту сейчас.",
    heading: "Тинькофф Black - условия 2026",
    excerpt: "Тарифы, кэшбэк и комиссии по T-Bank Black, включая нюансы с обслуживанием и снятием наличных.",
    lead: "Запрос по привычке часто вводят как Тинькофф Black, но в 2026 году карта продвигается как T-Bank Black. По сути это все тот же сильный everyday-продукт с удобным приложением, кэшбэком рублями и гибкими лимитами.",
    facts: [
      { value: "99 ₽", label: "обслуживание без выполнения условий" },
      { value: "до 15%", label: "кэшбэк в 4 выбранных категориях" },
      { value: "500 ₽", label: "бонус после покупки от 500 ₽" }
    ],
    heroButtons: [
      { bank: "tbank", label: "Оформить T-Bank Black", className: "button button--primary" },
      { href: "../index.html#cards", label: "Сравнить с Альфой и ВТБ", className: "button button--secondary" }
    ],
    sidebarTitle: "Ищете универсальную карту на каждый день",
    sidebarText: "Black сильна там, где важны приложение, рублевый кэшбэк и удобное управление лимитами внутри экосистемы банка.",
    sidebarButtons: [
      { bank: "tbank", label: "Получить 500 ₽", className: "button button--primary" },
      { href: "../best-debit-cards-2026/", label: "Открыть рейтинг 2026", className: "button button--secondary" }
    ],
    sections: [
      {
        id: "tariffs",
        title: "Тарифы и базовые условия",
        html: `
            <div class="seo-table-wrap">
              <table class="seo-table">
                <thead>
                  <tr>
                    <th>Параметр</th>
                    <th>Условия 2026</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td data-label="Параметр"><strong>Выпуск и доставка</strong></td>
                    <td data-label="Условия 2026">Бесплатно.</td>
                  </tr>
                  <tr>
                    <td data-label="Параметр"><strong>Обслуживание</strong></td>
                    <td data-label="Условия 2026">99 ₽ за расчетный период или бесплатно при выполнении условий банка.</td>
                  </tr>
                  <tr>
                    <td data-label="Параметр"><strong>Как сделать бесплатной</strong></td>
                    <td data-label="Условия 2026">Подходит остаток от 50 000 ₽ на счетах, зарплатное зачисление, пенсия, действующий кредит банка или возраст до 18 лет. Также бесплатность дает Pro и Premium.</td>
                  </tr>
                  <tr>
                    <td data-label="Параметр"><strong>Оповещения</strong></td>
                    <td data-label="Условия 2026">99 ₽ в месяц, либо 59 ₽ с сим-картой Т-Мобайла, либо бесплатно в отдельных пакетах.</td>
                  </tr>
                  <tr>
                    <td data-label="Параметр"><strong>Бонус</strong></td>
                    <td data-label="Условия 2026">500 ₽ после покупки от 500 ₽ по реферальной ссылке.</td>
                  </tr>
                </tbody>
              </table>
            </div>`
      },
      {
        id: "cashback",
        title: "Кэшбэк и ежедневная выгода",
        html: `
            <p>Сильная сторона Black - кэшбэк рублями и хороший баланс между повседневным сценарием и промо:</p>
            <ul class="article-list">
              <li>до 15% в четырех выбранных категориях;</li>
              <li>до 30% по спецпредложениям партнеров;</li>
              <li>1% на часть повседневных покупок как базовый вариант.</li>
            </ul>
            <p>У карты сильное приложение, удобные лимиты, быстрые переводы и хорошая экосистема. Именно поэтому Black часто выбирают как основную карту, а не просто как промо-источник.</p>`
      },
      {
        id: "fees",
        title: "Какие комиссии важно знать заранее",
        html: `
            <div class="page-card-grid">
              <article class="page-card">
                <h3>Снятие в банкоматах Т-Банка</h3>
                <p>Без комиссии до 500 000 ₽ за расчетный период, если не выйти за тарифный лимит.</p>
              </article>
              <article class="page-card">
                <h3>Снятие в чужих банкоматах</h3>
                <p>Со стороны банка без комиссии при снятии от 3 000 ₽ за операцию и до 100 000 ₽ за расчетный период. Ниже порога - комиссия 90 ₽.</p>
              </article>
              <article class="page-card">
                <h3>Превышение лимита</h3>
                <p>Если выйти за бесплатный лимит снятия, действует комиссия 2% от суммы превышения, минимум 90 ₽.</p>
              </article>
              <article class="page-card">
                <h3>Платность обслуживания</h3>
                <p>Главный регулярный расход - 99 ₽ за период, если не выполнено условие бесплатности.</p>
              </article>
            </div>`
      },
      {
        id: "worth-it",
        title: "Стоит ли брать Black в 2026 году",
        html: `
            <p>Да, если вам нужна одна основная карта на каждый день и вы хотите:</p>
            <ul class="article-list">
              <li>получать кэшбэк рублями, а не бонусами;</li>
              <li>иметь сильное приложение и удобную поддержку;</li>
              <li>снимать наличные без комиссии в понятных лимитах;</li>
              <li>забирать welcome-бонус с умеренным условием по первой покупке.</li>
            </ul>
            <p>Если принципиально важно полностью бесплатное обслуживание без условий, тогда сильнее смотрится Альфа. Если нужна надежность крупного банка и 1 000 ₽ на старте, присмотритесь к ВТБ.</p>`
      }
    ],
    faq: [
      {
        q: "Tinkoff Black и T-Bank Black - это одна и та же карта?",
        a: "Да, пользовательский запрос по старому бренду в 2026 году обычно ведет к актуальному продукту T-Bank Black."
      },
      {
        q: "Можно ли пользоваться картой бесплатно?",
        a: "Да, если выполнить одно из условий банка или подключить подходящий пакет обслуживания."
      },
      {
        q: "Где у Black сильная сторона по сравнению с конкурентами?",
        a: "В сочетании удобного приложения, рублевого кэшбэка и комфортного everyday-сценария без сложной программы лояльности."
      },
      {
        q: "Кому карта может не подойти?",
        a: "Тем, кто не хочет следить за условием бесплатности и не готов мириться с платой 99 ₽ за период в базовом тарифе."
      }
    ],
    related: ["cashback-10-percent", "best-debit-cards-2026", "debit-cards-no-maintenance"]
  },
  {
    slug: "no-fee-cash-withdrawal",
    title: "Дебетовые карты без комиссии за снятие наличных",
    description: "Сравнение дебетовых карт без комиссии за снятие наличных: где можно снимать деньги, какие лимиты действуют и какие скрытые комиссии встречаются.",
    heading: "Карты без комиссии за снятие",
    excerpt: "Сравнили банкоматы, лимиты и скрытые комиссии, которые часто прячутся за словом бесплатно.",
    lead: "Фраза без комиссии за снятие наличных звучит просто, но почти всегда упирается в лимиты, тип банкомата и условия тарифа. Поэтому выбирать нужно не только по обещанию 0 ₽, а по реальному сценарию: где вы снимаете деньги и какими суммами.",
    facts: [
      { value: "0 ₽", label: "обычно в своих банкоматах или у партнеров" },
      { value: "лимиты есть", label: "бесплатность не равна безграничности" },
      { value: "чужой банкомат", label: "может взять свою комиссию" }
    ],
    heroButtons: [
      { href: "../index.html#rating", label: "Смотреть общий рейтинг", className: "button button--secondary" },
      { bank: "alfabank", label: "Оформить Альфа-Карту", className: "button button--primary" }
    ],
    sidebarTitle: "Нужна карта для наличных без сюрпризов",
    sidebarText: "Лучше всего тут смотреть на Альфу, T-Bank, ВТБ и Ozon, потому что у них сценарий со снятием описан заметнее и понятнее, чем у случайных промокарт.",
    sidebarButtons: [
      { bank: "alfabank", label: "Заказать Альфа-Карту", className: "button button--primary" },
      { bank: "tbank", label: "Оформить T-Bank Black", className: "button button--secondary" }
    ],
    sections: [
      {
        id: "limits-table",
        title: "Сравнение карт по снятию наличных",
        html: `
            <div class="seo-table-wrap">
              <table class="seo-table">
                <thead>
                  <tr>
                    <th>Карта</th>
                    <th>Где бесплатно</th>
                    <th>Лимиты и нюансы</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td data-label="Карта"><strong>T-Bank Black</strong></td>
                    <td data-label="Где бесплатно">В банкоматах Т-Банка и при соблюдении лимитов в сторонних банкоматах.</td>
                    <td data-label="Лимиты и нюансы">В чужих банкоматах важно снимать от 3 000 ₽ за раз. Бесплатный лимит по рублям обычно до 100 000 ₽ за период, дальше комиссия.</td>
                  </tr>
                  <tr>
                    <td data-label="Карта"><strong>Альфа-Карта</strong></td>
                    <td data-label="Где бесплатно">В банкоматах банка и партнеров, а также в пределах лимита в чужих банкоматах.</td>
                    <td data-label="Лимиты и нюансы">Официальная страница указывает до 1 млн ₽ в своих и партнерских банкоматах и до 100 000 ₽ в чужих банкоматах.</td>
                  </tr>
                  <tr>
                    <td data-label="Карта"><strong>ВТБ</strong></td>
                    <td data-label="Где бесплатно">В банкоматах группы ВТБ и банков-партнеров.</td>
                    <td data-label="Лимиты и нюансы">Для зарплатных клиентов ВТБ отдельно упоминает бесплатное снятие в чужих банкоматах до 50 000 ₽ в месяц.</td>
                  </tr>
                  <tr>
                    <td data-label="Карта"><strong>Ozon Карта</strong></td>
                    <td data-label="Где бесплатно">В банкоматах Ozon Банка и ВТБ.</td>
                    <td data-label="Лимиты и нюансы">Лимит зависит от уровня счета. На отдельных страницах банка фигурирует снятие до 3 млн ₽ в месяц без комиссии в своих и партнерских банкоматах.</td>
                  </tr>
                  <tr>
                    <td data-label="Карта"><strong>ОТП Карта</strong></td>
                    <td data-label="Где бесплатно">На витрине банка заявлены 0 ₽ за снятие наличных.</td>
                    <td data-label="Лимиты и нюансы">Перед оформлением проверьте текущий тариф именно по вашей карте и сети банкоматов, потому что детали могут меняться.</td>
                  </tr>
                </tbody>
              </table>
            </div>`
      },
      {
        id: "limits",
        title: "Почему лимит важнее слова бесплатно",
        html: `
            <p>Самые частые ограничения, которые меняют реальную картину:</p>
            <ul class="article-list">
              <li>минимальная сумма одной операции, как у T-Bank при снятии в чужом банкомате;</li>
              <li>месячный потолок на бесплатное снятие;</li>
              <li>разный режим для своих банкоматов, партнеров и чужих сетей;</li>
              <li>отдельные условия для зарплатных или премиальных клиентов.</li>
            </ul>
            <div class="content-note">
              <strong>Поэтому:</strong> если вы снимаете деньги редко и крупными суммами, вам подойдет почти любая из перечисленных карт. Если часто и понемногу, порог минимальной операции становится критичным.
            </div>`
      },
      {
        id: "where",
        title: "Где можно снимать деньги без комиссии",
        html: `
            <div class="page-card-grid">
              <article class="page-card">
                <h3>Свои банкоматы</h3>
                <p>Самый безопасный сценарий. Банк обычно прямо показывает карту банкоматов и полные лимиты именно для своей сети.</p>
              </article>
              <article class="page-card">
                <h3>Банки-партнеры</h3>
                <p>У части банков условия почти такие же, как в своей сети. Пример - Ozon и ВТБ.</p>
              </article>
              <article class="page-card">
                <h3>Чужие банкоматы</h3>
                <p>Здесь чаще всего всплывают лимиты по сумме, комиссии за маленькое снятие или отдельная комиссия со стороны владельца банкомата.</p>
              </article>
              <article class="page-card">
                <h3>Снятие за границей</h3>
                <p>Нужно дополнительно смотреть не только тариф банка, но и правила иностранного банкомата, а также конвертацию.</p>
              </article>
            </div>`
      },
      {
        id: "hidden-fees",
        title: "Скрытые комиссии, о которых часто забывают",
        html: `
            <ul class="article-list">
              <li>комиссия за снятие суммы ниже минимального порога;</li>
              <li>2% или другой процент за превышение месячного лимита;</li>
              <li>комиссия владельца банкомата, даже если ваш банк со своей стороны ничего не берет;</li>
              <li>конвертация и дополнительные расходы в другой валюте или за рубежом.</li>
            </ul>`
      }
    ],
    faq: [
      {
        q: "Какая карта лучше для частого снятия наличных?",
        a: "Если нужен понятный сценарий без сложных условий, чаще всего смотрят Альфу, T-Bank и ВТБ. Для Ozon важно, доступны ли вам банкоматы Ozon или ВТБ."
      },
      {
        q: "Бесплатно в чужом банкомате означает без комиссии вообще?",
        a: "Не всегда. Ваш банк может не брать комиссию, но чужой банкомат иногда показывает собственную доплату."
      },
      {
        q: "Что удобнее: высокий лимит или отсутствие минимальной суммы?",
        a: "Если снимаете редко и много, важнее высокий лимит. Если регулярно снимаете небольшие суммы, важнее отсутствие штрафа за маленькую операцию."
      },
      {
        q: "Есть ли смысл выбирать карту только по снятию наличных?",
        a: "Обычно нет. Лучше смотреть связку из обслуживания, кэшбэка, переводов и того, насколько часто вы вообще пользуетесь наличными."
      }
    ],
    related: ["travel-debit-cards", "debit-cards-no-maintenance", "which-debit-card-to-choose"]
  },
  {
    slug: "which-debit-card-to-choose",
    title: "Как выбрать дебетовую карту в 2026 году",
    description: "Практическое руководство: как выбрать дебетовую карту, какие критерии важны, какие ошибки совершают чаще всего и какие карты подходят под разные сценарии.",
    heading: "Как выбрать дебетовую карту",
    excerpt: "Показываем, по каким критериям выбирать карту под свои траты, а не под чужую рекламу.",
    lead: "Правильная дебетовая карта редко выбирается по одному баннеру с максимальным кэшбэком. Гораздо полезнее посмотреть, как вы тратите деньги, нужны ли вам наличные, критична ли бесплатность обслуживания и насколько вы готовы следить за категориями.",
    facts: [
      { value: "4 критерия", label: "обычно хватает для сильного выбора" },
      { value: "не только %", label: "важны лимиты и бесплатность" },
      { value: "1 карта", label: "лучше брать под основной сценарий" }
    ],
    heroButtons: [
      { href: "../best-debit-cards-2026/", label: "Открыть рейтинг 2026", className: "button button--primary" },
      { href: "../index.html#rating", label: "Сравнить в таблице", className: "button button--secondary" }
    ],
    sidebarTitle: "Сначала определите свой сценарий",
    sidebarText: "Для основной everyday-карты важнее удобство и понятность. Для второго продукта можно уже охотиться за промо и сильными категориями.",
    sidebarButtons: [
      { bank: "tbank", label: "Оформить T-Bank Black", className: "button button--primary" },
      { bank: "vtb", label: "Получить 1 000 ₽ от ВТБ", className: "button button--secondary" }
    ],
    sections: [
      {
        id: "criteria",
        title: "Критерии выбора",
        html: `
            <div class="page-card-grid">
              <article class="page-card">
                <h3>Обслуживание</h3>
                <p>Если не хотите думать о дополнительных условиях, сразу смотрите бесплатные карты вроде Альфы, ВТБ, Ozon или ОТП.</p>
              </article>
              <article class="page-card">
                <h3>Кэшбэк</h3>
                <p>Смотрите не на максимальную цифру, а на то, насколько категории совпадают с вашими тратами.</p>
              </article>
              <article class="page-card">
                <h3>Наличные и переводы</h3>
                <p>Если часто снимаете или переводите деньги, лимиты и комиссии важнее красивого welcome-оффера.</p>
              </article>
              <article class="page-card">
                <h3>Приложение и сервис</h3>
                <p>На длинной дистанции именно удобство приложения часто решает, останется ли карта основной.</p>
              </article>
            </div>`
      },
      {
        id: "mistakes",
        title: "Ошибки при выборе карты",
        html: `
            <ul class="article-list">
              <li>выбирать карту только по максимальному рекламному кэшбэку;</li>
              <li>не проверять, платная ли карта после окончания промо;</li>
              <li>игнорировать лимиты на снятие, переводы и кэшбэк;</li>
              <li>брать карту ради бонуса и не думать, удобно ли будет пользоваться ею потом.</li>
            </ul>`
      },
      {
        id: "comparison",
        title: "Быстрое сравнение популярных сценариев",
        html: `
            <div class="seo-table-wrap">
              <table class="seo-table">
                <thead>
                  <tr>
                    <th>Сценарий</th>
                    <th>Оптимальный выбор</th>
                    <th>Почему</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td data-label="Сценарий"><strong>Одна главная карта на каждый день</strong></td>
                    <td data-label="Оптимальный выбор">T-Bank Black</td>
                    <td data-label="Почему">Сильное приложение, кэшбэк рублями, удобная экосистема и хорошие переводы.</td>
                  </tr>
                  <tr>
                    <td data-label="Сценарий"><strong>Нужна бесплатная карта без условий</strong></td>
                    <td data-label="Оптимальный выбор">Альфа-Карта или ВТБ</td>
                    <td data-label="Почему">Нет платы за обслуживание, при этом сохраняется нормальный everyday-сценарий.</td>
                  </tr>
                  <tr>
                    <td data-label="Сценарий"><strong>Частые покупки на Ozon</strong></td>
                    <td data-label="Оптимальный выбор">Ozon Карта</td>
                    <td data-label="Почему">Основная ценность раскрывается внутри маркетплейса и его акций.</td>
                  </tr>
                  <tr>
                    <td data-label="Сценарий"><strong>Нужен бонус за старт</strong></td>
                    <td data-label="Оптимальный выбор">ВТБ, T-Bank, Альфа</td>
                    <td data-label="Почему">У них сейчас самые понятные офферы по реальным деньгам за оформление.</td>
                  </tr>
                </tbody>
              </table>
            </div>`
      },
      {
        id: "recommendations",
        title: "Рекомендации по типу пользователя",
        html: `
            <ul class="article-list">
              <li><strong>Любите комфорт и цифровой сервис</strong> - берите T-Bank Black.</li>
              <li><strong>Хотите бесплатную карту и агрессивный кэшбэк</strong> - смотрите Альфа-Карту.</li>
              <li><strong>Предпочитаете большой банк и понятный рублевый кэшбэк</strong> - подойдет ВТБ.</li>
              <li><strong>Часто покупаете на Ozon</strong> - логичный выбор Ozon Карта.</li>
              <li><strong>Охотитесь за акциями и короткими промо</strong> - можно брать ОТП как второй продукт.</li>
            </ul>`
      }
    ],
    faq: [
      {
        q: "Какая дебетовая карта лучшая, если брать только одну?",
        a: "Для универсального everyday-сценария чаще всего выбирают T-Bank Black. Если важна абсолютная бесплатность, сильнее выглядит Альфа."
      },
      {
        q: "Нужна ли отдельная карта под маркетплейсы?",
        a: "Если вы регулярно тратите много на Ozon, отдельная Ozon Карта может дать больше выгоды, чем универсальная карта без экосистемного бонуса."
      },
      {
        q: "Стоит ли держать две карты одновременно?",
        a: "Да, это нормальный сценарий. Одну карту оставляют как основную, вторую используют под бонус, отдельные категории или маркетплейс."
      },
      {
        q: "Что важнее: кэшбэк или бесплатное обслуживание?",
        a: "Для основной карты чаще важнее отсутствие лишних расходов и удобство. Кэшбэк становится решающим, когда карта и так комфортна в быту."
      }
    ],
    related: ["best-debit-cards-2026", "debit-cards-no-maintenance", "cashback-10-percent"]
  },
  {
    slug: "best-debit-cards-2026",
    title: "Лучшие дебетовые карты 2026 года с кэшбэком",
    description: "Рейтинг лучших дебетовых карт 2026 года: сравнение кэшбэка, бонусов за оформление, обслуживания и удобства на каждый день.",
    heading: "Лучшие дебетовые карты 2026",
    excerpt: "Итоговый рейтинг карт 2026 года с таблицей, сравнением и коротким выводом по сценариям.",
    lead: "Если нужен короткий ответ, то в 2026 году лидерство делят несколько разных сценариев: T-Bank Black как сильная основная карта, Альфа как бесплатный и агрессивный по промо вариант, ВТБ как крупный банк с хорошим welcome-оффером, Ozon как экосистемный продукт и ОТП как карта для акций.",
    facts: [
      { value: "5 карт", label: "в итоговом рейтинге" },
      { value: "до 1 000 ₽", label: "welcome-бонус в текущих офферах" },
      { value: "0 ₽", label: "обслуживание у большинства" }
    ],
    heroButtons: [
      { href: "../index.html#rating", label: "Открыть главную таблицу", className: "button button--primary" },
      { bank: "tbank", label: "Получить 500 ₽ от T-Bank", className: "button button--secondary" }
    ],
    sidebarTitle: "Нужен итоговый рейтинг без лишней воды",
    sidebarText: "Если выбирать одну карту, смотрите сначала T-Bank, Альфу и ВТБ. Ozon и ОТП лучше раскрываются уже под более узкий сценарий.",
    sidebarButtons: [
      { bank: "tbank", label: "Оформить T-Bank Black", className: "button button--primary" },
      { bank: "vtb", label: "Забрать 1 000 ₽ от ВТБ", className: "button button--secondary" }
    ],
    sections: [
      {
        id: "ranking",
        title: "Рейтинг",
        html: `
            <div class="page-card-grid">
              <article class="page-card">
                <h3>#1 T-Bank Black</h3>
                <p>Сильная everyday-карта: удобное приложение, кэшбэк рублями, 500 ₽ за старт и понятная экосистема.</p>
              </article>
              <article class="page-card">
                <h3>#2 Альфа-Карта</h3>
                <p>Полностью бесплатная карта без условий с мощной программой кэшбэка и бонусом 500 ₽.</p>
              </article>
              <article class="page-card">
                <h3>#3 ВТБ</h3>
                <p>Крупный банк с кэшбэком рублями и самым заметным денежным оффером на старте - 1 000 ₽.</p>
              </article>
              <article class="page-card">
                <h3>#4 Ozon Карта</h3>
                <p>Лучший вариант для тех, кто регулярно покупает на Ozon и хочет сильную выгоду внутри маркетплейса.</p>
              </article>
              <article class="page-card">
                <h3>#5 ОТП Карта</h3>
                <p>Интересна для акций и сильных промо, особенно если вам подходят бонусы за оборот по карте.</p>
              </article>
            </div>`
      },
      {
        id: "table",
        title: "Сравнительная таблица",
        html: `
            <div class="seo-table-wrap">
              <table class="seo-table">
                <thead>
                  <tr>
                    <th>Карта</th>
                    <th>Кэшбэк</th>
                    <th>Бонус</th>
                    <th>Обслуживание</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td data-label="Карта"><strong>T-Bank Black</strong></td>
                    <td data-label="Кэшбэк">До 15% в категориях, до 30% по спецпредложениям</td>
                    <td data-label="Бонус">500 ₽</td>
                    <td data-label="Обслуживание">99 ₽ или бесплатно при условиях</td>
                  </tr>
                  <tr>
                    <td data-label="Карта"><strong>Альфа-Карта</strong></td>
                    <td data-label="Кэшбэк">До 30% в категориях, до 100% в суперкэшбэке</td>
                    <td data-label="Бонус">500 ₽</td>
                    <td data-label="Обслуживание">0 ₽</td>
                  </tr>
                  <tr>
                    <td data-label="Карта"><strong>ВТБ</strong></td>
                    <td data-label="Кэшбэк">До 15% в категориях, до 50% у партнеров</td>
                    <td data-label="Бонус">1 000 ₽</td>
                    <td data-label="Обслуживание">0 ₽</td>
                  </tr>
                  <tr>
                    <td data-label="Карта"><strong>Ozon Карта</strong></td>
                    <td data-label="Кэшбэк">До 25% вне Ozon, до 30% выгоды на Ozon</td>
                    <td data-label="Бонус">нет фиксированного денежного оффера</td>
                    <td data-label="Обслуживание">0 ₽</td>
                  </tr>
                  <tr>
                    <td data-label="Карта"><strong>ОТП Карта</strong></td>
                    <td data-label="Кэшбэк">До 35% по акциям, часто сильные промо</td>
                    <td data-label="Бонус">500 ₽</td>
                    <td data-label="Обслуживание">0 ₽</td>
                  </tr>
                </tbody>
              </table>
            </div>`
      },
      {
        id: "comparison",
        title: "Короткое сравнение",
        html: `
            <ul class="article-list">
              <li><strong>T-Bank</strong> - лучший баланс удобства, кэшбэка и everyday-сервиса.</li>
              <li><strong>Альфа</strong> - сильнее, если вы хотите полную бесплатность и яркие кэшбэк-акции.</li>
              <li><strong>ВТБ</strong> - хороший компромисс между надежностью крупного банка и коммерческим оффером.</li>
              <li><strong>Ozon</strong> - заметно усиливается, если вы и так регулярно покупаете на маркетплейсе.</li>
              <li><strong>ОТП</strong> - часто идет вторым продуктом ради акций, а не единственной основной картой.</li>
            </ul>`
      },
      {
        id: "summary",
        title: "Вывод",
        html: `
            <p>Если нужна одна карта на все случаи, чаще всего выигрывает T-Bank Black. Если принципиальна полная бесплатность, удобнее смотреть на Альфу и ВТБ. Если тратите много в Ozon, экосистемная карта может дать больше выгоды, чем универсальные продукты.</p>
            <div class="content-note">
              <strong>Простой старт:</strong> T-Bank - для ежедневного использования, Альфа - для бесплатного обслуживания, ВТБ - для бонуса 1 000 ₽.
            </div>`
      }
    ],
    faq: [
      {
        q: "Какая дебетовая карта лучшая в 2026 году?",
        a: "Если нужен один универсальный вариант, чаще всего лидирует T-Bank Black. Но под задачу полной бесплатности сильнее выглядят Альфа и ВТБ."
      },
      {
        q: "Есть ли карта лучше T-Bank Black по кэшбэку?",
        a: "По максимальным промо-цифрам конкуренты могут быть агрессивнее, но по общему everyday-сценарию Black остается одним из самых сильных продуктов."
      },
      {
        q: "Какая карта дает самый заметный бонус за оформление?",
        a: "В текущей подборке самый сильный денежный welcome-оффер у ВТБ - 1 000 ₽ при выполнении условия по тратам."
      },
      {
        q: "Есть ли смысл открывать две карты?",
        a: "Да, это нормальная стратегия: одну карту оставить основной, а вторую держать под маркетплейс, бонус или отдельные категории."
      }
    ],
    related: ["which-debit-card-to-choose", "cashback-10-percent", "debit-card-bonus-1000"]
  },
  {
    slug: "travel-debit-cards",
    title: "Дебетовые карты для путешествий в 2026 году",
    description: "Какие дебетовые карты стоит смотреть для путешествий: снятие наличных, конвертация, курс валют, кэшбэк за билеты и что важно проверить перед поездкой.",
    heading: "Карты для путешествий",
    excerpt: "Разбираем travel-сценарий без иллюзий: наличные, курс, экосистемы и ограничения за границей.",
    lead: "Для travel-сценария в 2026 году важно не только наличие кэшбэка за билеты или отели. Намного важнее, как карта ведет себя с наличными, есть ли понятные лимиты, насколько удобна конвертация и где вообще принимается платежная система в вашей поездке.",
    facts: [
      { value: "Мир не везде", label: "географию приема нужно проверять заранее" },
      { value: "наличные важны", label: "снятие за границей и в поездках не стоит игнорировать" },
      { value: "travel-кэшбэк", label: "чаще идет через категории и партнеров" }
    ],
    heroButtons: [
      { href: "../no-fee-cash-withdrawal/", label: "Проверить снятие наличных", className: "button button--secondary" },
      { bank: "tbank", label: "Оформить T-Bank Black", className: "button button--primary" }
    ],
    sidebarTitle: "Travel-карта без лишнего маркетинга",
    sidebarText: "В 2026 году чаще выигрывает не классическая travel-карта, а удобный everyday-продукт с понятными лимитами, хорошим приложением и нормальными категориями.",
    sidebarButtons: [
      { bank: "tbank", label: "Выбрать T-Bank", className: "button button--primary" },
      { bank: "vtb", label: "Оформить ВТБ", className: "button button--secondary" }
    ],
    sections: [
      {
        id: "cards",
        title: "Какие карты смотреть под поездки",
        html: `
            <div class="seo-table-wrap">
              <table class="seo-table">
                <thead>
                  <tr>
                    <th>Карта</th>
                    <th>Чем полезна в поездках</th>
                    <th>Что проверить</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td data-label="Карта"><strong>T-Bank Black</strong></td>
                    <td data-label="Чем полезна в поездках">Удобное приложение, сильный everyday-сервис, валютные счета в тарифе и понятные условия по снятию.</td>
                    <td data-label="Что проверить">Лимиты на снятие и актуальную доступность платежной системы в стране поездки.</td>
                  </tr>
                  <tr>
                    <td data-label="Карта"><strong>Альфа-Карта</strong></td>
                    <td data-label="Чем полезна в поездках">Бесплатное обслуживание и бесплатное снятие наличных в широком сценарии.</td>
                    <td data-label="Что проверить">Лимиты в сторонних банкоматах и особенности конвертации.</td>
                  </tr>
                  <tr>
                    <td data-label="Карта"><strong>ВТБ</strong></td>
                    <td data-label="Чем полезна в поездках">У банка есть отдельная travel-подача карты для поездок, плюс бесплатное обслуживание и кэшбэк рублями.</td>
                    <td data-label="Что проверить">Актуальные категории и партнерские travel-акции.</td>
                  </tr>
                  <tr>
                    <td data-label="Карта"><strong>Ozon Карта</strong></td>
                    <td data-label="Чем полезна в поездках">Подходит скорее как бесплатная запасная карта с понятным снятием в банкоматах Ozon и ВТБ.</td>
                    <td data-label="Что проверить">Лимит снятия по вашему уровню счета и сценарий использования вне маркетплейса.</td>
                  </tr>
                </tbody>
              </table>
            </div>`
      },
      {
        id: "abroad",
        title: "Снятие без комиссии за границей и в поездках",
        html: `
            <p>На travel-страницах многие банки пишут красиво, но на практике важно помнить три вещи:</p>
            <ul class="article-list">
              <li>в другой стране карту могут принять не везде, особенно если вы завязаны на платежную систему Мир;</li>
              <li>даже при нулевой комиссии со стороны вашего банка владелец банкомата может взять отдельную плату;</li>
              <li>минимальная сумма операции и месячный лимит иногда ломают весь travel-сценарий.</li>
            </ul>
            <div class="content-note">
              <strong>Лучший подход:</strong> перед поездкой проверить две вещи - где работает карта и сколько реально можно снять без доплат именно в вашем тарифе.
            </div>`
      },
      {
        id: "fx",
        title: "Курс валют и конвертация",
        html: `
            <p>Если поездки связаны с оплатой в другой валюте, смотрите не только на кэшбэк:</p>
            <ul class="article-list">
              <li>по какому курсу проходит конвертация;</li>
              <li>есть ли валютные счета и удобно ли ими управлять в приложении;</li>
              <li>не навязывает ли банкомат за границей собственную конвертацию по невыгодному курсу.</li>
            </ul>
            <p>T-Bank в этом сценарии обычно воспринимается наиболее технологичным, но перед выездом все равно нужно проверять актуальные ограничения по стране и сети приема.</p>`
      },
      {
        id: "tickets",
        title: "Кэшбэк за билеты и travel-покупки",
        html: `
            <p>У массовых дебетовых карт travel-выгода чаще идет не через мили, а через категории и партнеров:</p>
            <ul class="article-list">
              <li>у T-Bank и Альфы периодически появляются сильные партнерские предложения;</li>
              <li>у ВТБ travel-ценность часто раскрывается через отдельные промо и категории;</li>
              <li>если поездка в основном по России, удобство повседневной карты часто важнее классической travel-обертки.</li>
            </ul>`
      }
    ],
    faq: [
      {
        q: "Какая дебетовая карта лучше для путешествий?",
        a: "Чаще всего смотрят T-Bank Black как наиболее удобный цифровой вариант, а Альфу и ВТБ - как бесплатные альтернативы с понятными условиями."
      },
      {
        q: "Нужна ли отдельная travel-карта, если поездки редкие?",
        a: "Не всегда. Часто хватает сильной everyday-карты с бесплатным обслуживанием, хорошими лимитами и понятным кэшбэком."
      },
      {
        q: "Что проверять первым делом перед поездкой?",
        a: "Где работает платежная система карты, сколько можно снять наличных без комиссии и по какому курсу проходит конвертация."
      },
      {
        q: "Ozon Карта подходит для путешествий?",
        a: "Как бесплатная запасная карта - да. Но как основной travel-инструмент она обычно уступает T-Bank, Альфе и ВТБ."
      }
    ],
    related: ["no-fee-cash-withdrawal", "which-debit-card-to-choose", "best-debit-cards-2026"]
  },
  {
    slug: "debit-cards-no-maintenance",
    title: "Бесплатные дебетовые карты без обслуживания в 2026 году",
    description: "Какие дебетовые карты действительно бесплатные, когда обслуживание становится платным и какие карты без абонплаты выглядят сильнее всего.",
    heading: "Бесплатные дебетовые карты",
    excerpt: "Сравнили карты без платы за обслуживание и отдельно показали, где бесплатность условная, а где настоящая.",
    lead: "Запрос про карту без обслуживания один из самых стабильных в нише, потому что люди не хотят платить за сам факт владения картой. Здесь особенно важно отличать полностью бесплатные продукты от тех, где бесплатность зависит от остатков, зарплаты или подписки.",
    facts: [
      { value: "0 ₽", label: "у Альфы, ВТБ, Ozon и ОТП без явной абонплаты" },
      { value: "условно", label: "у T-Bank бесплатность зависит от сценария" },
      { value: "смотрите тариф", label: "платными бывают не карта, а уведомления и допсервисы" }
    ],
    heroButtons: [
      { bank: "alfabank", label: "Оформить бесплатную Альфа-Карту", className: "button button--primary" },
      { bank: "vtb", label: "Получить 1 000 ₽ от ВТБ", className: "button button--secondary" }
    ],
    sidebarTitle: "Хотите карту без абонплаты",
    sidebarText: "Если раздражают условия бесплатности, сильнее всего выглядят Альфа, ВТБ, Ozon и ОТП. T-Bank лучше брать, когда ее сильные стороны для вас действительно важны.",
    sidebarButtons: [
      { bank: "alfabank", label: "Заказать Альфа-Карту", className: "button button--primary" },
      { href: "../best-debit-cards-2026/", label: "Открыть рейтинг", className: "button button--secondary" }
    ],
    sections: [
      {
        id: "free-table",
        title: "Сравнение карт без обслуживания",
        html: `
            <div class="seo-table-wrap">
              <table class="seo-table">
                <thead>
                  <tr>
                    <th>Карта</th>
                    <th>Обслуживание</th>
                    <th>Когда становится платной</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td data-label="Карта"><strong>Альфа-Карта</strong></td>
                    <td data-label="Обслуживание">0 ₽</td>
                    <td data-label="Когда становится платной">По базовой витрине не требуется отдельное условие бесплатности.</td>
                  </tr>
                  <tr>
                    <td data-label="Карта"><strong>ВТБ</strong></td>
                    <td data-label="Обслуживание">0 ₽</td>
                    <td data-label="Когда становится платной">Базовая карта для жизни идет как бесплатная по выпуску и обслуживанию.</td>
                  </tr>
                  <tr>
                    <td data-label="Карта"><strong>Ozon Карта</strong></td>
                    <td data-label="Обслуживание">0 ₽</td>
                    <td data-label="Когда становится платной">Сама карта бесплатная, но условия отдельных сервисов лучше проверять отдельно.</td>
                  </tr>
                  <tr>
                    <td data-label="Карта"><strong>ОТП Карта</strong></td>
                    <td data-label="Обслуживание">0 ₽</td>
                    <td data-label="Когда становится платной">На витрине банка заявлены нулевое обслуживание, переводы и снятие наличных.</td>
                  </tr>
                  <tr>
                    <td data-label="Карта"><strong>T-Bank Black</strong></td>
                    <td data-label="Обслуживание">99 ₽ или бесплатно</td>
                    <td data-label="Когда становится платной">Если не выполнены условия банка по остаткам, зарплате, пенсии или пакету обслуживания.</td>
                  </tr>
                </tbody>
              </table>
            </div>`
      },
      {
        id: "conditions",
        title: "Условия бесплатности",
        html: `
            <p>Бесплатная карта может быть двух типов:</p>
            <ul class="article-list">
              <li><strong>абсолютно бесплатная</strong> - без требований по остаткам и активности;</li>
              <li><strong>условно бесплатная</strong> - платить не нужно только при выполнении заданных условий.</li>
            </ul>
            <p>В текущей подборке самый очевидный безусловный вариант - Альфа. T-Bank уже нужно оценивать вместе с тем, готовы ли вы выполнять условие бесплатности.</p>`
      },
      {
        id: "paid",
        title: "Когда карта неожиданно становится платной",
        html: `
            <div class="page-card-grid">
              <article class="page-card">
                <h3>Платные уведомления</h3>
                <p>Даже если сама карта бесплатная, SMS или push-пакет могут стоить денег.</p>
              </article>
              <article class="page-card">
                <h3>Премиальные опции</h3>
                <p>Некоторые банки усиливают условия через подписку, но сама подписка уже платная.</p>
              </article>
              <article class="page-card">
                <h3>Невыполненный остаток</h3>
                <p>У условно бесплатных карт комиссия возвращается, если перестали выполняться требования по балансу.</p>
              </article>
              <article class="page-card">
                <h3>Редкая проверка тарифа</h3>
                <p>Люди часто оформляют карту под акцию и не читают, как она живет после окончания промо.</p>
              </article>
            </div>`
      },
      {
        id: "comparison",
        title: "Что выбрать на практике",
        html: `
            <ul class="article-list">
              <li><strong>Альфа</strong> - если хотите бесплатную карту без лишних условий и еще бонус 500 ₽.</li>
              <li><strong>ВТБ</strong> - если нужен крупный банк, бесплатность и welcome-оффер 1 000 ₽.</li>
              <li><strong>Ozon</strong> - если много покупаете на маркетплейсе и хотите бесплатный продукт без лишней боли.</li>
              <li><strong>T-Bank</strong> - если готовы выполнять условие ради более сильного everyday-сервиса.</li>
            </ul>`
      }
    ],
    faq: [
      {
        q: "Какая дебетовая карта действительно бесплатная?",
        a: "Из текущей подборки самой прямой по бесплатности выглядит Альфа-Карта. Также без абонплаты позиционируются ВТБ, Ozon и ОТП."
      },
      {
        q: "У T-Bank Black можно не платить за обслуживание?",
        a: "Да, но там бесплатность зависит от условий: остатки, зарплатный статус, пенсия, кредит банка или пакет обслуживания."
      },
      {
        q: "Если карта бесплатная, будут ли еще какие-то расходы?",
        a: "Иногда да. Например, уведомления, конвертация, снятие сверх лимита или премиальные пакеты могут оплачиваться отдельно."
      },
      {
        q: "Что важнее: бесплатность или высокий кэшбэк?",
        a: "Для основной карты обычно лучше, когда нет лишних обязательных расходов. Высокий кэшбэк хорош, если карта и так удобна в повседневном использовании."
      }
    ],
    related: ["no-fee-cash-withdrawal", "alfa-debit-card-review", "best-debit-cards-2026"]
  },
  {
    slug: "order-debit-card-online",
    title: "Заказать дебетовую карту онлайн в 2026 году",
    description: "Как заказать дебетовую карту онлайн: какие банки удобнее, как проходит оформление, сколько ждать карту и какие данные понадобятся.",
    heading: "Заказать дебетовую карту онлайн",
    excerpt: "Показываем, какие банки удобнее для онлайн-оформления и что нужно для заявки.",
    lead: "Онлайн-оформление дебетовой карты давно стало стандартом, но по факту банки отличаются по удобству анкеты, скорости доставки, понятности оффера и тому, насколько легко потом получить бонус за оформление.",
    facts: [
      { value: "5-10 минут", label: "обычно хватает на заявку" },
      { value: "паспорт + телефон", label: "основной набор данных" },
      { value: "доставка", label: "часто доступна без визита в банк" }
    ],
    heroButtons: [
      { bank: "tbank", label: "Оформить T-Bank Black", className: "button button--primary" },
      { bank: "vtb", label: "Получить 1 000 ₽ от ВТБ", className: "button button--secondary" }
    ],
    sidebarTitle: "Нужен максимально простой онлайн-старт",
    sidebarText: "По удобству онлайна чаще всего смотрят на T-Bank, Альфу и ВТБ. Ozon и ОТП тоже можно оформить дистанционно, но сценарии у них уже чуть более нишевые.",
    sidebarButtons: [
      { bank: "tbank", label: "Заказать T-Bank", className: "button button--primary" },
      { bank: "alfabank", label: "Оформить Альфа-Карту", className: "button button--secondary" }
    ],
    sections: [
      {
        id: "banks",
        title: "Топ банков для онлайн-оформления",
        html: `
            <div class="page-card-grid">
              <article class="page-card">
                <h3>T-Bank Black</h3>
                <p>Один из самых понятных сценариев: быстрая анкета, доставка и бонус 500 ₽ после покупки от 500 ₽.</p>
              </article>
              <article class="page-card">
                <h3>Альфа-Карта</h3>
                <p>Бесплатная карта с сильной витриной и понятным бонусом 500 ₽ после первой покупки.</p>
              </article>
              <article class="page-card">
                <h3>ВТБ</h3>
                <p>Онлайн-заявка, бесплатная карта и сильный welcome-оффер 1 000 ₽ при выполнении условия.</p>
              </article>
              <article class="page-card">
                <h3>Ozon Карта</h3>
                <p>Подходит тем, кто хочет быстро оформить бесплатный продукт под Ozon и базовые повседневные платежи.</p>
              </article>
              <article class="page-card">
                <h3>ОТП Карта</h3>
                <p>Онлайн-оформление удобно использовать, если вам интересен бонус 500 ₽ за оборот 15 000 ₽ за 30 дней.</p>
              </article>
            </div>`
      },
      {
        id: "how",
        title: "Как оформить карту онлайн",
        html: `
            <ol class="article-ordered">
              <li>Выберите карту под ваш сценарий, а не только по баннеру с максимальным кэшбэком.</li>
              <li>Откройте форму заявки и укажите базовые данные: ФИО, дату рождения, номер телефона.</li>
              <li>Подтвердите код из SMS или push.</li>
              <li>Выберите доставку или отделение, если банк предлагает оба варианта.</li>
              <li>После получения активируйте карту и выполните условие welcome-оффера, если хотите забрать бонус.</li>
            </ol>`
      },
      {
        id: "timing",
        title: "Сроки получения",
        html: `
            <p>Срок зависит от банка и города:</p>
            <ul class="article-list">
              <li>виртуальную карту иногда можно получить почти сразу;</li>
              <li>пластик часто доставляют в тот же день или на следующий, если город крупный;</li>
              <li>в небольших городах сроки обычно длиннее и зависят от курьерской сети.</li>
            </ul>`
      },
      {
        id: "requirements",
        title: "Что нужно для оформления",
        html: `
            <ul class="article-list">
              <li>паспорт гражданина РФ или иной документ по правилам конкретного банка;</li>
              <li>рабочий номер телефона для подтверждения;</li>
              <li>доступ к приложению или сайту банка;</li>
              <li>статус нового клиента, если вы рассчитываете на бонус за оформление.</li>
            </ul>
            <div class="content-note">
              <strong>Коммерческий смысл запроса:</strong> если вам важен быстрый старт и хороший оффер, обычно удобнее всего начинать с T-Bank, Альфы или ВТБ.
            </div>`
      }
    ],
    faq: [
      {
        q: "Можно ли заказать дебетовую карту полностью онлайн?",
        a: "Да. У большинства крупных банков заявка заполняется онлайн, а карту затем доставляют курьером или выдают в отделении."
      },
      {
        q: "Какая карта проще всего оформляется онлайн?",
        a: "Чаще всего пользователи отмечают T-Bank, Альфу и ВТБ как самые понятные по дистанционному оформлению варианты."
      },
      {
        q: "Когда лучше открывать карту: сразу с бонусом или без него?",
        a: "Если банк дает нормальный welcome-оффер без ухудшения тарифа, логично оформлять именно через такую ссылку."
      },
      {
        q: "Можно ли оформить несколько карт подряд?",
        a: "Да, но лучше делать это осознанно: под разные сценарии или офферы, а не просто ради количества заявок."
      }
    ],
    related: ["debit-card-bonus-1000", "best-debit-cards-2026", "which-debit-card-to-choose"]
  }
];

const pageMeta = Object.fromEntries(
  pages.map((page) => [
    page.slug,
    {
      heading: page.heading,
      excerpt: page.excerpt
    }
  ])
);

pages.forEach((page) => {
  const dir = path.join(root, page.slug);
  const file = path.join(dir, "index.html");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, renderPage(page, pageMeta), "utf8");
});

const urls = [
  { slug: "", priority: "1.0" },
  ...pages.map((page) => ({ slug: page.slug, priority: "0.85" }))
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(({ slug, priority }) => `  <url>
    <loc>${slug ? `${siteUrl}/${slug}/` : `${siteUrl}/`}</loc>
    <lastmod>2026-04-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`)
  .join("\n")}
</urlset>
`;

fs.writeFileSync(path.join(root, "sitemap.xml"), sitemap, "utf8");

console.log(`Generated ${pages.length} SEO pages and updated sitemap.xml`);
