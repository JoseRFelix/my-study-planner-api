import * as config from '.'

const whitelist = [
  'http://localhost:3000',
  'http://' + config.default.siteUrl,
  config.default.siteUrl,
]
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}

export default corsOptions
