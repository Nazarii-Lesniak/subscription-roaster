# Subscription Roaster

Міні застосунок Next.js App Router для обліку підписок, оцінки витрат і жартівливого «roast» бюджету.

## Запуск

Потрібні Node.js та npm. Версії основних пакетів оголошені в `package.json` відповідно до заданого стеку: Next.js App Router, React 19, TypeScript 7, Tailwind CSS 4.

```bash
npm install
npm run dev
```

Відкрийте адресу, яку покаже Next.js (типово `http://localhost:3000`). Для production збірки використовуйте `npm run build`, для запуску готової збірки — `npm start`.

## Структура

- `app/page.tsx` — Server Component, що підключає клієнтський dashboard.
- `components/dashboard.tsx` — композиція сторінки та взаємодія між областями UI.
- `components/subscription-form.tsx` — RHF/Zod форма, пошук сервісів і додавання підписок.
- `components/subscription-list.tsx` — список, редагування ціни й даних, видалення.
- `components/i18n-provider.tsx`, `components/theme-provider.tsx` — прості контексти мови та теми.
- `hooks/use-subscriptions.ts` — клієнтський стан, розрахунок місячної суми та синхронізація з localStorage.
- `hooks/use-debounce.ts` — затримка пошукового запиту на 500 мс.
- `lib/search.ts`, `lib/storage.ts`, `lib/roast.ts` — адаптери FreeSerp, Clearbit/storage та правила roast.
- `app/globals.css` — стилі, палітра Tailwind v4 `@theme inline`, адаптивність і reduced-motion.

## Поведінка та примітки

- Дані та тема зберігаються лише в браузері користувача. Обліковий запис або синхронізація між пристроями не налаштовані.
- Пошук виконується безпосередньо з браузера через FreeSerp. Код нормалізує типові поля `organic`, `results` або масив результатів; якщо API змінить формат, адаптуйте `lib/search.ts`.
- Clearbit URL будується з домену вибраного результату. Якщо логотип не завантажиться, картка показує тематичну іконку Lucide.
- Ціна вводиться в USD. Щорічна ціна нормалізується до місячного еквівалента в підсумку та roast.
- Для особистих посилань GitHub і LinkedIn замініть URL у `components/dashboard.tsx`.
- Каталог жартів у `lib/roast.ts` має три приклади для кожного діапазону від $100 до $1,000; можна доповнити масиви до десяти жартів.
