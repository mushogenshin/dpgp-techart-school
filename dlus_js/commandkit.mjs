import { defineConfig } from 'commandkit';

export default defineConfig({
  src: 'src',
  // main: 'index.js',
  // main: 'errands.js',
  main: 'firestore/mail_newsletter.js',
  // watch: false // use this to disable watch mode
});
