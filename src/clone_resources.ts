import { cloneResources } from './services/cloneResources';

export { cloneResources };

if (import.meta.url === `file://${process.argv[1]}`) {
  cloneResources();
}