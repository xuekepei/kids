const { defineConfig } = require('vite')
const vue = require('@vitejs/plugin-vue')
const path = require('path')

export default defineConfig({
    base: '/',
    plugins: [vue()],
    resolve: {
        alias: {
            '@/': `${path.resolve(__dirname, 'src')}/`
        },
    }
})