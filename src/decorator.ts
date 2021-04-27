import { Container } from 'inversify';

export function $inject(key?: string) {
  return (target: any, propertyKey: string) => {
    const bindingKey = key ? key : parseBindingKeyFromPropertyKey(propertyKey);
    Object.defineProperty(target, propertyKey, {
      get(): any {
        const container: Container = this._inversifyContainer;
        if (!container) {
          throw new Error(
            'vue-inversify-plugin is not registered, please read the docs to register the plugin'
          );
        }
        return container.get(bindingKey);
      },
      set(): void {
        throw new Error(
          'Assigning a value to an injected property is not possible!'
        );
      }
    });
  };
}


function isIPrefixed(key: string): boolean {
  return key[0].toLowerCase() === 'i';
}

function isUnderscorePrefixed(key: string): boolean {
  return key[0] === '_';
}

function buildBindingKeyFromNormalizedPropertyName(key: string): string {
  return `I${key.charAt(0).toUpperCase()}${key.substring(1)}`;
}

function parseBindingKeyFromPropertyKey(propertyKey: string): string {
  let key = propertyKey;
  if (isIPrefixed(propertyKey) || isUnderscorePrefixed(propertyKey)) {
    key = propertyKey.substring(1);
  }

  return buildBindingKeyFromNormalizedPropertyName(key);
}

