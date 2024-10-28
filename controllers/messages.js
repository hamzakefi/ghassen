const Messages = require("../model/Messages")


exports.postMessage = async(req,res)=> {

    const {name,email ,phone , message } = req.body
    
        try {
           
            const newMessage = new Messages({...req.body })
            
    
            await newMessage.save()
            
   
            res.status(200).send({success : [{msg:"Message envoyé..."}] , newMessage })

        } catch (error) {
            res.status(400).send({msg : 'Message non envoyé', error})   
        }
    }
    

    exports.getMessages = async (req,res) => {
        try {
            const listMessages = await Messages.find();
            res.status(200).send({msg : 'Messages',  listMessages})
            
        } catch (error) {
            res.status(400).send({msg : 'cannot get all Messages', error})
        }
      }


      exports.deleteMessage = async (req,res) => {
        try {
            const{_id}= req.params;
            await Messages.findOneAndDelete({_id})
            res.status(200).send({msg : "Messages deleted"})
        } catch (error) {
            res.status(400).send({msg : "cannot delete this Messages", error})      
        }
    }     
    