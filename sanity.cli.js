import {defineConfig} from 'sanity'

// CLI configuration
export default defineConfig({
  api: {
    projectId: '2g5zqxo3',
    dataset: 'production'
  }
})

// Studio configuration
export const studioConfig = defineConfig([
  {
    projectId: '2g5zqxo3',
    dataset: 'production',
    name: 'production-workspace',
    basePath: '/production',
  },
  {
    projectId: '2g5zqxo3',
    dataset: 'test',
    name: 'test-workspace',
    basePath: '/test',
  }
])