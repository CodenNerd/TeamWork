import Joi from "@hapi/joi";

const schema = Joi.object({
    firstName: Joi.string()
                    .min(3)
                    .max(30)
                    .alpha()
                    .required(),
    lastName: Joi.string()
                    .min(3)
                    .max(30)
                    .alpha()
                    .required(),
    email: Joi.string()
                .email({
                    minDomainSegments:2
                })
                .required(),
    address: Joi.string()
                .alphanum()
})

export default schema;