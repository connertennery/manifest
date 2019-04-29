import ManifestConfig from './config';
import models from './models';

export default class Manifest {
	Config = ManifestConfig;
	Models = models;

	constructor() {
		this.properties = [];
		this.types = [];
		this.items = [];
	}

	addItem(item) {
		if (item) {
			this.items.push(item);
			return new this.Models.Result(
				this.Config.RESULT_TYPE.Success,
				`Added Item of Type: ${item.type.name} with ${
					item.properties.length
				} properties`
			);
		} else
			return new this.Models.Result(
				this.Config.RESULT_TYPE.Error,
				'Attempted to add a null Item in Manifest.addItem()'
			);
	}

	addType(type) {
		if (type && type.name && type.name !== '') {
			if (this.types.map(t => t.name).includes(type.name))
				return new this.Models.Result(
					this.Config.RESULT_TYPE.Error,
					`Attempted to add a duplicate Type: ${type.name}`
				);

			this.types.push(type);
			return new this.Models.Result(
				this.Config.RESULT_TYPE.Success,
				`Added new Type: ${type.name}`
			);
		} else
			return new this.Models.Result(
				this.Config.RESULT_TYPE.Error,
				'Attempted to add a null Type in Manifest.addItem()'
			);
	}
}