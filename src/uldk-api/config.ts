export default {
  search_types_by_option: {
    Wojewodztwo: {
      request: "GetVoivodeshipById",
      result: "voivodeship",
    },
    Powiat: {
      request: "GetCountyById",
      result: "county",
    },
    Gmina: {
      request: "GetCommuneById",
      result: "commune",
    },
    Region: {
      request: "GetRegionById",
      result: "region",
    },
    Dzialka: {
      request: "GetParcelById",
      result: "geom_wkt",
    },
  } as any,
};
