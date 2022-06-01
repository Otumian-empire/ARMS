module.exports = (schema, property = "body") => {
  return (req, res, next) => {
    const options = {
      abortEarly: true, // include all errors
      allowUnknown: true, // ignore unknown props
      convert: true,
    };

    const { error } = schema.validate(req[property], options);
    const valid = error === undefined;

    if (valid) {
      return next();
    } else {
      const messages = error.details.map((err) => err.message).join(",");

      return res.status(200).json({
        success: false,
        message: messages,
      });
    }
  };
};
