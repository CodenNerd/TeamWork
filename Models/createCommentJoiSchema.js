import Joi from "@hapi/joi";

const schema = Joi.object({
    commentBody: Joi.string()
        .min(1)
        .max(250)
        .required(), 
    
    commentPostType: Joi.string()
        .min(3)
        .max(2000)
        .required(),
            
})

export default schema;