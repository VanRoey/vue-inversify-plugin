import 'reflect-metadata';
import { $inject } from '../src';
import { createApp } from 'vue';
import { Vue, Options } from 'vue-class-component';
import { Container, injectable } from 'inversify';
import { vueInversifyPlugin } from '../src/plugin';

describe($inject, () => {
  document.body.innerHTML = `
    <div>
      <div id="app"></div>
    </div>
  `

  describe('decorating a data property of a component', () => {
    describe('also assigning a value to the property', () => {
      it('should throw an error ', function() {

        @Options({ template: '<div></div>' })
        class TestComponent extends Vue {
          @$inject()
          testProp: string = '';
        }

        const app = createApp({
          template: '<div><test-component ref="testComponent" /></div>',
          components: { TestComponent }
        });

        expect(() => {
          app.mount('#app')
        }).toThrowError('Assigning a value to an injected property is not possible!');
      });
    });

    describe('not assigning a value to the injected property', () => {

      @injectable()
      class Test {

      }

      interface ITester {
        test: string;
      }

      @injectable()
      class Tester implements ITester {
        test: string = 'e';
      }

      const testClassKey = 'test';

      const testConstant = { a: 'a' };
      const testConstantKey = 'b';

      const container = new Container();
      container.bind(testClassKey).to(Test);
      container.bind(testConstantKey).toConstantValue(testConstant);
      container.bind<ITester>('ITester').to(Tester);

      describe('passing a key to the decorator', () => {
        it('should make the property equal to the matching value of the key registered in the container', function() {

          @Options({ template: '<div></div>' })
          class TestComponent extends Vue {
            @$inject(testClassKey)
            a: any;

            @$inject(testConstantKey)
            b: any;
          }

          const app = createApp({
            template: '<div><test-component ref="testComponent" /></div>',
            components: { TestComponent }
          });
          app.use(vueInversifyPlugin(container));
          const vm = app.mount('#app');

          const component = vm.$refs.testComponent as any;
          expect(component.a instanceof Test).toBe(true);
          expect(component.b).toStrictEqual(testConstant);
        });
      });

      describe('not passing a key to the decorator', () => {
        it('should return the value registered in the container matching the I+NameOfTheProperty', function() {

          @Options({ template: '<div></div>' })
          class TestComponent extends Vue {
            @$inject()
            tester!: ITester;
          }

          const app = createApp({
            template: '<div><test-component ref="testComponent" /></div>',
            components: { TestComponent }
          });
          app.use(vueInversifyPlugin(container));
          const vm = app.mount('#app');

          const component = vm.$refs.testComponent as any;
          expect(component.tester instanceof Tester).toBe(true);
        });
      });

      it('should ignore the underscore if a property is prefixed with it and assign the value registered in the container matching I+NameOfTheProperty', function() {

        @Options({ template: '<div></div>' })
        class TestComponent extends Vue {
          @$inject()
          _tester!: ITester;
        }

        const app = createApp({
          template: '<div><test-component ref="testComponent" /></div>',
          components: { TestComponent }
        });
        app.use(vueInversifyPlugin(container));
        const vm = app.mount('#app');

        const component = vm.$refs.testComponent as any;
        expect(component._tester instanceof Tester).toBe(true);
      });
    });

  });
});
