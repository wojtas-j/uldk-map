import { wktToGeoJSON } from "@terraformer/wkt";
import "@vaadin/button";
import "@vaadin/combo-box";
import { Notification } from '@vaadin/notification';
import "@vaadin/text-field";
import L from "leaflet";
import { LitElement, css, html } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import eventBus from "../../event/eventBus";
import { UldkApi, UldkItem } from "../../uldk-api/uldk-api";


@customElement("uldk-id-tab")
export class UldkIdTab extends LitElement {
  @property({ type: Object }) map?: L.Map;
 
  @state() uldkApi: UldkApi = new UldkApi();
  @query("#voivodeship")
  voivodeshipNode: any;
  @query("#county")
  countyNode: any;
  @query("#commune")
  communeNode: any;
  @query("#region")
  regionNode: any;
  @query("#parcel")
  parcelNode: any;

  firstUpdated(props: any) {
    super.firstUpdated(props);
  }

  render() {
    return html`
      <vaadin-combo-box
        id="voivodeship"
        label="Wybierz województwo"
        clear-button-visible
        item-label-path="name"
        item-value-path="teryt"
        .dataProvider=${async (_params: any, callback: any) => {
          const data: UldkItem[] = await this.uldkApi.getAdministrativeNames(
            "Wojewodztwo"
          );
          callback(data, data.length);
        }}
        @change=${async (e: any) => {
          this.countyNode.items = await this.uldkApi.getAdministrativeNames(
            "Powiat",
            e.target.value
          );
        }}
        @selected-item-changed=${() => {
          this.countyNode.value = "";
          this.countyNode.items = [];
          this.countyNode.selectedItem = undefined;
        }}
      ></vaadin-combo-box>
      <vaadin-combo-box
        id="county"
        label="Wybierz powiat"
        clear-button-visible
        item-label-path="name"
        item-value-path="teryt"
        @change=${async (e: any) => {
          this.communeNode.items = await this.uldkApi.getAdministrativeNames(
            "Gmina",
            e.target.value
          );
        }}
        @selected-item-changed=${() => {
          this.communeNode.value = "";
          this.communeNode.items = [];
          this.communeNode.selectedItem = undefined;
        }}
      ></vaadin-combo-box>
      <vaadin-combo-box
        id="commune"
        label="Wybierz gminę"
        clear-button-visible
        item-label-path="name"
        item-value-path="teryt"
        @change=${async (e: any) => {
          this.regionNode.items = await this.uldkApi.getAdministrativeNames(
            "Region",
            e.target.value
          );
        }}
        @selected-item-changed=${() => {
          this.regionNode.value = "";
          this.regionNode.items = [];
          this.regionNode.selectedItem = undefined;
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
          if (
            this.voivodeshipNode.value !== "" &&
            this.countyNode.value !== "" &&
            this.communeNode.value !== null &&
            this.regionNode.value !== null &&
            this.parcelNode.value !== ""
          ) {
            const teryt: string = `${this.regionNode.value}.${this.parcelNode.value}`;
            const wkt = await this.uldkApi.getParcelById(teryt);
            const geojson: any = wktToGeoJSON(wkt);
            eventBus.dispatch("search-by-id", {geojson})
           
          } else {
            const notification = Notification.show('Formularz musi zostać uzupełniony', {
              position: 'bottom-center',
              duration:1000,
              theme:"error"
            });
            console.log("ID-TABS Notification" + notification);
          }
        }}
        >Szukaj działkę</vaadin-button
      >
    `;
  }

  static styles? = css`
    vaadin-combo-box {
      width: 100%;
    }

    vaadin-text-field {
      width: 100%;
    }
  `;
}
