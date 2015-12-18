import assign from 'lodash/object/assign';

const environment = {
  development: {
    isProduction: false,
  },
  production: {
    isProduction: true,
  },
}[process.env.NODE_ENV || 'development'];

export default assign({
  host: 'http://localhost:3000',
  assets: '/assets',
  app: {
    title: 'Redux Universal App',
    meta: {
      charSet: 'utf-8',
      property: {
        'og:site_name': 'Redux Universal App',
      },
    },
  },
}, environment);
