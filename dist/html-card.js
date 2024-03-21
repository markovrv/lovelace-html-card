const TEMPLATE_REGEX = /\[\[.*?\]\]/gm;

function getDayOfWeek(date) {
    const dayOfWeek = new Date(date).getDay();
    return isNaN(dayOfWeek) ? null : ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'][dayOfWeek];
}

function getMonth(date) {
    const month = new Date(date).getMonth();
    return isNaN(month) ? null : [ 'января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'][month];
}

class HtmlCard extends HTMLElement {

    static get properties() {
        return {
            _config: {},
            _hass: {},
        };
    }

    set hass(hass) {
        const oldHass = this._hass;
        this._hass = hass;
        if (this.shouldUpdate(oldHass)) {
            this.render();
        }
    }

    shouldUpdate(oldHass) {
        if (oldHass) {
            let should = false;
            this._entities.forEach(entity => {
                should = should || oldHass.states[entity] !== this._hass.states[entity]
                    || oldHass.states[entity].attributes !== this._hass.states[entity].attributes
            });
            return should;
        }
        return true;
    }

    setConfig(config) {
        if (!config.content) {
            throw new Error("You need to define 'content' in your configuration.")
        }
        let entities = [];
        let m;
        while ((m = TEMPLATE_REGEX.exec(config.content)) !== null) {
            if (m.index === TEMPLATE_REGEX.lastIndex) {
                TEMPLATE_REGEX.lastIndex++;
            }
            m.forEach(match => {
                let e = match.replace("[[", "").replace("]]", "").replace(/\s/gm, "");
                let split = e.split(".");
                let dots = split.length - 1;
                if (dots > 0) {
                    let entity_id = split[0] + "." + split[1];
                    entities.push(entity_id);
                }
            });
        }
        this._entities = entities;
        this._config = config;
        this.render();
    }

    render() {
        if (!this._config || !this._hass) {
            return ``;
        }
        window.hass = this._hass;

        var out = [];

        if (this._config.script) eval(this._config.script);

        let header = ``;
        let style = ``;
        let content = this._config.content;
        let outputContent = content.replace(/\r?\n|\r/g, "");
        let m;
        while ((m = TEMPLATE_REGEX.exec(content)) !== null) {
            if (m.index === TEMPLATE_REGEX.lastIndex) {
                TEMPLATE_REGEX.lastIndex++;
            }
            m.forEach(match => {
                let e = match.replace("[[", "").replace("]]", "").replace(/\s/gm, "");
                let split = e.split(".");
                let dots = split.length - 1;
                let output;
                if (dots === 0 && out[split[0]] != undefined) {
                    output = out[split[0]];
                } else if (dots === 1 || dots === 2 && split[2] === "state") {
                    let id = split[0] + "." + split[1];
                    output = this._hass.states[id].state;
                } else if (dots === 3 && split[2] === "attributes") {
                    let id = split[0] + "." + split[1];
                    let attribute = split[3];
                    output = this._hass.states[id].attributes[attribute];
                } else {
                    output = match;
                }
                outputContent = outputContent.replace(match, output);
            });
        }
        if (this._config.title)
            header = `<div class="card-header" style="padding: 8px 0 16px 0;"><div class="name">${this._config.title}</div></div>`;
        if (this._config.style)
            style = `<style>${this._config.style}</style>`;
        this.innerHTML = `<ha-card id="htmlCard" style="padding: 16px">${style}${header}<div>${outputContent}</div></ha-card>`;
    }

    getCardSize() {
        return 1;
    }
}

customElements.define('html-card', HtmlCard);
