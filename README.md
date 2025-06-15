# Проектная работа 11-го спринта

[Макет](<https://www.figma.com/file/vIywAvqfkOIRWGOkfOnReY/React-Fullstack_-Проектные-задачи-(3-месяца)_external_link?type=design&node-id=0-1&mode=design>)

[Чеклист](https://www.notion.so/praktikum/0527c10b723d4873aa75686bad54b32e?pvs=4)

## Приложение позволяет:

- Добавлять, удалять и комбинировать ингредиенты для создания индивидуального заказа
- Создавать учетную запись пользователя, изменять данные профиля, входить в систему и выходить из нее
- После входа в систему и создания заказа пользователи могут просматривать свои заказы и детали заказов в разделе истории заказов своего профиля
- Неаутентифицированные пользователи имеют доступ к ленте общих заказов
- Пользователи могут менять свой пароль или запрашивать восстановление пароля для входа в свой профиль

## Основные технологии и библиотеки:

- React
- Redux Toolkit
- React Router DOM
- TypeScript
- Webpack
- Jest
- Cypress
- Storybook
- React Redux
- ESLint
- Prettier
- Babel
  
![в гиф](https://github.com/user-attachments/assets/098255f9-1553-4e93-80d4-a62eb560819f)

## Запуск проекта

1.  **Клонируйте репозиторий:**

    ```bash
    git clone <https://github.com/foorster/stellar-burgers.git>
    cd <stellar-burgers>
    ```

2.  **Установите зависимости:**

    ```bash
    npm install
    ```

3.  **Настройте переменные окружения:**

    - Создайте файл `.env` в корне проекта.
    - Скопируйте значения из `.env.example`.
    - Замените `<YOUR_API_URL>` на ваш URL для API (он указан в `.env.example`).

4.  **Запустите проект:**

    ```bash
    npm start  # Запуск development сервера с Webpack
    ```

    Приложение будет доступно по адресу `http://localhost:4000`.

## Тестирование и линтинг

- **Модульные тесты:**

  ```bash
  npm test  # Запуск Jest тестов
  ```

  Модульные тесты написаны с использованием Jest.

- **E2E тесты:**

  ```bash
  npm run cypress:open  # Запуск Cypress UI для E2E тестов
  ```

  E2E тесты написаны с использованием Cypress.

- **Линтинг:**

  ```bash
  npm run lint  # Запуск ESLint для проверки кода
  npm run lint:fix # Запуск ESLint с автоматическим исправлением ошибок
  ```

- **Форматирование:**
  ```bash
  npm run format  # Запуск Prettier для форматирования кода
  ```

## Storybook

- Для запуска Storybook (если используется для создания UI компонентов):
  ```bash
  npm run storybook  # Запуск Storybook development server
  npm run build-storybook  # Сборка Storybook
  ```
