import Joi from "@hapi/joi";

const schema = Joi.object({
    commentBody: Joi.string()
        .min(1)
        .max(250)
        .required()

})

export default schema;