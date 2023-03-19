import get from "lodash.get";
import set from "lodash.set";
import type { ValidatedFormElements, ValidatedInput } from "../common/interfaces/form";

export class FormValidator {
    // use stores to achieve reactivity: https://stackoverflow.com/questions/62884259/making-class-instance-reactive-in-svelte-using-stores
    formElements: ValidatedFormElements;

    constructor(formElements: ValidatedFormElements) {
        this.formElements = formElements;
    }

    validate = (event: Event) => {
        const target = event.target as HTMLInputElement;
        const name = target.name;

        const element = get(this.formElements, name) as ValidatedInput | null;
        if (!element) return;

        element.invalid = target.checkValidity();
        element.invalidText = target.validationMessage;
        set(this.formElements, name, element);

        this.formElements = { ...this.formElements };
    };
}