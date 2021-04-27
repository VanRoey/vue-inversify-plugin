import { Plugin } from 'vue';
import { Container } from 'inversify';

export function vueInversifyPlugin(container: Container): Plugin {
  return {
    install: (app) => {
      app.config.globalProperties._inversifyContainer = container;
    }
  };
}
