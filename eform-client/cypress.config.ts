import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    video: true,
    viewportWidth: 2560,
    viewportHeight: 1440,
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });
      return config;
    },
  },
});
