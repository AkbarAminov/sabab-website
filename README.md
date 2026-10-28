# Sabab Brand Bureau — заглушка

Одностраничный сайт на Next.js (App Router, TypeScript, CSS Modules — без
UI‑библиотек). Три слоя на всех экранах: шапка → три колонки текста →
гигантское слово «sabab», прижатое к низу.

Деплоится на **Cloudflare Workers** через `@opennextjs/cloudflare`: PDF —
в R2, статистика открытий — в D1 (подробности в разделе "Cloudflare: R2 и
D1" ниже).

> **Где лежит проект.** Исходно папка `sabab website` создавалась на
> `~/Desktop`, но `~/Desktop` на этой машине синхронизируется с iCloud,
> которое «облегчает» содержимое файлов (включая `node_modules`) —
> `npm install`/`next dev` там зависают на 0% CPU по 10+ минут
> (см. `~/Desktop/48sense` — та же история). Поэтому проект собран в
> `~/dev/sabab-website`, вне зоны синхронизации. Исходный
> `~/Desktop/sabab website/logo.svg` использован как источник для
> `/public/logo-mark.svg`; сам каталог на Desktop не трогался.
>
> Также: `~/Desktop` целиком оказался git‑репозиторием (`.git` лежит прямо в
> `~/Desktop`, затрагивая все личные файлы на столе). Этот проект — отдельный
> каталог вне того репозитория, так что `git init` здесь (если понадобится)
> никак на него не повлияет.

## Запуск локально

```bash
npm install
npm run dev
```

Открыть <http://localhost:3000> (RU), <http://localhost:3000/uz> (UZ) и
<http://localhost:3000/en> (EN). Язык переключается дропдауном в шапке.

```bash
npm run build && npm run start   # прод-сборка Next.js (без Cloudflare-биндингов)
npx tsc --noEmit                 # проверка типов
```

`npm run dev` и `npm run build`/`start` работают для обычной вёрстки/контента.
Но PDF-роуты, `/stats` и всё, что трогает R2/D1, нужно проверять через
**`npm run preview`** — он собирает приложение адаптером
[`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) и поднимает его
в `wrangler`, с локальными (файловыми, не настоящими) копиями R2/D1. Это и
есть «настоящий» рантайм, в котором сайт будет жить на Cloudflare Workers.

## Структура

```
app/
  (ru)/layout.tsx, page.tsx   → "/"      (отдельный root layout, lang="ru")
  uz/layout.tsx, page.tsx     → "/uz"    (отдельный root layout, lang="uz")
  en/layout.tsx, page.tsx     → "/en"    (отдельный root layout, lang="en")
  portfolio/route.ts          → "/portfolio"     (PDF из R2, inline)
  services/route.ts           → "/services"      (PDF из R2, inline)
  uz/portfolio/route.ts       → "/uz/portfolio"
  uz/services/route.ts        → "/uz/services"
  en/portfolio/route.ts       → "/en/portfolio"
  en/services/route.ts        → "/en/services"
  soon/layout.tsx, page.tsx   → "/soon"  (заглушка «скоро здесь», если PDF нет совсем)
  stats/layout.tsx, page.tsx  → "/stats" (счётчик открытий из D1, закрыт паролем)
  icon.svg                    → favicon ("s" кремовым на кирпичном)
  opengraph-image.tsx         → OG-картинка 1200×630 (генерируется из слова sabab)
  globals.css                 → токены, reset, reveal-анимации, reduced-motion
components/                   → Header, InfoGrid, SababWord, LangSwitcher, CustomCursor, …
lib/
  dictionary.ts                → все RU/UZ/EN тексты
  constants.ts                 → телефоны/соцсети/домен
  sababPaths.ts                 → path-данные слова "sabab", извлечены из logo.svg
  pdf.ts                        → читает PDF из R2 (binding FILES), пишет статистику в D1
  links.ts
files/                         → локальные копии PDF (см. "Cloudflare: R2 и D1" — в R2 их
                                   нужно загружать отдельно, эта папка в проде не читается)
public/
  logo-full.svg                → логотип шапки ("sabab brand bureau")
  logo-mark.svg                 → слово "sabab" (тот же файл, что используется инлайново)
  arrow.svg                    → стрелка в курсоре над словом sabab
  _headers                     → кеш-заголовки для статики Cloudflare (создан OpenNext-ом)
proxy.ts                       → Basic Auth-гейт для "/stats" (STATS_PASSWORD)
wrangler.jsonc                 → конфиг Cloudflare Workers (bindings: FILES, DB, …)
open-next.config.ts            → конфиг адаптера @opennextjs/cloudflare
migrations/                     → SQL-миграции D1 (таблица opens)
```

Три отдельных root layout (`app/(ru)/layout.tsx`, `app/uz/layout.tsx` и
`app/en/layout.tsx`) — это штатный приём Next.js для «нескольких root layout»
в одном App Router: только так у `/`, `/uz` и `/en` может быть разный
`<html lang="…">`. `/soon` и `/stats` — ещё два отдельных root layout того же
рода, им `<html lang>` не принципиален (служебные страницы).

## Куда класть файлы

**PDF теперь живут в Cloudflare R2**, не в репозитории (раньше лежали в
`/files` — эта папка осталась только как локальная рабочая копия перед
загрузкой, route-хендлеры её больше не читают). Подробно — в разделе
"Cloudflare: R2 и D1" ниже. Схема имён объектов в бакете:

```
portfolio-ru.pdf   (обязателен — это то, на что откатываются остальные локали)
services-ru.pdf    (обязателен)
portfolio-uz.pdf   (опционально, локализованная версия)
portfolio-en.pdf   (опционально)
services-uz.pdf    (опционально)
services-en.pdf    (опционально)
```

Если `*-uz.pdf`/`*-en.pdf` в бакете нет — соответствующий route-хендлер
автоматически отдаёт `*-ru.pdf`. Если нет и его — показывает `/soon`
("Скоро здесь"/"Coming soon"/"Tez orada" в зависимости от локали) вместо
ошибки.

**SVG-логотипы** → `/public`:
- `logo-full.svg` — логотип шапки. «sabab» в нём — те же контуры, что и в
  исходном `logo.svg`; подпись «brand bureau» дорисована текстом (системный
  sans-serif, т.к. самостоятельный SVG-файл, открытый через `<img>`, не
  видит шрифт Inter, подключённый на странице через `next/font`). Если
  понадобится пиксель-в-пиксель совпадение с брендовым начертанием —
  переведите «brand bureau» в контуры в Illustrator/Figma и замените файл.
- `logo-mark.svg` — то же слово «sabab», что и в `logo-full.svg`, отдельным
  файлом (для OG-картинки/фавикона и как самостоятельный ассет). На самой
  странице гигантское слово рендерится не через `<img src="logo-mark.svg">`,
  а инлайновыми `<path>` в `components/SababWord.tsx` — этого требует
  посимвольная интерактивность (каждая буква отдельно проваливается под
  курсором), а `<img>` не даёт достучаться до внутренностей SVG из JS.
  Источник обоих файлов — один и тот же `lib/sababPaths.ts`, так что они не
  могут разойтись.

## Cloudflare: R2 и D1

Сайт развёрнут на **Cloudflare Workers** через адаптер
[`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) (не Pages —
нужен полноценный Next.js с route-хендлерами и Proxy, а не статика). Два
биндинга, которые для этого нужны, нужно создать один раз:

```bash
npx wrangler login                        # один раз, открывает браузер

npx wrangler r2 bucket create sabab-files
npx wrangler d1 create sabab-db
```

Команда `wrangler d1 create` выведет `database_id` — скопируйте его в
`wrangler.jsonc`, в блок `d1_databases`, вместо
`REPLACE_WITH_D1_DATABASE_ID`. `r2_buckets`/`d1_databases` в `wrangler.jsonc`
уже настроены на имена `sabab-files`/`sabab-db` — сами бакет/база должны
называться так же (или поменяйте имена в `wrangler.jsonc` на свои).

Применить SQL-миграцию (создаёт таблицу `opens` для статистики) на настоящей,
удалённой базе:

```bash
npx wrangler d1 migrations apply sabab-db --remote
```

### Загрузка PDF в R2

Через `wrangler` (из `/files`, где лежат уже загруженные файлы):

```bash
npx wrangler r2 object put sabab-files/portfolio-ru.pdf --file=files/portfolio.pdf --remote
npx wrangler r2 object put sabab-files/services-ru.pdf --file=files/services.pdf --remote
```

Или через панель: dash.cloudflare.com → R2 → `sabab-files` → Upload — имя
объекта должно быть ровно `portfolio-ru.pdf`/`services-ru.pdf` (см. схему
имён в разделе "Куда класть файлы" выше). Локализованные версии грузятся
туда же под именами `portfolio-uz.pdf`, `portfolio-en.pdf` и т.п., когда они
появятся — код их подхватит сам, без правок.

### Секрет для /stats

`/stats` показывает счётчик открытий (файл/язык/страна) из D1 и закрыт Basic
Auth-паролем (`proxy.ts`), который сверяется с секретом `STATS_PASSWORD`:

```bash
npx wrangler secret put STATS_PASSWORD
# введёт пароль интерактивно, он не попадёт ни в wrangler.jsonc, ни в git
```

(Для локального `npm run preview` пароль читается из `.dev.vars`, который в
`.gitignore` — там уже лежит тестовый `dev-stats-local`, замените на свой.)

### Деплой

```bash
npm run preview    # собрать и проверить локально (localhost:8787)
npm run deploy      # собрать и задеплоить на Workers
```

### Домен

`sababbranding.com` **ещё не добавлен** в этот аккаунт Cloudflare (в нём пока
есть только `dizegnoagency.com`), поэтому Workers Custom Domains для него
работать не будет, пока зона не появится здесь:

1. Cloudflare Dashboard → **Add a site** → ввести `sababbranding.com` →
   выбрать план (Free подходит).
2. Cloudflare покажет пару NS-записей — прописать их у текущего регистратора
   домена (там, где он сейчас зарегистрирован/управляется) взамен текущих.
3. Подождать, пока зона станет **Active** в Cloudflare (обычно от нескольких
   минут до пары часов, зависит от TTL у регистратора).
4. После этого либо Cloudflare Dashboard → Workers & Pages →
   `sabab-website` → Settings → Domains & Routes → Add → `sababbranding.com`,
   либо вернуть в `wrangler.jsonc` блок:
   ```jsonc
   "routes": [
     { "pattern": "sababbranding.com", "custom_domain": true }
   ]
   ```
   и передеплоить (`npm run deploy`) — тогда DNS-запись и сертификат
   Cloudflare создаст сам.

До переноса зоны сайт уже доступен на `<worker>.workers.dev` сразу после
`npm run deploy`. `SITE_URL` в `lib/constants.ts` уже указывает на
`https://sababbranding.com` — менять не нужно, он станет рабочим, как только
домен подключится.

## Проверено

- `npm run build`/`npx tsc --noEmit` — без ошибок.
- `npm run preview` (локальный Workers-рантайм, локальные копии R2/D1):
  - `/`, `/en`, `/uz` — 200.
  - `/portfolio`, `/services`, `/uz/portfolio`, `/uz/services`,
    `/en/portfolio`, `/en/services` — отдают PDF из R2 (`Content-Type:
    application/pdf`, `Content-Disposition: inline`); с одним загруженным
    `*-ru.pdf` все локали корректно откатываются на него.
  - Удалённый из R2 объект → соответствующий роут отдаёт `307` на
    `/soon?locale=…`, страница `/soon` рендерится (200).
  - Каждое успешное открытие PDF пишет строку в D1 (`opens`); `/stats` без
    пароля — `401` с `WWW-Authenticate: Basic`, с неверным паролем — `401`,
    с верным (`STATS_PASSWORD`/`.dev.vars`) — `200` и показывает и сводку, и
    последние открытия.
- `/opengraph-image` — рендерит 1200×630 PNG с самим словом «sabab».
- Контраст кремового текста на кирпичном градиенте посчитан отдельно:
  7.6–11.7:1 для основного текста и 5.5–8:1 для `opacity: 0.8` — везде выше
  порога WCAG AA (4.5:1).
- Живой визуальный проход по 360/390/768/1280/1920 в этой сессии сделать не
  удалось — инструмент браузерной автоматизации (Claude in Chrome) завис на
  всех операциях с содержимым страницы (скриншот, чтение текста, консоль),
  при этом сам Next.js отдавал HTML/PDF/OG-картинку корректно через `curl` —
  похоже на сбой моста самого расширения, а не на проблему страницы.
  **Стоит прогнать `npm run dev` и визуально проверить все 5 ширин самим**,
  особенно: помещается ли шапка+колонки+sabab без скролла на 1280/1920, и
  насколько сильно обрезается слово «sabab» снизу на 360/390.

## Известные упрощения

- Доступность: фокус везде выглядит как hover (общее правило
  `:focus-visible` + те же классы, что и `:hover`), кроме слова «sabab»:
  там при фокусе клавиатурой показывается обычная кремовая обводка, а не
  повтор ховер-плашки курсора (у плашки нет смысла без позиции курсора).
- `proxy.ts` (пароль для `/stats`) использует Node.js-рантайм прокси —
  `wrangler`/OpenNext при сборке явно помечает эту поддержку как
  экспериментальную ("Node.js middleware support is experimental in
  cloudflare"). Работает в проверке через `npm run preview`, но если после
  реального деплоя `/stats` будет вести себя странно — это первое, что стоит
  проверить (см. https://opennext.js.org/cloudflare).
- `/stats` — простой Basic Auth на один общий пароль (без логина/ролей) и
  без пагинации лога открытий (последние 50). Этого достаточно для
  внутреннего счётчика, но не для публичной аналитики.
- `@vercel/analytics` (`pdf_open` события) включается только на хостинге
  Vercel — на Cloudflare Workers эти события никуда не уходят (сам сайт при
  этом работает нормально). Если нужна аналитика на Cloudflare — переносить
  на Cloudflare Web Analytics или собственные события в D1 (как уже сделано
  для открытий PDF).
