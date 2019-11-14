import Joi from "@hapi/joi";

const schema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(30)

        .required(),
    caption: Joi.string()
        .min(3)
        .max(30)


})

export default schema;