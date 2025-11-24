// products.js
const cuid = require('cuid')
const db = require('./db')

const Product = db.model('Product', {
  _id: { type: String, default: cuid },
  description: { type: String },
  alt_description: { type: String },
  likes: { type: Number, required: true },
  urls: {
    regular: { type: String, required: true },
    small: { type: String, required: true },
    thumb: { type: String, required: true }
  },
  links: {
    self: { type: String, required: true },
    html: { type: String, required: true }
  },
  user: {
    id: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String },
    portfolio_url: { type: String },
    username: { type: String, required: true }
  },
  tags: [
    {
      title: { type: String, required: true }
    }
  ]
})

/* CREATE */
async function create(fields) {
  const product = await new Product(fields).save()
  return product
}

/* LIST */
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options

  const query = tag
    ? { tags: { $elemMatch: { title: tag } } }
    : {}

  return await Product.find(query)
    .sort({ _id: 1 })
    .skip(offset)
    .limit(limit)
}

/* GET */
async function get(id) {
  return await Product.findById(id)
}

/* EDIT */
async function edit(id, change) {
  const product = await get(id)
  Object.keys(change).forEach(k => (product[k] = change[k]))
  await product.save()
  return product
}

/* DELETE */
async function destroy(id) {
  return await Product.deleteOne({ _id: id })
}

module.exports = {
  list,
  get,
  create,
  edit,
  destroy
}
