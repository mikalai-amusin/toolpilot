import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        jsonFormatter: resolve(__dirname, 'tools/json-formatter/index.html'),
        wordCounter: resolve(__dirname, 'tools/word-counter/index.html'),
        loremGenerator: resolve(__dirname, 'tools/lorem-generator/index.html'),
        colorPalette: resolve(__dirname, 'tools/color-palette/index.html'),
        passwordGenerator: resolve(__dirname, 'tools/password-generator/index.html'),
        base64Codec: resolve(__dirname, 'tools/base64-codec/index.html'),
        markdownPreview: resolve(__dirname, 'tools/markdown-preview/index.html'),
        unitConverter: resolve(__dirname, 'tools/unit-converter/index.html'),
        qrGenerator: resolve(__dirname, 'tools/qr-generator/index.html'),
        gradientGenerator: resolve(__dirname, 'tools/gradient-generator/index.html'),
        regexTester: resolve(__dirname, 'tools/regex-tester/index.html'),
        boxShadow: resolve(__dirname, 'tools/box-shadow/index.html'),
        hashGenerator: resolve(__dirname, 'tools/hash-generator/index.html'),
      },
    },
  },
});
