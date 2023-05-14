const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

const getPagingData = (rawData, page, limit) => {
  const { count: totalItems, rows: data } = rawData;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, totalPages, currentPage, data };
};

module.exports = { getPagination, getPagingData };
