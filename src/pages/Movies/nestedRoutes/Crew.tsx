import { Tooltip, Button } from '@nextui-org/react'

const DUMMY_DATA = [
    {
        adult: false,
        gender: 2,
        id: 282,
        known_for_department: 'Production',
        name: 'Charles Roven',
        original_name: 'Charles Roven',
        popularity: 3.158,
        profile_path: '/4uJLoVstC1CBcArXFOe53N2fDr1.jpg',
        credit_id: '6162d88a18b75100298fcb24',
        department: 'Production',
        job: 'Producer',
    },
    {
        adult: false,
        gender: 2,
        id: 525,
        known_for_department: 'Directing',
        name: 'Christopher Nolan',
        original_name: 'Christopher Nolan',
        popularity: 37.85,
        profile_path: '/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg',
        credit_id: '613a93cbd38b58005f6a1964',
        department: 'Directing',
        job: 'Director',
    },
    {
        adult: false,
        gender: 2,
        id: 525,
        known_for_department: 'Directing',
        name: 'Christopher Nolan',
        original_name: 'Christopher Nolan',
        popularity: 37.85,
        profile_path: '/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg',
        credit_id: '6140dd58aaf89700421a6dd1',
        department: 'Production',
        job: 'Producer',
    },
    {
        adult: false,
        gender: 2,
        id: 525,
        known_for_department: 'Directing',
        name: 'Christopher Nolan',
        original_name: 'Christopher Nolan',
        popularity: 37.85,
        profile_path: '/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg',
        credit_id: '62e2e919fe077a005f06af53',
        department: 'Writing',
        job: 'Writer',
    },
    {
        adult: false,
        gender: 1,
        id: 556,
        known_for_department: 'Production',
        name: 'Emma Thomas',
        original_name: 'Emma Thomas',
        popularity: 12.577,
        profile_path: '/6GemtNCy856iLho6WRsFASxQTAp.jpg',
        credit_id: '6140ddd260c7510062e112f8',
        department: 'Production',
        job: 'Producer',
    },
    {
        adult: false,
        gender: 2,
        id: 561,
        known_for_department: 'Production',
        name: 'John Papsidera',
        original_name: 'John Papsidera',
        popularity: 5.329,
        profile_path: '/egwEVyrAmdWhtuLqE5fcThZf41E.jpg',
        credit_id: '61db7e1605f9cf001daab1df',
        department: 'Production',
        job: 'Casting',
    },
]

const Crew = () => {
    return (
        <div className="mt-5 flex flex-wrap gap-2">
            {DUMMY_DATA.map((item) => {
                return (
                    <Tooltip content={item.job} size="sm">
                        <Button size="sm">{item.name}</Button>
                    </Tooltip>
                )
            })}
        </div>
    )
}

export default Crew
