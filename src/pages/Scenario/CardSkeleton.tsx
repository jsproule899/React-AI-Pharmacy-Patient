import { Skeleton } from '@/components/ui/skeleton'

const ScenarioCardSkeleton = () => {
    return (
        <Skeleton className='w-[432px] h-[492px] m-4 relative'>
            <Skeleton className='w-12 h-12 top-4 right-8 rounded-full absolute ' />
            <Skeleton className='p-6 m-4 w-8/12' />
            <Skeleton className='rounded-lg object-cover h-72 m-4' />
            <Skeleton className='p-3 m-4 w-10/12 relative' />
            <Skeleton className='p-3 m-4  w-8/12 relative' />
            <Skeleton className='p-2 m-4 w-6/12 relative' />
        </Skeleton>
    )
}

const numbers = [1, 2, 3, 4, 5, 6, 7, 8]

const CardSkeleton = () => {
    return (

        <div className='flex justify-start flex-wrap m-4'>
            {
                numbers.map((key) => {
                    return <ScenarioCardSkeleton key={key} />
                })}
        </div>
    )
}

export default CardSkeleton