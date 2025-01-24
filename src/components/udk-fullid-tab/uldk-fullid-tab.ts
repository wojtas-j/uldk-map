import "@vaadin/button";
import "@vaadin/combo-box";
import "@vaadin/text-field";
import { wktToGeoJSON } from "@terraformer/wkt";
import { LitElement, css, html } from "lit";
import { customElement, query, state} from "lit/decorators.js";
import { UldkApi } from "../../uldk-api/uldk-api";
import { Notification } from '@vaadin/notification';
import eventBus from "../../event/eventBus";


@customElement("uldk-fullid-tab")
export class UldkIdTab extends  LitElement {
    @state() uldkApi: UldkApi = new UldkApi();
 @query("#parcel-id")
 parcelIdNode: any

    render() {
        return html`<vaadin-text-field
        id="parcel-id"
        label="Identyfikator działki: "
        placeholder="Podaj pełny identyfikator działki"
        clear-button-visible
      ></vaadin-text-field>

      <vaadin-button
        @click=${async (e: any) => {
            console.log("ulkd-fullid-tab:click " + e);
          if (
            this.parcelIdNode.value != null
          ) {
            const teryt: string = `${this.parcelIdNode.value}`;
            const wkt = await this.uldkApi.getParcelById(teryt);
            const geojson: any = wktToGeoJSON(wkt);
            eventBus.dispatch("search-by-fullid", {geojson})
           
          } else {
            const notification = Notification.show('Formularz musi zostać uzupełniony', {
              position: 'bottom-center',
              duration:1000,
              theme:"error"
            });
            console.log("ulkd-fullid-tab:notification " + notification);
            
          }
        }}
        >Szukaj działkę</vaadin-button>`
    }
    static styles? = css`
    vaadin-text-field {
      width: 100%;
    }
  `;
}