# Стартовый шаблон webpack для верстки многостраничников

## Контакты

**E-mail:** [valeriasmyrnova@gmail.com](mailto:valeriasmyrnova@gmail.com)

**Telegram** [@smvaleria](https://t.me/smvaleria)

## Используемые технологии:

- NPM / Yarn
- Pug
- PostCss
- Babel
- SVG

> Перед установкой зависимостей и запуском проекта убедитесь, что у вас установлены 
>[Node.js & NPM](https://nodejs.org/en/download/current/), а так же [Yarn](https://yarnpkg.com/ru/docs/install)

## Чтобы развернуть проект необходимо:

```sh
$ git clone [ссылка на проект] // склонировать репозиторий
$ cd [папка проекта] // перейти в папку проекта
$ yarn install // устанавить зависимости
```

## Скрипты package.json:

| Скрипт | Назначение |
| ------ | ------ |
| dev | Запустит webpack-dev-server в режиме разработки c функцией hot-reload |
| build | Соберет проект для **production** (проект готов к загрузке на сервер) |


#### Чтобы запустить скрипт:
```sh
$ npm run имя_скрипта
```

##### Либо:
```sh
$ yarn имя_скрипта
```

## Добавить новую страницу

- В папке app/pug/pages создать новый *.pug файл
- В корне папки app создать *.js файл с таким же именем, как и *.pug предыдущего пункта
- В *.js добавить следующий код
```sh
import "./assets/styles/styles.pcss"; // добавляем файл со стилями

if (process.env.NODE_ENV === "development") {
  require("file-loader!./pug/pages/[your_file_name].pug"); // переносим pug                                                         
}                                                          //файл для поддержки ф-ции hot reload

import { test } from "./js/test"; // импортируем те js модули, которые нужны в данной сборке

test();
```
- В *.pug расширяем существующий layout по примеру уже созданных файлов или создаем кастомный

## Работа со сборкой

1. Pug
    - В папке app/pug/pages хранятся все будущие странички сайта(есть три примера)
    - В папку app/pug/layout добавлен пример layout
    - В папке app/pug/utils предлагается хранить все pug mixins (пример добавления svg,
        картинок), все новые миксины следует импортировать в файл index.pug
        , который импортирован в файл layout.
    - В папке app/pug/sections храним блоки всех переиспользуемых секций (header, footer)
2. PostCss
    - Все новые *.pcss блоки добавляем в app/assets/styles/blocks
    - Файл app/assets/styles/blocks/one.pcss является примером, как работать с svg, variables
    , mixins.pcss
    - В файле app/assets/styles/variables.json храним все css переменные проекта
    - В файл app/assets/styles/layout/base.pcss добавляем все общие стили для страниц
    - Файл app/assets/styles/layout/reset.pcss
     кастомный те, стили которыми пользуюсь из проекта в проект, можно удалить(удалить импорт и из app/assets/styles/styles.pcss)
    - Пример подключения кастомных шрифтов в сборку app/assets/styles/layout/font.pcss
3. Картинки
    - Все картинки храним в папке app/assets/images/content, сюда же помещаем фавикон с именем favicon.png
    - Все svg иконки проекта храним app/assets/images/icons
4. Js
    - Все новые модули js помещаем в папку app/js