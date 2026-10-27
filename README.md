# Sabab Brand Bureau — заглушка

Одностраничный сайт на Next.js (App Router, TypeScript, CSS Modules — без
UI‑библиотек). Три слоя на всех экранах: шапка → три колонки текста →
гигантское слово «sabab», прижатое к низу.

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
npm run build && npm run start   # прод-сборка
npx tsc --noEmit                 # проверка типов
```

## Структура

```
app/
  (ru)/layout.tsx, page.tsx   → "/"      (отдельный root layout, lang="ru")
  uz/layout.tsx, page.tsx     → "/uz"    (отдельный root layout, lang="uz")
  en/layout.tsx, page.tsx     → "/en"    (отдельный root layout, lang="en")
  portfolio/route.ts          → "/portfolio"     (PDF, inline)
  services/route.ts           → "/services"      (PDF, inline)
  uz/portfolio/route.ts       → "/uz/portfolio"
  uz/services/route.ts        → "/uz/services"
  en/portfolio/route.ts       → "/en/portfolio"
  en/services/route.ts        → "/en/services"
  icon.svg                    → favicon ("s" кремовым на кирпичном)
  opengraph-image.tsx         → OG-картинка 1200×630 (генерируется из слова sabab)
  globals.css                 → токены, reset, reveal-анимации, reduced-motion
components/                   → Header, InfoGrid, SababWord, LangSwitcher, CustomCursor, …
lib/
  dictionary.ts                → все RU/UZ/EN тексты
  constants.ts                 → телефоны/соцсети/домен (см. "Плейсхолдеры")
  sababPaths.ts                 → path-данные слова "sabab", извлечены из logo.svg
  pdf.ts, links.ts
files/                         → PDF вне /public (отдаются только через route-хендлеры)
public/
  logo-full.svg                → логотип шапки ("sabab brand bureau")
  logo-mark.svg                 → слово "sabab" (тот же файл, что используется инлайново)
```

Три отдельных root layout (`app/(ru)/layout.tsx`, `app/uz/layout.tsx` и
`app/en/layout.tsx`) — это штатный приём Next.js для «нескольких root layout»
в одном App Router: только так у `/`, `/uz` и `/en` может быть разный
`<html lang="…">`.

## Куда класть файлы

**PDF** → `/files` (НЕ `/public`, чтобы файлы отдавались только через
route-хендлеры, а не по прямому URL):

```
files/
  portfolio-ru.pdf
  services-ru.pdf
  portfolio-uz.pdf   (опционально)
  services-uz.pdf    (опционально)
  portfolio-en.pdf   (опционально)
  services-en.pdf    (опционально)
```

Если `*-uz.pdf`/`*-en.pdf` нет — соответствующий route-хендлер автоматически
отдаёт RU-файл. Сейчас в `/files` лежат два валидных PDF-заглушки
(`portfolio-ru.pdf`, `services-ru.pdf`) — замените их на настоящие
презентации; UZ/EN-версии нарочно не созданы, чтобы сразу было видно, что
откат на RU работает.

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

## Плейсхолдеры — проверить перед продакшеном

В `lib/constants.ts` (с комментарием прямо в файле):
- **Домен** (`SITE_URL`, он же `metadataBase` для OG/canonical) — предположен
  как `sababbranding.com` по адресу почты. Поменять на реальный домен перед
  деплоем — иначе OG-картинка и canonical-ссылки будут указывать мимо.

## Деплой на Vercel

```bash
npm i -g vercel   # один раз
vercel             # из папки проекта → preview-деплой
vercel --prod      # прод-деплой
```

(Эквивалентно: залить репозиторий на GitHub и импортировать его на
vercel.com/new — тогда каждый PR будет получать свой preview-деплой.)

Перед первым прод-деплоем:
1. Положить настоящие PDF в `/files`.
2. Проверить/поправить плейсхолдеры выше.
3. Задать `NEXT_PUBLIC_VERCEL_ANALYTICS` не нужно — `@vercel/analytics`
   работает «из коробки» на Vercel; на других хостингах кастомные события
   `pdf_open` просто не будут никуда уходить (сам сайт при этом работает
   нормально).

### Домен

Project → Settings → Domains → добавить домен → прописать у регистратора
либо `A`-запись на `76.76.21.21`, либо `CNAME` на `cname.vercel-dns.com`
(Vercel подскажет точные записи после добавления домена). После
подтверждения обновить `SITE_URL` в `lib/constants.ts` на фактический домен.

## Проверено

- `npm run build` — чистая прод-сборка, `npx tsc --noEmit` — без ошибок.
- `/portfolio`, `/services`, `/uz/portfolio`, `/uz/services`,
  `/en/portfolio`, `/en/services` — отдают PDF (`Content-Type:
  application/pdf`, `Content-Disposition: inline`), `/uz/*` и `/en/*`
  корректно откатываются на RU-файл при отсутствии локализованной версии.
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
# sabab-website
