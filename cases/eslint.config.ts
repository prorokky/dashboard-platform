import { configureVueProject, defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from 'eslint-config-prettier/flat'

configureVueProject({ scriptLangs: ['ts', 'tsx'] })

const sourceFiles = ['src/**/*.{vue,ts,tsx}']
const ignoredFiles = [
  '**/dist/**',
  '**/dist-ssr/**',
  '**/coverage/**',
  'src/**/__tests__/**',
  'src/**/*.spec.{ts,tsx}',
  'src/**/*.test.{ts,tsx}',
]

export default defineConfigWithVueTs(
  {
    ignores: ignoredFiles,
  },

  {
    name: 'cases/source-files',
    files: sourceFiles,
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  {
    name: 'cases/source-rules',
    files: sourceFiles,
    rules: {
      quotes: ['error', 'single', { avoidEscape: true }],
      'max-len': [
        'error',
        {
          code: 100,
          ignoreComments: false,
          ignoreRegExpLiterals: true,
          ignoreTemplateLiterals: false,
          ignoreUrls: true,
        },
      ],
      'sort-imports': [
        'error',
        {
          allowSeparatedGroups: true,
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
        },
      ],
      'vue/attributes-order': [
        'error',
        {
          alphabetical: true,
        },
      ],
      'vue/define-macros-order': [
        'error',
        {
          order: ['defineProps', 'defineEmits', 'defineSlots', 'defineModel', 'defineExpose'],
        },
      ],
      'vue/order-in-components': 'error',
      'vue/prop-name-casing': ['error', 'camelCase'],
      'vue/quote-props': ['error', 'as-needed'],
      'vue/sort-keys': [
        'error',
        'asc',
        {
          caseSensitive: true,
          ignoreChildrenOf: ['model'],
          ignoreGrandchildrenOf: ['computed', 'directives', 'inject', 'props', 'watch'],
          minKeys: 2,
          natural: false,
        },
      ],
    },
  },

  skipFormatting,
)
