const pluralise = (singular: string, plural: string, count: number) => {
  if (count === 1) {
    return singular.replaceAll('@count', '1');
  }
  
  return plural.replace('@count', count.toString());
};

export default pluralise;
