import { wktToGeoJSON } from "@terraformer/wkt";
import "@vaadin/button";
import "@vaadin/combo-box";
import { Notification } from '@vaadin/notification';
import "@vaadin/text-field";
import L from "leaflet";
import { LitElement, css, html } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import eventBus from "../../event/eventBus";
import { UldkApi, ParcelData, UldkItem } from "../../uldk-api/uldk-api";
import { i18nMixin } from "../../i18n/i18nMixin";
import { i18next } from "../../i18n/i18n";

@customElement("uldk-id-tab")
export class UldkIdTab extends i18nMixin(LitElement) {
  @property({ type: Object }) map?: L.Map;

  @state() uldkApi: UldkApi = new UldkApi();

  @query("#voivodeship")
  voivodeshipNode!: HTMLVaadinComboBoxElement;
  @query("#county")
  countyNode!: HTMLVaadinComboBoxElement;
  @query("#commune")
  communeNode!: HTMLVaadinComboBoxElement;
  @query("#region")
  regionNode!: HTMLVaadinComboBoxElement;
  @query("#parcel")
  parcelNode!: HTMLVaadinTextFieldElement;

  firstUpdated(props: any) {
    super.firstUpdated(props);
    this.loadVoivodeships();
  }

  async loadVoivodeships() {
    try {
      const data: UldkItem[] = await this.uldkApi.getAdministrativeNames("Wojewodztwo");
      this.voivodeshipNode.items = data;
    } catch (error) {
      console.error("Error loading voivodeships:", error);
      Notification.show(
          i18next.t("id-tab-error-loading-voivodeships", "Błąd podczas ładowania województw."),
          {
            position: 'bottom-center',
            duration: 3000,
            theme: "error"
          }
      );
    }
  }

  async handleVoivodeshipChange(e: CustomEvent) {
    const voivodeshipTeryt = e.detail.value;
    if (voivodeshipTeryt) {
      try {
        const counties = await this.uldkApi.getAdministrativeNames("Powiat", voivodeshipTeryt);
        this.countyNode.items = counties;
      } catch (error) {
        console.error("Error loading counties:", error);
        Notification.show(
            i18next.t("id-tab-error-loading-counties", "Błąd podczas ładowania powiatów."),
            {
              position: 'bottom-center',
              duration: 3000,
              theme: "error"
            }
        );
        this.countyNode.items = [];
      }
    } else {
      this.countyNode.items = [];
    }
    this.countyNode.value = "";
    this.communeNode.items = [];
    this.communeNode.value = "";
    this.regionNode.items = [];
    this.regionNode.value = "";
  }

  async handleCountyChange(e: CustomEvent) {
    const countyTeryt = e.detail.value;
    if (countyTeryt) {
      try {
        const communes = await this.uldkApi.getAdministrativeNames("Gmina", countyTeryt);
        this.communeNode.items = communes;
      } catch (error) {
        console.error("Error loading communes:", error);
        Notification.show(
            i18next.t("id-tab-error-loading-communes", "Błąd podczas ładowania gmin."),
            {
              position: 'bottom-center',
              duration: 3000,
              theme: "error"
            }
        );
        this.communeNode.items = [];
      }
    } else {
      this.communeNode.items = [];
    }
    this.communeNode.value = "";
    this.regionNode.items = [];
    this.regionNode.value = "";
  }

  async handleCommuneChange(e: CustomEvent) {
    const communeTeryt = e.detail.value;
    if (communeTeryt) {
      try {
        const regions = await this.uldkApi.getAdministrativeNames("Region", communeTeryt);
        this.regionNode.items = regions;
      } catch (error) {
        console.error("Error loading regions:", error);
        Notification.show(
            i18next.t("id-tab-error-loading-regions", "Błąd podczas ładowania regionów."),
            {
              position: 'bottom-center',
              duration: 3000,
              theme: "error"
            }
        );
        this.regionNode.items = [];
      }
    } else {
      this.regionNode.items = [];
    }
    this.regionNode.value = "";
  }

  async handleSearch() {
    const voivodeship = this.voivodeshipNode.value;
    const county = this.countyNode.value;
    const commune = this.communeNode.value;
    const region = this.regionNode.value;
    const parcel = this.parcelNode.value.trim();

    if (voivodeship && county && commune && region && parcel) {
      const teryt: string = `${region}.${parcel}`;
      try {
        const parcelData: ParcelData | null = await this.uldkApi.getParcelById(teryt);
        if (parcelData) {
          const geojson: any = wktToGeoJSON(parcelData.geom_wkt);
          eventBus.dispatch("search-by-id", { geojson, parcelData });
        } else {
          Notification.show(
              i18next.t("id-tab-error-parcel-not-found", "Nie znaleziono działki."),
              {
                position: 'bottom-center',
                duration: 3000,
                theme: "error"
              }
          );
        }
      } catch (error) {
        console.error("Error searching parcel:", error);
        Notification.show(
            i18next.t("id-tab-error-searching-parcel", "Wystąpił błąd podczas wyszukiwania działki."),
            {
              position: 'bottom-center',
              duration: 3000,
              theme: "error"
            }
        );
      }
    } else {
      Notification.show(
          i18next.t("id-tab-error-form-required", "Formularz musi zostać uzupełniony"),
          {
            position: 'bottom-center',
            duration: 3000,
            theme: "error"
          }
      );
    }
  }

  render() {
    return html`
      <vaadin-combo-box
        id="voivodeship"
        label="${i18next.t("id-tab-label-voivodeship", "Wybierz województwo")}"
        clear-button-visible
        item-label-path="name"
        item-value-path="teryt"
        @value-changed=${this.handleVoivodeshipChange}
      ></vaadin-combo-box>

      <vaadin-combo-box
        id="county"
        label="${i18next.t("id-tab-label-county", "Wybierz powiat")}"
        clear-button-visible
        item-label-path="name"
        item-value-path="teryt"
        @value-changed=${this.handleCountyChange}
      ></vaadin-combo-box>

      <vaadin-combo-box
        id="commune"
        label="${i18next.t("id-tab-label-commune", "Wybierz gminę")}"
        clear-button-visible
        item-label-path="name"
        item-value-path="teryt"
        @value-changed=${this.handleCommuneChange}
      ></vaadin-combo-box>

      <vaadin-combo-box
        id="region"
        label="${i18next.t("id-tab-label-region", "Wybierz region")}"
        item-label-path="name"
        item-value-path="teryt"
        clear-button-visible
      ></vaadin-combo-box>

      <vaadin-text-field
        id="parcel"
        label="${i18next.t("id-tab-label-parcel", "Podaj nr działki")}"
        clear-button-visible
      ></vaadin-text-field>

      <vaadin-button
        @click=${this.handleSearch}
      >
        ${i18next.t("id-tab-search-button", "Szukaj działkę")}
      </vaadin-button>
    `;
  }

  static styles = css`
    vaadin-combo-box, vaadin-text-field {
      width: 100%;
    }

    vaadin-button {
      margin-top: 10px;
      width: 100%;
    }
  `;
}
