// orders.js
const cuid = require('cuid')
const db = require('./db')

const Order = db.model('Order', {
  _id: { type: String, default: cuid },
  buyerEmail: { type: String, required: true },
  products: [
    {
      type: String,
      ref: 'Product',
      index: true,
      required: true
    }
  ],
  status: {
    type: String,
    default: 'CREATED',
    enum: ['CREATED', 'PENDING', 'COMPLETED'],
    index: true
  }
})

/* LIST */
async function list(options = {}) {
  const { offset = 0, limit = 25, productId, status } = options

  const query = {
    ...(productId ? { products: productId } : {}),
    ...(status ? { status } : {})
  }

  return await Order.find(query)
    .sort({ _id: 1 })
    .skip(offset)
    .limit(limit)
}

/* GET */
async function get(id) {
  return await Order.findById(id).populate('products').exec()
}

/* CREATE */
async function create(fields) {
  const order = await new Order(fields).save()
  await order.populate('products')
  return order
}

/* EDIT */
async function edit(id, change) {
  const order = await get(id)
  Object.keys(change).forEach(k => (order[k] = change[k]))
  await order.save()
  await order.populate('products')
  return order
}

/* DELETE */
async function destroy(id) {
  return await Order.deleteOne({ _id: id })
}

module.exports = { list, get, create, edit, destroy }
