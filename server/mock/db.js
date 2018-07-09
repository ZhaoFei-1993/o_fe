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
      status: faker.random.arrayElement([0, 1, 2, 3]),
      email: faker.random.word() + faker.internet.email(),
      phone: faker.phone.phoneNumber(),
      is_2fa: faker.random.boolean(),
      kyc_status: faker.random.boolean(),
      kyc_name: faker.name.findName(),
      kyc_number: faker.random.number(),
    })
    const randUser = data.users[faker.random.number({max: i})]
    data.items.push({
      id: i,
      user_id: randUser.id,
      is_buy_side: faker.random.boolean(),
      coin_type: faker.random.arrayElement([1, 2, 3, 4]), // 数字货币币种
      fiat_type: faker.random.arrayElement([1]), // 法币货币币种
      premium_rate: faker.random.number({max: 100}),
      price_limit: faker.random.number({max: 1000}),
      price: faker.random.number(),
      coin_amount: faker.random.number(),
      min_deal_fiat_amount: faker.random.number(),
      max_deal_fiat_amount: faker.random.number(),
      counterparty_limit: faker.random.number(),
      auto_reply_content: faker.random.sentence(),
      status: faker.random.arrayElement([0, 1]),
      create_time: faker.date.past(),
      update_time: faker.date.past(),
    })
    data.orders.push({
      id: i,
      item_id: faker.random.number(), // 可能广告不存在，顺便测试错误吧
      item_user_id: faker.random.number(),
      user_id: faker.random.number(),
      side: faker.random.boolean(),
      coin_type: faker.random.arrayElement([1, 2, 3, 4]),
      coin_amount: faker.random.number(),
      fiat_type: faker.random.arrayElement([1, 2, 3, 4]),
      fiat_amount: faker.random.number(),
      price: faker.random.number() * faker.random.number({max: 10}),
      memo: faker.random.word(),
      status: faker.random.arrayElement([0, 1]),
      create_time: faker.date.past(),
      update_time: faker.date.past(),
    })
  }
  return data
}
