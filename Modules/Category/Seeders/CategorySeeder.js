'use strict'
const Category = require('../Models/Category')
let categories = [
    {
        name: 'Hair Saloon',
        description: 'Hair Saloon'
    },
    {
        name: 'Makeup',
        description: 'Makeup'
    },
    {
        name: 'Nails',
        description: 'Nails'
    },
    {
        name: 'Barbing',
        description: 'Barbing'
    },
    {
        name: 'Spa',
        description: 'Spa'
    },
    {
        name: 'Laundry',
        description: 'Laundry'
    }
]
class CategorySeeder{
    
    static seed(req,res){
        Category.remove({})
        .then(() => { 
            categories.forEach(cat => {
                var newp = new Category(cat)
                newp.save()
            })
    
            // seeded!
            return res.status(201).json({ msg: 'Category Seeded' })
        })
        .catch((e) => {
            console.log(e)
            process.exit(1)
        });
    }
}

module.exports = CategorySeeder