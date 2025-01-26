import config from "./config";

export interface UldkItem {
  name: string;
  teryt: string;
}

export interface ParcelData {
  geom_wkt: string;
  voivodeship: string;
  county: string;
  commune: string;
  region: string;
  parcel: string;
  datasource: string;
  teryt: string;
}

export class UldkApi {
  constructor() {}

  public async getAdministrativeNames(
      type: string,
      teryt: string = ""
  ): Promise<UldkItem[]> {
    const { search_types_by_option } = config;

    const request = search_types_by_option[type].request;
    const result = search_types_by_option[type].result;

    const url: string = `https://uldk.gugik.gov.pl/?request=${request}&result=teryt,${result}&id=${teryt}`;
    try {
      let text: string = await fetch(url).then((r) => r.text());
      text = text.substring(1).trim();
      const arr: string[] = text.split("\n");
      const items: UldkItem[] = [];
      arr.forEach((item) => {
        const itemSplited: string[] = item.split("|");
        if (itemSplited.length >= 2) {
          items.push({ name: itemSplited[1], teryt: itemSplited[0] });
        }
      });
      return items;
    } catch (error) {
      console.error("Error fetching administrative names:", error);
      return [];
    }
  }

  public async getParcelById(teryt: string): Promise<ParcelData | null> {
    const url: string = `https://uldk.gugik.gov.pl/?request=GetParcelById&result=geom_wkt,voivodeship,county,commune,region,parcel,datasource,teryt&id=${teryt}&srid=4326`;
    try {
      let text: string = await fetch(url).then((r) => r.text());
      text = text.trim();

      const [header, data] = text.split(";");
      if (!data) {
        console.log("getParcelById data is null, header: " + header);
        return null;
      }

      const lines = data.split("\n");
      if (lines.length === 0) {
        return null;
      }

      const fields = lines[0].split("|");
      if (fields.length < 8) {
        return null;
      }

      const parcelData: ParcelData = {
        geom_wkt: fields[0].trim(),
        voivodeship: fields[1].trim(),
        county: fields[2].trim(),
        commune: fields[3].trim(),
        region: fields[4].trim(),
        parcel: fields[5].trim(),
        datasource: fields[6].trim(),
        teryt: fields[7].trim(),
      };

      return parcelData;
    } catch (error) {
      console.error("Error fetching parcel by ID:", error);
      return null;
    }
  }

  public async getParcelByXY(XY: string): Promise<ParcelData | null> {
    const url: string = `https://uldk.gugik.gov.pl/?request=GetParcelByXY&xy=${XY},4326&srid=4326&result=geom_wkt,voivodeship,county,commune,region,parcel,datasource,teryt`;
    try {
      let text: string = await fetch(url).then((r) => r.text());
      text = text.trim();

      const [header, data] = text.split(";");
      if (!data) {
        console.log("getParcelByXY data is null, header: " + header);
        return null;
      }

      const lines = data.split("\n");
      if (lines.length === 0) {
        return null;
      }

      const fields = lines[0].split("|");
      if (fields.length < 8) {
        return null;
      }

      const parcelData: ParcelData = {
        geom_wkt: fields[0].trim(),
        voivodeship: fields[1].trim(),
        county: fields[2].trim(),
        commune: fields[3].trim(),
        region: fields[4].trim(),
        parcel: fields[5].trim(),
        datasource: fields[6].trim(),
        teryt: fields[7].trim(),
      };

      return parcelData;
    } catch (error) {
      console.error("Error fetching parcel by XY:", error);
      return null;
    }
  }
}
