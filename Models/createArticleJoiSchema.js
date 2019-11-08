import Joi from "@hapi/joi";

const schema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(50)
        .required(),
    content: Joi.string()
        .min(3)
        .max(2000),
    tag: Joi.string()
        .min(3)
        .max(20)
})

export default schema;