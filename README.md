# Vue inversify plugin
Visit our website: www.vanroey.be

# 1. Installation
`npm i vue-inversify-plugin`

or

`yarn add vue-inversify-plugin`

# 2. Documentation
> For inversify specific questions, please refer to it's official documentation: https://github.com/inversify/InversifyJS 
## 2.1 Registering the plugin

services/my-service.ts:
```typescript
import {injectable} from 'inversify';

export interface IMyService {
  test(): string;
}

@injectable()
export class MyService implements IMyService {
  test():string {
    return 'test';
  }
}
```

main.ts: 
> Important: usage of inversify requires 'reflect-metadata'!
```typescript
import 'reflect-metadata';
import Vue from 'vue';
import {Container} from 'inversify';
import {IMyService, MyService} from '@/services/my-service';
import { vueInversifyPlugin} from 'vue-inversify-plugin';

// Create an inversify container
const container = new Container();
// Apply bindings to container
container.bind<IMyService>('IMyService').to(MyService)

// Register the plugin
Vue.use(vueInversifyPlugin(container));
```

## 2.2 Injecting dependencies into components
MyComponent.ts:
```typescript
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import {$inject} from 'vue-inversify-plugin';

@Component({
 name: 'MyComponent'
})
export default class MyComponent extends Vue {
  @$inject('IMyService') // Inject using key
  private readonly service!: IService;
  
  @$inject() // Injecting without a key => if just leaving the 'I' from the propertyName and the property is in camelCase it will work
  private readonly myService!: IMyService;
  
  @$inject // This also works if you put an underscore before the property name!
  private readonly _myService!: IMyService;

}
```
