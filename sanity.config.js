import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {countryStateListPlugin} from 'sanity-plugin-country-state-select'
import {recurringDates} from 'sanity-plugin-recurring-dates'
import {crossDatasetDuplicator} from '@sanity/cross-dataset-duplicator'
import {googleMapsInput} from '@sanity/google-maps-input'
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
      recurringDates(),
      crossDatasetDuplicator({
        types: ['event'],
        follow: [],
      }),
      googleMapsInput({
        apiKey: 'AIzaSyCUtKMpH3NgotgxmzlTB8PZPC7U8x99mKo',
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
      recurringDates(),
      googleMapsInput({
        apiKey: process.env.SANITY_STUDIO_GOOGLE_API,
      }),
    ],
    schema: {
      types: schemaTypes,
    },
  },
])
