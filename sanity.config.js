import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
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
    ],
    schema: {
      types: schemaTypes,
    },
  },
])
