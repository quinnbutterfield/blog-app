const animals = [

  { name: 'fred', species: 'dog' },
  { name: 'christina', species: 'cat' },
  { name: 'fredie', species: 'fish' },
  { name: 'e', species: 'apple' }


]
// eslint-disable-next-line no-unused-vars
const authors = [

  { name: 'fred', species: 'dog' },
  { name: 'christina', species: 'cat' },
  { name: 'fredie', species: 'fish' },
  { name: 'e', species: 'apple' }


]


const pokemon = [
  { name: 'charmander', type: 'fire' },
  { name: 'squirtle', type: 'water' },
  { name: 'bulbasaur', type: 'grass' }
]


let pokemonified = pokemon.reduce((obj, cur) => {
  console.log(cur)
  obj[cur.name] = { type: cur.type }
  return obj
}, {})


let names = animals.map(animal => {
  return animal.name
})

console.log(pokemonified)

console.log(names)