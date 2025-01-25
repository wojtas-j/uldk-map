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

@customElement("uldk-id-tab")
export class UldkIdTab extends LitElement {
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
      Notification.show('Błąd podczas ładowania województw.', {
        position: 'bottom-center',
        duration: 3000,
        theme: "error"
      });
    }
  }

  render() {
    return html`
      <vaadin-combo-box
        id="voivodeship"
        label="Wybierz województwo"
        clear-button-visible
        item-label-path="name"
        item-value-path="teryt"
        @value-changed=${async (e: CustomEvent) => {
      const voivodeshipTeryt = e.detail.value;
      if (voivodeshipTeryt) {
        try {
          const counties = await this.uldkApi.getAdministrativeNames("Powiat", voivodeshipTeryt);
          this.countyNode.items = counties;
        } catch (error) {
          console.error("Error loading powiaty:", error);
          Notification.show('Błąd podczas ładowania powiatów.', {
            position: 'bottom-center',
            duration: 3000,
            theme: "error"
          });
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
    }}
      ></vaadin-combo-box>

      <vaadin-combo-box
        id="county"
        label="Wybierz powiat"
        clear-button-visible
        item-label-path="name"
        item-value-path="teryt"
        @value-changed=${async (e: CustomEvent) => {
      const countyTeryt = e.detail.value;
      if (countyTeryt) {
        try {
          const communes = await this.uldkApi.getAdministrativeNames("Gmina", countyTeryt);
          this.communeNode.items = communes;
        } catch (error) {
          console.error("Error loading gminy:", error);
          Notification.show('Błąd podczas ładowania gmin.', {
            position: 'bottom-center',
            duration: 3000,
            theme: "error"
          });
          this.communeNode.items = [];
        }
      } else {
        this.communeNode.items = [];
      }
      this.communeNode.value = "";
      this.regionNode.items = [];
      this.regionNode.value = "";
    }}
      ></vaadin-combo-box>

      <vaadin-combo-box
        id="commune"
        label="Wybierz gminę"
        clear-button-visible
        item-label-path="name"
        item-value-path="teryt"
        @value-changed=${async (e: CustomEvent) => {
      const communeTeryt = e.detail.value;
      if (communeTeryt) {
        try {
          const regions = await this.uldkApi.getAdministrativeNames("Region", communeTeryt);
          this.regionNode.items = regions;
        } catch (error) {
          console.error("Error loading regiony:", error);
          Notification.show('Błąd podczas ładowania regionów.', {
            position: 'bottom-center',
            duration: 3000,
            theme: "error"
          });
          this.regionNode.items = [];
        }
      } else {
        this.regionNode.items = [];
      }
      this.regionNode.value = "";
    }}
      ></vaadin-combo-box>

      <vaadin-combo-box
        id="region"
        label="Wybierz region"
        item-label-path="name"
        item-value-path="teryt"
        clear-button-visible
      ></vaadin-combo-box>

      <vaadin-text-field
        id="parcel"
        label="Podaj nr działki"
        clear-button-visible
      ></vaadin-text-field>

      <vaadin-button
        @click=${async () => {
      const voivodeship = this.voivodeshipNode.value;
      const county = this.countyNode.value;
      const commune = this.communeNode.value;
      const region = this.regionNode.value;
      const parcel = this.parcelNode.value.trim();

      if (voivodeship && county && commune && region && parcel) {
        const teryt: string = `${region}.${parcel}`;
        const parcelData: ParcelData | null = await this.uldkApi.getParcelById(teryt);
        if (parcelData) {
          const geojson: any = wktToGeoJSON(parcelData.geom_wkt);
          eventBus.dispatch("search-by-id", { geojson, parcelData });
        } else {
          Notification.show('Nie znaleziono działki.', {
            position: 'bottom-center',
            duration: 3000,
            theme: "error"
          });
        }
      } else {
        Notification.show('Formularz musi zostać uzupełniony', {
          position: 'bottom-center',
          duration: 3000,
          theme: "error"
        });
      }
    }}
      >Szukaj działkę</vaadin-button>
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
