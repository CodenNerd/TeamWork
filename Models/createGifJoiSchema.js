import Joi from "@hapi/joi";

const schema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(30)
        .alphanum()
        .required(),
    caption: Joi.string()
        .min(3)
        .max(30)
        .alphanum()

})

export default schema;