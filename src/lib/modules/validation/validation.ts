import get from 'lodash.get';
import set from 'lodash.set';
import { writable, type Subscriber, type Writable } from 'svelte/store';
import type { ValidatedFormElements, ValidatedInput } from '../common/interfaces/form';

export class FormValidator {
	formElements: ValidatedFormElements;
	private _store: Writable<this>;

	constructor(formElements: Record<string, unknown>) {
		this.formElements = {} as ValidatedFormElements;
		for (const key in formElements) {
			this.formElements[key] = {
				invalid: false,
				invalidText: ''
			};
		}
		this._store = writable(this);
	}

	validate = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const name = target.name;

		const element = get(this.formElements, name) as ValidatedInput | null;
		if (!element) return;

		element.invalid = !target.checkValidity();
		element.invalidText = target.validationMessage;
		set(this.formElements, name, element);

		this._store.set(this);
	};

	// using stores to achieve reactivity:
	// https://stackoverflow.com/questions/62884259/making-class-instance-reactive-in-svelte-using-stores
	// https://www.youtube.com/watch?v=oQY98LZIW2E
	subscribe(subscriber: Subscriber<this>) {
		return this._store.subscribe(subscriber);
	}
}
