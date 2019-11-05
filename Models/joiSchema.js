import Joi from "@hapi/joi";

const schema = Joi.object({
    firstName: Joi.string()
                    .min(3)
                    .max(30)
                    .alphanum()
                    .required(),
    lastName: Joi.string()
                    .min(3)
                    .max(30)
                    .alphanum()
                    .required(),
    email: Joi.string()
                .email({
                    minDomainSegments:2
                })
                .required(),
    jobRole: Joi.string()
                .required(),
    address: Joi.string()
                
})

export default schema;