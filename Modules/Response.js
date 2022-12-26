const Error = (
  res,
  message = "Something went wrong",
  status = 500,
  error=null
) => {
  return res.status(status).json({
    message,
    error,
    status,
  });
};

const Success = (
  res,
  message = "Success",
  data=null,
  status = 200,
) => {
  return res.status(status).json({
    message,
    data,
    status,
  });
};

module.exports = { Error,Success };
