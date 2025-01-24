import config from "./config";

export interface UldkItem {
    name: string;
    teryt: string;
}

export class UldkApi{
  constructor() {}

  public async getAdministrativeNames(
      type: string,
      teryt: string = ""
  ): Promise<UldkItem[]> {
    const {search_types_by_option} = config;

    const request = search_types_by_option[type].request
    const result = search_types_by_option[type].result

    const url: any = `https://uldk.gugik.gov.pl/?request=${request}&result=teryt,${result}&id=${teryt}`;
    let text: string = await fetch(url).then((r) => r.text());
    text = text.substring(1).trim();
    const arr: string[] = text.split("\n");
    const items: UldkItem[] = [];
    arr.forEach((item) => {
      const itemSplited: string[] = item.split("|");
      items.push({ name: itemSplited[1], teryt: itemSplited[0] });
    });
    return items;
  }

  public async getParcelById(teryt: string): Promise<string> {
    const url: string = `https://uldk.gugik.gov.pl/?request=GetParcelById&result=geom_wkt&id=${teryt}&srid=4326`;
    let text: string = await fetch(url).then((r) => r.text());
    text = text.substring(1).trim();
    const wkt: string = (text.includes(";") ? text.split(";")[1] : text)
        ?.trim()
        .split("\n")[0];
    if (wkt.substring(1).trim() == "brak wyników") {
      return "";
    } else {
      return wkt;
    }
  }

  public async getParcelByXY(XY: string): Promise<string> {
    const url: string = `https://uldk.gugik.gov.pl/?request=GetParcelByXY&result=geom_wkt&xy=${XY},4326&srid=4326`;
    let text: string = await fetch(url).then((r) => r.text());
    text = text.substring(1).trim();
    const wkt: string = (text.includes(";") ? text.split(";")[1] : text)
        ?.trim()
        .split("\n")[0];
    if (wkt.substring(1).trim() == "brak wyników") {
      return "";
    } else {
      return wkt;
    }
  }
}

