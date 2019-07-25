import { exists, uuid } from '../extensions/utility';

export default class Property {
	constructor(name, valueType, validation) {
		this.uuid = uuid();
		this.name = name;
		this.valueType = valueType; //Check this against VALUE_TYPES in config
		this.validation = validation;
	}

	get hasValidValue() {
		return this.validation ? this.validation() : true;
	}

	get isValidProperty() {
		return !!this.uuid && !!this.name && !!this.valueType;
	}
}
