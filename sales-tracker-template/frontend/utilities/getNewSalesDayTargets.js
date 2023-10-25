export default (tableData, value) => {
  const arr = [...tableData];

  const parsedValue = parseFloat(value);

  const fixedValue = parseFloat(
    (isNaN(parsedValue) ? 0 : parsedValue).toFixed(2)
  );
  const target = fixedValue / (arr.length || 1);

  for (let i = 0; i < arr.length; i++) {
    arr[i].node.target = parseFloat(target.toFixed(2));
  }

  return arr;
};
