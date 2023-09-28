//bd 
const db = require('../database/models')
const {Op}=require('sequelize')

const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	index: (req, res) => {
		const productsVisited = db.Product.findAll({
			where: {
				categoryId: 1
			}
		});
		const productsInSale = db.Product.findAll({
			where: {
				categoryId: 2
			}
		});
		Promise.all([productsVisited, productsInSale])
		.then(([productsVisited, productsInSale]) => {
			
			return res.render('index',{
				productsVisited,
			productsInSale,
			toThousand
			})
			
		})
		.catch(error => console.log(error))

	},
	search: (req, res) => {


		db.Product.findAll({
			where: {
				[Op.or] : [
					{
						name:{
							[Op.substring] : req.query.keywords
						}
					},
					{description:{
						[Op.substring] : req.query.keywords
					}}
				]
				
			}
		})
		.then(results => {
			res.render('results',{results,toThousand,keywords:req.query.keywords})
		})

		// const results = products.filter(product => product.name.toLowerCase().includes(req.query.keywords.toLowerCase()))

		
	},
};

module.exports = controller;
