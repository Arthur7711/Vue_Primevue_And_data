export const antSort = (a, b) => {
  const nameA = a.toLowerCase();
  const nameB = b.toLowerCase();

  if (!isNaN(nameA) && !isNaN(nameB)) {
    return parseFloat(nameA) - parseFloat(nameB);
  }

  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
};
