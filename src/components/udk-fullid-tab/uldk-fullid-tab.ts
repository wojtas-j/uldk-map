import "@vaadin/button";
import "@vaadin/text-field";
import { wktToGeoJSON } from "@terraformer/wkt";
import { LitElement, css, html } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { UldkApi, ParcelData } from "../../uldk-api/uldk-api";
import { Notification } from '@vaadin/notification';
import eventBus from "../../event/eventBus";
import { i18nMixin } from "../../i18n/i18nMixin";
import { i18next } from "../../i18n/i18n";

@customElement("uldk-fullid-tab")
export class UldkFullIdTab extends i18nMixin(LitElement) {
    @state() uldkApi: UldkApi = new UldkApi();
    @query("#parcel-id")
    parcelIdNode!: HTMLInputElement;

    render() {
        return html`
            <vaadin-text-field
                    id="parcel-id"
                    label="${i18next.t("fullid-tab-label", "Identyfikator działki:")}"
                    placeholder="${i18next.t("fullid-tab-placeholder", "Podaj pełny identyfikator działki")}"
                    clear-button-visible
            ></vaadin-text-field>

            <vaadin-button
                    @click=${this.handleSearch}
            >
                ${i18next.t("fullid-tab-search-button", "Szukaj działkę")}
            </vaadin-button>
        `;
    }

    private async handleSearch() {
        const teryt: string = this.parcelIdNode.value.trim();
        if (teryt) {
            const parcelData: ParcelData | null = await this.uldkApi.getParcelById(teryt);
            if (parcelData) {
                const geojson: any = wktToGeoJSON(parcelData.geom_wkt);
                eventBus.dispatch("search-by-fullid", { geojson, parcelData });
            } else {
                Notification.show(i18next.t("fullid-tab-not-found", "Nie znaleziono działki."), {
                    position: 'bottom-center',
                    duration: 3000,
                    theme: "error"
                });
            }
        } else {
            Notification.show(i18next.t("fullid-tab-form-required", "Formularz musi zostać uzupełniony"), {
                position: 'bottom-center',
                duration: 3000,
                theme: "error"
            });
        }
    }

    static styles = css`
        vaadin-text-field {
            width: 100%;
        }

        vaadin-button {
            margin-top: 10px;
        }
    `;
}
