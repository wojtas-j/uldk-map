import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

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

@customElement("uldk-metric-panel")
export class UldkMetricPanel extends LitElement {
    @property({ type: Object }) parcelData?: ParcelData;

    render() {
        if (!this.parcelData) {
            return html`<p>Brak danych o działce.</p>`;
        }

        return html`
            <div class="metric-panel">
                <h3>Metryczka Działki</h3>
                <table>
                    <tr>
                        <th>Województwo</th>
                        <td>${this.parcelData.voivodeship}</td>
                    </tr>
                    <tr>
                        <th>Powiat</th>
                        <td>${this.parcelData.county}</td>
                    </tr>
                    <tr>
                        <th>Gmina</th>
                        <td>${this.parcelData.commune}</td>
                    </tr>
                    <tr>
                        <th>Region</th>
                        <td>${this.parcelData.region}</td>
                    </tr>
                    <tr>
                        <th>Numer Działki</th>
                        <td>${this.parcelData.parcel}</td>
                    </tr>
                    <tr>
                        <th>Źródło Danych</th>
                        <td>${this.parcelData.datasource}</td>
                    </tr>
                    <tr>
                        <th>TERYT</th>
                        <td>${this.parcelData.teryt}</td>
                    </tr>
                </table>
            </div>
        `;
    }

    static styles = css`
        .metric-panel {
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            background-color: #f9f9f9;
        }

        h3 {
            text-align: center;
            margin-bottom: 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th {
            text-align: left;
            padding: 5px;
            background-color: #eaeaea;
            width: 40%;
        }

        td {
            padding: 5px;
        }

        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
    `;
}
