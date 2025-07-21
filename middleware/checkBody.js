function checkBody(requiredFields) {
  return (req, res, next) => {
    const missingFields = requiredFields.filter((field) => {
      const val = req.body[field];
      if (val === undefined || val === null) return true;
      if (typeof val === "string" && val.trim() === "") return true;
      if (Array.isArray(val) && val.length === 0) return true;
      return false;
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        result: false,
        error: `Missing or invalid fields: ${missingFields.join(", ")}`,
      });
    }

    next();
  };
}

module.exports = { checkBody };
