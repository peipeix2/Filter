import { Tooltip, Button } from '@nextui-org/react'

const DUMMY_DATA = [
    {
        adult: false,
        gender: 2,
        id: 2037,
        known_for_department: 'Acting',
        name: 'Cillian Murphy',
        original_name: 'Cillian Murphy',
        popularity: 83.614,
        profile_path: '/3DZAf9CwXmfV2HZOEdqeZAGTndV.jpg',
        cast_id: 3,
        character: 'J. Robert Oppenheimer',
        credit_id: '613a940d9653f60043e380df',
        order: 0,
    },
    {
        adult: false,
        gender: 1,
        id: 5081,
        known_for_department: 'Acting',
        name: 'Emily Blunt',
        original_name: 'Emily Blunt',
        popularity: 84.72,
        profile_path: '/xDc01ud6ZtaJFQWg8YfffFlUBdY.jpg',
        cast_id: 161,
        character: 'Kitty Oppenheimer',
        credit_id: '6328c918524978007e9f1a7f',
        order: 1,
    },
    {
        adult: false,
        gender: 2,
        id: 1892,
        known_for_department: 'Acting',
        name: 'Matt Damon',
        original_name: 'Matt Damon',
        popularity: 91.882,
        profile_path: '/At3JgvaNeEN4Z4ESKlhhes85Xo3.jpg',
        cast_id: 108,
        character: 'Leslie Groves',
        credit_id: '6328ad9843250f00830efdca',
        order: 2,
    },
    {
        adult: false,
        gender: 2,
        id: 3223,
        known_for_department: 'Acting',
        name: 'Robert Downey Jr.',
        original_name: 'Robert Downey Jr.',
        popularity: 40.748,
        profile_path: '/im9SAqJPZKEbVZGmjXuLI4O7RvM.jpg',
        cast_id: 109,
        character: 'Lewis Strauss',
        credit_id: '6328adb143250f00830efdd6',
        order: 3,
    },
    {
        adult: false,
        gender: 1,
        id: 1373737,
        known_for_department: 'Acting',
        name: 'Florence Pugh',
        original_name: 'Florence Pugh',
        popularity: 105.253,
        profile_path: '/ogoAeJyLzam5m3JvBFg6vwI8p0I.jpg',
        cast_id: 110,
        character: 'Jean Tatlock',
        credit_id: '6328adc8229ae2007e7a4fbc',
        order: 4,
    },
    {
        adult: false,
        gender: 2,
        id: 2299,
        known_for_department: 'Acting',
        name: 'Josh Hartnett',
        original_name: 'Josh Hartnett',
        popularity: 36.396,
        profile_path: '/dCfu2EN7FjISACcjilaJu7evwEc.jpg',
        cast_id: 113,
        character: 'Ernest Lawrence',
        credit_id: '6328adf543250f007e8c215e',
        order: 5,
    },
]

const Cast = () => {
  return (
      <div className='mt-5 flex gap-2 flex-wrap'>
          {DUMMY_DATA.map((item) => {
              return (
                  <Tooltip content={item.character} size="sm">
                      <Button size="sm">{item.name}</Button>
                  </Tooltip>
              )
          })}
      </div>
  )
    
}

export default Cast
