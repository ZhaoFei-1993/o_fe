const faker = require('faker/locale/zh_CN')

module.exports = () => {
  const data = {
    users: [],
    items: [],
    orders: [],
  }
  // Create data with faker
  for (let i = 0; i < 1000; i++) {
    data.users.push({
      id: i,
      name: faker.name.findName(),
      create_time: faker.date.past(),
      address: faker.address.country(),
      email: faker.random.word() + faker.internet.email(),
      phone: faker.phone.phoneNumber(),
      is_2fa: faker.random.boolean(),
    })
    data.items.push({
      id: i,
      status: faker.random.arrayElement([0, 1, 2, 3]),
      version: faker.random.arrayElement([0, 1, 2, 3]),
      product_type: faker.random.arrayElement([1, 2]),
      brand: faker.random.word(),
      model: faker.phone.phoneNumber(),
      hashrate: faker.random.number(), // 算力
      power: faker.random.number(), // 功耗
      production_date: faker.date.past(),
      is_under_warranty: faker.random.boolean(),
      is_with_power: faker.random.boolean(),
      is_with_power_cord: faker.random.boolean(),
      is_brand_new: faker.random.boolean(),
      price: faker.random.number(),
      price_type: faker.random.arrayElement([1, 2]),
      pay_methods: [0, 1, 2, 3].slice(0, 1 + Math.round(Math.random() * 3)),
      inventory: faker.random.number(),
      number_sold: faker.random.number(),
      min_trading_volume: faker.random.number(),
      delivery_city_code: faker.random.number(),
      delivery_country_code: faker.random.number(),
      delivery_province_code: faker.random.number(),
      title: faker.lorem.words(),
      detail: faker.lorem.paragraphs(),
      images: [{
        caption: faker.lorem.words(), src: faker.random.image()
      }, {
        caption: faker.lorem.words(),
        src: faker.random.image()
      }, {
        caption: faker.lorem.words(),
        src: faker.random.image()
      }],
      contact_phone: faker.phone.phoneNumber(),
      contact_name: faker.random.word(),
      other_contact_type: faker.random.arrayElement([1, 2, 3]),
      other_contact_info: faker.random.number(),
      create_time: faker.date.past(),
      issue_time: faker.date.past(),
      modify_time: faker.date.past(),
      expire_time: faker.date.future(),
      user: data.users[faker.random.number({max: i})],
    })
    data.orders.push({
      id: i,
      order_no: faker.random.number(),
      status: faker.random.arrayElement([0, 1, 2, 3, 4, 5]),
      volume: faker.random.number(),
      price: faker.random.number() * faker.random.number({max: 10}),
      total_price: faker.random.number(),
      coin_total_price: faker.random.number(),
      price_type: faker.random.arrayElement([1, 2]),
      coin_type: faker.random.arrayElement([0, 1, 2, 3]),
      address_area_codes: faker.random.number(),
      address_area: faker.address.country() + faker.address.city(),
      address_detail: faker.address.streetAddress(),
      postcode: faker.random.number(),
      consignee_name: faker.random.word(),
      contact_phone_country_code: faker.random.number(),
      comment: faker.lorem.words(),
      contact_phone: faker.phone.phoneNumber(),
      logistics_company: faker.company.companyName(),
      logistics_no: faker.random.number({min: 10000}),
      delay_receive_times: faker.random.number({max: 3}),
      create_time: faker.date.past(),
      pay_time: faker.date.past(),
      delivery_time: faker.date.past(),
      modify_time: faker.date.past(),
      refund_time: faker.date.past(),
      receive_time: faker.date.past(),
      buyer: data.users[faker.random.number({max: i})],
      seller: data.users[faker.random.number({max: i})],
      item: data.items[faker.random.number({max: i})],
      item_snapshot: data.items[faker.random.number({max: i})],
      item_snapshot_id: faker.random.number({max: 1000}),
    })
  }
  return data
}
