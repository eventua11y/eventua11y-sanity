import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {countryStateListPlugin} from 'sanity-plugin-country-state-select'
import {crossDatasetDuplicator} from '@sanity/cross-dataset-duplicator'
import {schemaTypes} from './schemas'

export default defineConfig([
  {
    projectId: '2g5zqxo3',
    dataset: 'production',
    name: 'production',
    basePath: '/production',
    title: 'Production',
    plugins: [
      deskTool(),
      visionTool(),
      countryStateListPlugin(),
      crossDatasetDuplicator({
        types: ['event'],
        follow: [],
      }),
    ],
    schema: {
      types: schemaTypes,
    },
  },
  {
    projectId: '2g5zqxo3',
    dataset: 'test',
    name: 'development',
    basePath: '/test',
    title: 'Development',
    plugins: [
      deskTool(),
      visionTool(),
      countryStateListPlugin(),
    ],
    schema: {
      types: schemaTypes,
    },
  },
])
