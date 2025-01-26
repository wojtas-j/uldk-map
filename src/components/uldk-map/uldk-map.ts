import { LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import L from "leaflet";
import eventBus from "../../event/eventBus";
import { UldkApi, ParcelData } from "../../uldk-api/uldk-api";
import { wktToGeoJSON } from "@terraformer/wkt";
import { i18nMixin } from "../../i18n/i18nMixin";
import { Notification } from '@vaadin/notification';
import { i18next } from "../../i18n/i18n";

@customElement("uldk-map")
export class UldkMap extends i18nMixin(LitElement) {
  @state() uldkApi: UldkApi = new UldkApi();
  @state() map?: L.Map;
  @state() basemap: L.TileLayer = new L.TileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "OpenStreetMap",
      }
  );

  @state() geojsonLayer: L.GeoJSON = new L.GeoJSON(undefined);

  initMap = (): void => {
    this.map = new L.Map("map", {
      center: new L.LatLng(51.2362345, 22.5014295),
      zoom: 18,
    });
  };

  addListeners = (): void => {
    eventBus.on("search-by-id", (e: any) => {
      this.displayParcel(e.geojson, e.parcelData);
    });

    eventBus.on("search-by-fullid", (e: any) => {
      this.displayParcel(e.geojson, e.parcelData);
    });

    eventBus.on("disable-map-click", () => {
      this.map?.off("click");
    });

    eventBus.on("enable-map-click", () => {
      this.map?.on("click", this.onMapClick);
    });
  };

  onMapClick = async (e: L.LeafletMouseEvent) => {
    const XY = `${e.latlng.lng},${e.latlng.lat}`;
    const parcelData: ParcelData | null = await this.uldkApi.getParcelByXY(XY);
    if (parcelData) {
      const geojson: any = wktToGeoJSON(parcelData.geom_wkt);
      this.displayParcel(geojson, parcelData);
      eventBus.dispatch("parcel-selected", { geojson, parcelData });
    } else {
      Notification.show(
          i18next.t("map-parcel-not-found", "Nie znaleziono działki w tym miejscu."), {
        position: 'bottom-center',
        duration: 3000,
        theme: "error"
      });
    }
  };

  displayParcel = (geojson: any, parcelData: ParcelData) => {
    this.geojsonLayer.clearLayers();
    this.geojsonLayer.addData(geojson);
    this.map?.fitBounds(this.geojsonLayer.getBounds(), { duration: 2 });
    eventBus.dispatch("parcel-data", { parcelData });
  };

  firstUpdated(props: any) {
    super.firstUpdated(props);
    this.initMap();
    this.basemap.addTo(this.map!);
    this.map!.addLayer(this.geojsonLayer);
    this.addListeners();
  }
}
