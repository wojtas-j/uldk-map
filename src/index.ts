import { UldkMap } from "./components/uldk-map";
import { html } from "lit";
import { customElement } from "lit/decorators.js";
import "./components/uldk-panel"

@customElement("uldk-renderer")
export class UldkRenderer extends UldkMap{
    render(){
        return html`<uldk-panel .map=${this.map}></uldk-panel>`
    }
}