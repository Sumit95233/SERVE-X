export const validate = (schema) => (req, res, next) => {
  try {
    const validated = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    // Replace with parsed/sanitized fields
    if (validated.body) req.body = validated.body;
    if (validated.query) req.query = validated.query;
    if (validated.params) req.params = validated.params;
    next();
  } catch (err) {
    if (err.errors) {
      const messages = err.errors.map((e) => `${e.path.slice(1).join('.')}: ${e.message}`).join(', ');
      return res.status(400).json({
        success: false,
        message: `Validation failed: ${messages}`,
        errors: err.errors,
        code: 'VALIDATION_ERROR',
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
      code: 'VALIDATION_ERROR',
    });
  }
};
