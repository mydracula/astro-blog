import { defineConfig, presetAttributify, presetUno, transformerDirectives, transformerCompileClass } from 'unocss'

export default defineConfig({
  shortcuts: [],
  rules: [],
  presets: [presetUno(), presetAttributify()],
  transformers: [
    transformerDirectives(),
    transformerCompileClass(),
  ],
})
