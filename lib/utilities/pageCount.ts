export const pageCount = ({
  itemsPerPage,
  itemsTotal,
}: {
  itemsPerPage: number;
  itemsTotal: number;
}) => Math.ceil(itemsTotal / itemsPerPage);
