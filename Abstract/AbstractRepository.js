
class AbstractRepository
{
    constructor(model){
        this._model = model
    }
    static createNew(model, data)
    {
        return new Promise((resolve, reject) => {
            model.create(data).then(res => {
                resolve(res)
            }).catch(err =>{
                reject(err)
            })
        })
    }

    static updateData(model,id,data){
        return new Promise((resolve, reject) => {
            model.findByIdAndUpdate(id, { $set: data }, { upsert: true, returnNewDocument: true }).then(function (res) {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }

    static findAll(model){
        return new Promise((resolve, reject) => {
            model.find({ deleted_at: null}).then(res => {
                resolve(res)
            }).catch(err =>{
                reject(err)
            })
        })
    }

    static findAllDeleted(model){
        return new Promise((resolve, reject) => {
            model.find({ deleted_at: { $ne: null }}).then(res => {
                resolve(res)
            }).catch(err =>{
                reject(err)
            })
        })
    }

    static findAllWithDeleted(model){
        return new Promise((resolve, reject) => {
            model.find().then(res => {
                resolve(res)
            }).catch(err =>{
                reject(err)
            })
        })
    }

    static findLimit(model,limit = 5, orderColumn = '_id', orderDir = '1', cols = '')
    {
        return new Promise((resolve, reject) => {
            model.find({ deleted_at: null}).sort({[orderColumn]: orderDir}).limit(limit).then(res => {
                resolve(res)
            }).catch(err =>{
                reject(err)
            })
        })
    }
    
    static findById(model,id)
    {
        return new Promise((resolve, reject) => {
            model.findById(id).then(res => {
                resolve(res)
            }).catch(err =>{
                reject(err)
            })
        })
    }

    static findBy(model,where, value)
    {
        return new Promise((resolve, reject) => {
            model.find({ [where] : value}).then(res => {
                resolve(res)
            }).catch(err =>{
                reject(err)
            })
        })
    }

    //@adedolapoo, use findby to retirieve single row
    static findByFirst(model,where, value)
    {
        return new Promise((resolve, reject) => {
            model.findOne({ [where] : value}).then(res => {
                resolve(res)
            }).catch(err =>{
                reject(err)
            })
        })
    }
    static findAndOrderByCol(model,where, value, cols = array('*'), by = "name")
    {
        return new Promise((resolve, reject) => {
            model.find({ [where]: value}).sort({[orderColumn]: orderDir}).then(res => {
                resolve(res)
            }).catch(err =>{
                reject(err)
            })
        })
    }

    static softDelete(model,id)
    {
        return new Promise((resolve, reject) => {
            model.findById(id).then(res => {
                res.deleted_at = new Date()
                res.save()
                resolve(res)
            }).catch(err =>{
                reject(err)
            })
        })
    }

    static forceDelete(model,id)
    {
        return new Promise((resolve, reject) => {
            model.findOneAndRemove({_id: id }).then(res => {
                resolve(res)
            }).catch(err =>{
                reject(err)
            })
        })
    }

    static countAllDocuments(model)
    {
        return new Promise((resolve, reject) => {
            model.countDocuments().then(res => {
                resolve(res)
            }).catch(err =>{
                reject(err)
            })
        })
    }

    static countDocumentsWhere(model,where,value)
    {
        return new Promise((resolve, reject) => {
            model.countDocuments({ [where] : value}).then(res => {
                resolve(res)
            }).catch(err =>{
                reject(err)
            })
        })
    }

}

module.exports = AbstractRepository