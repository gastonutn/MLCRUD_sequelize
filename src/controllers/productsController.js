const db = require('../database/models')

const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {

		db.Product.findAll()
		.then( product => {
			return res.render("products", {
				products,
				toThousand
			})
		})
		.catch(error => console.log(error))


		// const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
		// const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

		
	},

	// Detail - Detail from one product
	detail: (req, res) => {

		db.Product.findByPk(req.params.id)
		.then( product => {
			return res.render("detail", {
				...product.dataValues,
				toThousand
			})
		})
		.catch(error => console.log(error))

		
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form');
	},
	
	// Create -  Method to store
	store: (req, res) => {
		// Do the magic
		const {name,price,discount,description,category} =req.body
		let newProduct ={
			id: products[products.length -1].id +1,
			name: name.trim(),
			price: +price,
			discount: +discount,
			category,
			description: description.trim(),
			image: req.file ? req.file.filename : null
		}
		products.push(newProduct);
		fs.writeFileSync(productsFilePath,JSON.stringify(products,null, 3),'utf8')
		return res.redirect("/products")
	},

	// Update - Form to edit
	edit: (req, res) => {
		const product = products.find(product=>product.id === +req.params.id)
		res.render('product-edit-form',{...product,toThousand});
	},
	// Update - Method to update
	update: (req, res) => {
		// Do the magic
		const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
		const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

		const productsModify = products.map(product => {
			if (product.id === +req.params.id) {
				req.file && (fs.existsSync(`./public/images/products/${product.image}`) && fs.unlinkSync(`./public/images/products/${product.image}`))
				product.name = req.body.name;
				product.price = req.body.price;
				product.discount = req.body.discount;
				product.description = req.body.description;
				product.category = req.body.category;
				product.image = req.file ? req.file.filename : product.image
			}
			
			return product
		})
		
		fs.writeFileSync(productsFilePath,JSON.stringify(productsModify,null, 3),'utf8')
		return res.redirect("/products")
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		const productModify = products.filter(product=>product.id !== +req.params.id)
		
		fs.writeFileSync(productsFilePath,JSON.stringify(productModify ,null, 3),'utf8')
		return res.redirect("/products")

		// Do the magic
		
	}
};

module.exports = controller;