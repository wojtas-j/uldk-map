declare global {
    interface HTMLVaadinComboBoxElement extends HTMLElement {
        items: UldkItem[];
        value: string;
        clearButtonVisible: boolean;
        itemLabelPath: string;
        itemValuePath: string;
    }

    interface HTMLVaadinTextFieldElement extends HTMLElement {
        value: string;
        clearButtonVisible: boolean;
        label: string;
    }

    interface HTMLElementTagNameMap {
        'vaadin-combo-box': HTMLVaadinComboBoxElement;
        'vaadin-text-field': HTMLVaadinTextFieldElement;
        'vaadin-button': HTMLElement;
    }
}

export {};
