const capitalizeFirstLetter = (string) => {
  return string.toLowerCase().replace(/(^|\s)\S/g, function (firstChar) {
    return firstChar.toUpperCase();
  });
};

export default capitalizeFirstLetter;
