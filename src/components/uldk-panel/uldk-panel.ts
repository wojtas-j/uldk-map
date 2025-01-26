import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "@vaadin/tabsheet";
import "@vaadin/tabs";
import "../uldk-id-tab";
import "../udk-fullid-tab";
import "../uldk-metric-panel";
import eventBus from "../../event/eventBus";
import { i18nMixin } from "../../i18n/i18nMixin";
import { i18next } from "../../i18n/i18n";
import { ParcelData } from "../../uldk-api/uldk-api";

@customElement("uldk-panel")
export class UldkPanel extends i18nMixin(LitElement) {
  @property({ type: Object }) map?: L.Map;
  @state() parcelData?: ParcelData;

  constructor() {
    super();
    eventBus.on("parcel-data", (e: any) => {
      this.parcelData = e.parcelData;
    });
  }

  render() {
    return html`
            <div class="language-selector">
                <h4>ULDK API</h4>
                <a 
                href="javascript:;" 
                class="lang lang-en"
                @click=${(e: any) => {
      if(e.target.classList.contains("lang-en")) {
        e.target.classList.remove("lang-en");
        e.target.classList.add("lang-pl");
        i18next.changeLanguage("en", ()=> {});
      } else {
        e.target.classList.remove("lang-pl");
        e.target.classList.add("lang-en");
        i18next.changeLanguage("pl", ()=> {});
      }
    }}> </a>
            </div>
            <vaadin-tabsheet
                @selected-changed=${(e: any) => {
      const tabId: number = e.detail.value;
      switch (tabId) {
        case 0:
        case 1:
          eventBus.dispatch("disable-map-click", {});
          break;
        case 2:
          eventBus.dispatch("enable-map-click", {});
          break;
        default:
          break;
      }
    }}
            >
                <vaadin-tabs slot="tabs">
                    <vaadin-tab id="id-tab">
                        ${i18next.t("id-tab-name", "Identyfikator")}
                    </vaadin-tab>
                    <vaadin-tab id="full-id-tab">Pełny identyfikator</vaadin-tab>
                    <vaadin-tab id="coords-tab">Współrzędne</vaadin-tab>
                </vaadin-tabs>
                <div tab="id-tab">
                    <uldk-id-tab .map=${this.map}></uldk-id-tab>
                </div>
                <div tab="full-id-tab">
                    <uldk-fullid-tab></uldk-fullid-tab>
                </div>
                <div tab="coords-tab">
                    Współrzędne
                </div>
            </vaadin-tabsheet>
            <uldk-metric-panel .parcelData=${this.parcelData}></uldk-metric-panel>
        `;
  }

  static styles = css`
    :host {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 10px;
      background-color: rgba(255, 255, 255, 0.9);
      width: 400px;
      height: 94%;
      overflow: auto;
    }

    h4 {
      text-align: center;
    }
    .language-selector {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 30px 20px;
    }

    .language-selector .lang {
      width:27px;
      height:20px;
      background-repeat: no-repeat;
      background-size: contain;
    }

    .language-selector .lang-en {
      background-image: url("./src/img/icons/flag-uk.svg")
    }
    .language-selector .lang-pl {
      background-image: url("./src/img/icons/flag-pl.svg")
    }

    uldk-metric-panel {
      margin-top: 20px;
    }
  `;
}
