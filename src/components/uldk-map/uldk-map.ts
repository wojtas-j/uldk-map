import { LitElement,} from "lit";
import { customElement, state } from "lit/decorators.js";
import L from "leaflet";
import eventBus from "../../event/eventBus";
import { UldkApi } from "../../uldk-api/uldk-api";
import { wktToGeoJSON } from "@terraformer/wkt";
import { i18nMixin } from "../../i18n/i18nMixin";

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
      this.geojsonLayer.clearLayers();
      this.geojsonLayer.addData(e.geojson);
      this.map?.fitBounds(this.geojsonLayer.getBounds(), { duration: 2 });
    });

    eventBus.on("search-by-fullid", (e: any) => {
      console.log(e);
      this.geojsonLayer.clearLayers();
      this.geojsonLayer.addData(e.geojson);
      this.map?.fitBounds(this.geojsonLayer.getBounds(), { duration: 2 });
    });

    eventBus.on("disable-map-click", (e: any) => {
      console.log("uldk-map:disable-map-click error: " + e);
      this.map?.removeEventListener("click");
    });
    eventBus.on("enable-map-click", (e: any) => {
      console.log("uldk-map:enable-map-click error: " + e);
      this.map?.on("click", async (e: L.LeafletMouseEvent) => {
       
        const wkt = await  this.uldkApi.getParcelByXY(`${e.latlng.lng},${e.latlng.lat}`)
        const geojson: any = wktToGeoJSON(wkt);
        this.geojsonLayer.clearLayers();
      this.geojsonLayer.addData(geojson);
      this.map?.fitBounds(this.geojsonLayer.getBounds(), { duration: 2 });
      });
    });
  };

  firstUpdated(props: any) {
    super.firstUpdated(props);
    this.initMap();
    this.basemap.addTo(this.map!);
    this.map!.addLayer(this.geojsonLayer);
    this.addListeners();
  }
}
