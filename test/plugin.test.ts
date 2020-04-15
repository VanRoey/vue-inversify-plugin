import { vueInversifyPlugin } from '../src/plugin';
import { Container } from 'inversify';
import Vue from 'vue';

describe(vueInversifyPlugin, () => {
	describe('registering the plugin to the Vue instance', () => {
		it('should add a property "_inversifyContainer" to the prototype of the Vue instance with the container passed container as value', function() {
			// ARRANGE
			const container = new Container();

			// ACT
			Vue.use(vueInversifyPlugin(container));

			// ASSERT
			expect(Vue.prototype._inversifyContainer).toStrictEqual(container);
		});
	});
});
