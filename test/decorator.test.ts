import { $inject } from '../src';
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Container, injectable } from 'inversify';
import { vueInversifyPlugin } from '../src/plugin';
import 'reflect-metadata';

describe($inject, () => {
	describe('decorating a data property of a component', () => {
		describe('also assigning a value to the property', () => {
			it('should throw an error ', function() {
				@Component
				class TestComponent extends Vue {
					@$inject()
					testProp: string = '';
				}

				expect(() => {
					new TestComponent();
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

			Vue.use(vueInversifyPlugin(container));

			describe('passing a key to the decorator', () => {
				it('should make the property equal to the matching value of the key registered in the container', function() {
					@Component
					class TestComponent extends Vue {
						@$inject(testClassKey)
						a: any;

						@$inject(testConstantKey)
						b: any;
					}

					const component = new TestComponent();

					expect(component.a instanceof Test).toBe(true);
					expect(component.b).toStrictEqual(testConstant);
				});
			});

			describe('not passing a key to the decorator', () => {
				it('should return the value registered in the container matching the i+nameOfTheProperty', function() {

					@Component
					class TestComponent extends Vue {
						@$inject()
						tester!: ITester;
					}

					const component = new TestComponent();
					expect(component.tester instanceof Tester).toBe(true);
				});
			});

			it('should ignore the underscore if a property is prefixed with it and assign the value registered in the container matching i+nameOfTheProperty', function() {
				class TestComponent extends Vue {
					@$inject()
					_tester!: ITester;
				}

				const component = new TestComponent();
				expect(component._tester instanceof Tester).toBe(true);
			});
		});


	});
});
