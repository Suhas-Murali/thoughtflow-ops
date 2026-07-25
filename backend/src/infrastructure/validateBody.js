/**
 * Express middleware factory. Validates req.body against a Zod schema.
 * If validation fails, responds with 400 and clear field-level errors.
 */
function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      return res.status(400).json({ error: 'Validation failed.', details: errors });
    }

    req.body = result.data;
    next();
  };
}

module.exports = validateBody;