# Lovelace HTML
Копия карточки для удобной установки своих дополнений

1. добавлена глобальная переменная `hass`
2. добавлены в конфиг теги `script` и `style`
3. добавлены дни недели и месяцы для вывода даты, с помощью глобальных функций `getDayOfWeek` и `getMonth`
4. добавлен пак иконок из проекта [Majordomo](https://mjdm.ru/)
5. в шаблон добавлен парсер js переменных `[[<имя переменной>]]`. Переменные нужно предварительно поместить в массив `out['<имя переменной>']`

# Пример карточки-кнопки
```yaml
      - type: custom:html-card
        title: Domofon button
        style: |
          .domofon-button-container {
              position: fixed;
              height: 80px;
              width: 80px;
              background-color: rgba(249,229,91,0.9);
              border: 1px solid rgba(255,255,0,0.5);
              right: 10px;
              bottom: 10px;
              z-index: 1000;
              cursor: pointer;
              background-image: url(/hacsfiles/lovelace-html-card/images/common/i_domofon_on.png);
              background-repeat: no-repeat;
              background-position: center 6px;
          }
          .domofon-button-container div {
              margin-top: 50%;
              text-align: center;
              font: 100% Arial, Helvetica, sans-serif;
          }
        script: out['data'] = "Домофон включен"
        content: |
          <div class="domofon-button-container">
              <div>[[ data ]]</div>
          </div>
```

# Пример карточки-контейнера с текстом
```yaml
      - type: custom:html-card
        title: Tablet
        style: |
          .mycard {
              position: fixed;
              height: 100%;
              width: 100%;
              background-color: black;
              color: white;
              left: 0;
              top: 0;
          }
          .clock {
              text-align: center;
              margin-top: 20vh;
              font-size: 280px!important;
              font: 11px Arial, Helvetica, sans-serif;
          }
          .date {
              text-align: center;
              font-size: 70px!important;
              font: 11px Arial, Helvetica, sans-serif;
          }
          .weather {
              text-align: center;
              font-size: 70px!important;
              font: 11px Arial, Helvetica, sans-serif;
          }
        script: >
          const date = hass.states['sensor.date'].state; var d =
          date.split('-'); out['date'] = `${getDayOfWeek()}, ${d[2]}
          ${getMonth()} ${d[0]}`; const w =
          hass.states['weather.forecast_home_assistant'].attributes;
          out['weather'] =
          `${w.temperature}${w.temperature_unit},&nbsp;&nbsp;<span
          style="transform: rotate(${w.wind_bearing + 180}deg); display:
          inline-block;">↑</span>&nbsp;${w.wind_speed} км/ч`;
        content: |
          <div class="mycard">
              <div class="clock">[[ sensor.time ]]</div>
              <div class="date">[[ date ]]</div>
              <div class="weather">[[ weather ]]</div>
          </div>
```
# Ссылка на оригинальный проект
https://github.com/PiotrMachowski/lovelace-html-card
