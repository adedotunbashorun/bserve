'use strict'

const Priority = require('../../Support/Models/SupportPriorities')
const PrioritySeeder = {}

PrioritySeeder.seedPriorities = (req, res) => {
    //deleting all db data
    try{
        Priority.remove({ _id: { $ne: null } }).then(() => {
        }).catch(error => {
            return res.status(422).json({ error: error })
        })
        // create some events
        const suppport_priorities = [
            { name: 'High' },
            { name: 'Meduim' },
            { name: 'Low' }
        ]

        // use the Priority model to insert/save
        suppport_priorities.forEach(priority => {
            var newp = new Priority(priority)
            newp.save()
        })

        // seeded!
        return res.status(201).json({ msg: 'Priority Seeded' })
    }catch(err){
        return res.status(422).json({ error: err, msg: err.message })
    }
    
}
module.exports = PrioritySeeder