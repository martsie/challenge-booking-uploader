const pluralise = (singular: string, plural: string, count: number) => {
  if (count === 1) {
    return singular.replace(/@count/g, '1')
  }
  
  return plural.replace(/@count/g, count.toString())
}

export default pluralise
