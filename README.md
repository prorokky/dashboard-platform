# Dashboard Platform

Dashboard Platform — frontend-платформа на Vue 3 с микрофронтенд-архитектурой.
Host-приложение объединяет два независимых модуля через Module Federation:

- **Dashboard** — обзор метаданных репозитория `prorokky/dashboard-platform`;
- **Cases** — единое рабочее пространство для коммитов, issues, pull requests,
  событий репозитория и запусков GitHub Actions.

Оба модуля используют публичный GitHub REST API и общую библиотеку компонентов
`platform-ui`.

## Возможности

### Dashboard

- сводка по репозиторию: ветка по умолчанию, активность, открытые задачи, stars,
  forks и watchers;
- профиль репозитория и основные даты;
- сигналы, требующие внимания: архивный или отключённый репозиторий, открытые
  issues/PR, отсутствие лицензии и topics;
- состояния загрузки, ошибки, повторный запрос и сохранение последних успешно
  загруженных данных при ошибке обновления.

### Cases

- объединение данных из commits, issues/PR, repository events и GitHub Actions;
- поиск и фильтрация по типу, статусу, автору и диапазону дат;
- сортировка, пагинация и панель подробностей выбранного сигнала;
- сводные метрики по открытой работе, сбоям workflow и участникам;
- экспорт текущей отфильтрованной выборки в CSV;
- частичная деградация: интерфейс продолжает работать, если доступна хотя бы одна
  из GitHub-точек данных.

## Архитектура

| Каталог | Роль | Адрес | Federation-контракт |
| --- | --- | --- | --- |
| `host-shell/` | Host, маршрутизация, навигация и error boundary | `http://127.0.0.1:8000` | подключает `dashboard/Dashboard` и `cases/Cases`, публикует `./NavBar` |
| `dashboard/` | Remote с обзором репозитория | `http://127.0.0.1:8001` | публикует `./Dashboard` |
| `cases/` | Remote с GitHub Cases | `http://127.0.0.1:8002` | публикует `./Cases` |
| `platform-ui/` | Общие компоненты и CSS-токены | — | подключается как локальная npm-зависимость |

Маршруты платформы:

- `/` — стартовая страница;
- `/dashboard` — Dashboard remote;
- `/cases` — Cases remote;
- неизвестные маршруты перенаправляются на `/`.

`host-shell` загружает `remoteEntry.js` модулей во время выполнения. Vue и
Vue Router объявлены shared-зависимостями. Каждый remote при этом можно открыть
отдельно на его собственном порту.

## Технологии

- Vue 3 и TypeScript;
- Vite;
- `@originjs/vite-plugin-federation`;
- Vue Router;
- Pinia;
- Axios и Fetch API;
- Vitest и Vue Test Utils;
- Playwright;
- ESLint, Oxlint и Prettier.

## Требования

- Node.js `^20.19.0` или `>=22.12.0`;
- npm;
- доступ к `api.github.com` для живых данных.

В репозитории нет корневого `package.json` и npm workspaces. У каждого пакета
собственные `package.json`, `package-lock.json` и `node_modules`.

## Установка

Из корня репозитория установите зависимости всех пакетов:

```sh
for package in platform-ui dashboard cases host-shell; do
  (cd "$package" && npm ci)
done
```

`platform-ui` подключён в приложениях через `file:../platform-ui`, поэтому изменения
в его исходниках сразу доступны локальным пакетам.

Для первого запуска e2e-тестов установите браузеры Playwright:

```sh
cd host-shell
npx playwright install
```

## Локальный запуск

Для работы всей платформы нужны три процесса. Сначала запустите remote-приложения,
затем host.

Терминал 1:

```sh
cd dashboard
npm run dev
```

Терминал 2:

```sh
cd cases
npm run dev
```

Терминал 3:

```sh
cd host-shell
npm run dev
```

После запуска откройте `http://127.0.0.1:8000`.

Remote-приложения используют собранный Federation bundle и `vite preview`:

- `dashboard`: перед стартом создаёт development build, затем параллельно следит
  за изменениями и обслуживает `dist`;
- `cases`: перед стартом создаёт development build и обслуживает `dist` без
  автоматической пересборки.

Чтобы разрабатывать `cases` с пересборкой, запустите дополнительный процесс:

```sh
cd cases
npm run build:watch
```

Перед открытием federated-маршрута убедитесь, что соответствующий remote запущен
и его `remoteEntry.js` доступен.

## Проверки

### Сборка и type-check

```sh
(cd dashboard && npm run build)
(cd cases && npm run build)
(cd host-shell && npm run build)
```

Сборка каждого приложения включает `vue-tsc` и Vite build. Результат создаётся в
соответствующем каталоге `dist/`.

### Unit-тесты

```sh
(cd host-shell && npm run test:unit -- --run)
(cd cases && npm run test:unit -- --run)
```

Unit-тесты покрывают host-компоненты и маршрутизацию, нормализацию GitHub-ответов,
а также фильтрацию Cases.

### End-to-end

Полный интеграционный набор запускается из `host-shell`:

```sh
cd host-shell
npm run test:e2e
```

Playwright автоматически поднимет оба remote-приложения и host. GitHub API в
тестах перехватывается, поэтому результат не зависит от сети и текущего состояния
репозитория.

Отдельные remote-приложения также имеют собственные e2e-наборы:

```sh
(cd dashboard && npm run test:e2e)
(cd cases && npm run test:e2e)
```

По умолчанию e2e-тесты выполняются в Chromium, Firefox и WebKit. Для быстрого
локального прогона только в Chromium:

```sh
cd host-shell
npm run test:e2e -- --project=chromium
```

### Линтинг и форматирование

Команды выполняются отдельно в нужном пакете:

```sh
npm run lint
npm run format
```

Обе команды изменяют файлы: линтеры запускаются с автоисправлением, а Prettier
перезаписывает форматируемые исходники.