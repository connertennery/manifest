import Collection from '@/Manifest/collection';
// import ManifestConfig from '@/Manifest/config';
import { Result } from '@/Manifest/models/result';
import { v4 as uuid } from 'uuid';

export default class Type {
	constructor(name) {
		this.uuid = uuid();
		this.name = name;
		this.typeTags = new Collection('TypeTags'); // Unsure how to handle this.
		this._properties = new Collection('Properties');
	}

	get isValid() {
		return !!this.uuid && !!this.name;
	}

	addProperty(property) {
		if (property && property.isValid) {
			// Name matters, not uuid, because this is user-facing
			if (this.properties.find(x => x.name === property.name)) {
				return Result.error(
					`Attempted to add a Property in Type.addProperty() but a Property with the same name already exists: ${property.name}`
				);
			}

			this._properties.set(property.uuid, property);
			return Result.success(
				`Added Property - name: '${property.name}'\nvalueType: '${property.valueType.name}'\nvalidation: ${
					property.validation ? 'true' : 'false'
				}`
			);
		}
		return Result.error('Attempted to add an invalid Property in Type.addProperty()');
	}

	removeProperty(property) {
		if (property) {
			const foundProperty = this._properties.findIndex(x => x.uuid === property.uuid);
			if (foundProperty) {
				this._properties.splice(foundProperty, 1);

				return Result.success(`Successfully removed Property: ${property.uuid} from Type: ${this.uuid}`);
			}
			return Result.error(
				`Attempted to remove a Property: ${property.uuid} that doesn't belong to Type: ${this.uuid}`
			);
		}
		return Result.error('Attempted to remove a Property that doesn\'t exist in Type.removeProperty()\'');
	}

	getTaggedProperties(seenTypes) {
		// Combine all parent Types and with this._properties
		let props = this._properties;

		if (seenTypes.indexOf(this.uuid) === -1) {
			seenTypes.push(this.uuid);
		}

		if (this.typeTags.length > 0) {
			const types = this.typeTags;
			const arr = [...this.typeTags.keys()];

			// Iterate over every seen type and remove them from arr so we don't call them again
			for (let i = 0; i < seenTypes.length; i += 1) {
				const index = arr.indexOf(seenTypes[i]);
				if (index !== -1) arr.splice(index, 1);
			}

			arr.forEach(id => {
				props = new Map([...props, ...types.get(id).getTaggedProperties(seenTypes)]);
			});
		}
		return props;
	}

	get properties() {
		// Combine all tagged Types and with this._properties
		let props = this._properties;

		// Getting properties from this Type means we're at the start so add ourselves to the seenTypes dictionary
		const seenTypes = [];
		seenTypes.push(this.uuid);
		const types = this.typeTags;
		this.typeTags.forEach((type, id) => {
			props = new Map([...props, ...types.get(id).getTaggedProperties(seenTypes)]);
		});

		return new Collection('Properties', props);
	}

	set properties(value) {
		throw new Error(`Don't try to set Type.properties. ${this}`);
	}
}
