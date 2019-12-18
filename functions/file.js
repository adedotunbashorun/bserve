const fs = require('fs')
const Activity = require('../functions/activity')
const userFiles ='uploads'
var cloudinary = require('cloudinary').v2
var url = ''

class File{

    constructor(Cloud = cloudinary){
         this.cloudy = Cloud.config({ 
            cloud_name: process.env.CLOUD_NAME, 
            api_key: process.env.CLOUD_APP_KEY, 
            api_secret: process.env.CLOUD_APP_SECRET 
        })
    }
    static Image(file,dest,name,extension){
        if (typeof file != 'undefined' || file != "" || file != null) {            
            return this.upload_file(file,dest,name,extension)
        }
        return ''
    }

    static cloudImage(model, image){
        if(typeof image != 'undefined' || image != "" || image != null) {
            this.cloudy.uploader.upload(image, function(error, result) {
                if(err){
                    return ""
                }
                model.cloud_image_url = result.url
                model.save()
                return result.url
            })
        }
        return ''
    }

    static generalFile(file,dest,name,extension){
        if (typeof file != 'undefined' || file != "" || file != null) {
            console.log(file)
            let check = this.isBase64(file)
            if(check == false){
                console.log(file)
                let data = Activity.Base64_encode(file.path)
                return this.upload_file(data,dest,name,extension)
            }else{
                return this.upload_file(file,dest,name,extension)
            }
        }
        return ''
    }

    static zipFile(file,name,extension) {

    }

    static isBase64(str) {
        try {
            return btoa(atob(str)) == str;
        } catch (err) {
            return false;
        }
    }

    static upload_file(file,dest,name,extension = ''){
        var image = file.replace(/^data:.*,/, '')
        image = image.replace(/ /g, '+')
        var bitmap = new Buffer(image, 'base64')
        url = userFiles+ dest+ name +'-'+ Date.now() + extension
        fs.writeFileSync(url, bitmap)
        return url
    }

    
}

module.exports = File