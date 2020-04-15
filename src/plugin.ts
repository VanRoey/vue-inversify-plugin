import { PluginObject } from 'vue';
import { Container } from 'inversify';

export function vueInversifyPlugin(container: Container): PluginObject<any> {
	return {
		install: (Vue1) => {
			Vue1.prototype._inversifyContainer = container;
		}
	};
}
