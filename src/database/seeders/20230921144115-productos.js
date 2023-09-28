'use strict';
const productsJSON = require('../../data/productsDataBase');
const productsDB = productsJSON.map(({name,price,description,discount,image,category} )=> {
  return {
    name,
    price,
    discount,
    categoryId: category === "visited" ? 1: 2,
    description,
    image,
    createdAt: new Date(),
    updatedAt: new Date(),
}})

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Products",
      productsDB,
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Products", null, {});
  },
};