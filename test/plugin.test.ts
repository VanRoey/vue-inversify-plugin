import { vueInversifyPlugin } from '../src/plugin';
import { Container } from 'inversify';
import { createApp } from 'vue';

describe(vueInversifyPlugin, () => {
  describe('registering the plugin to the Vue app instance', () => {
    it('should add a property "_inversifyContainer" to the globalProperties of the Vue app instance with the container passed container as value', function() {
      // ARRANGE
      const app = createApp({})
      const container = new Container();

      // ACT
      app.use(vueInversifyPlugin(container));

      // ASSERT
      expect(app.config.globalProperties._inversifyContainer).toStrictEqual(container);
    });
  });
});
