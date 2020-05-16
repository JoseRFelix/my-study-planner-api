import * as c from 'cloudinary'
import config from '../config'

const cloudinary = c.v2

cloudinary.config({
  cloud_name: config.cloudinaryName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
})

export default cloudinary
