import { Skeleton } from '@/components/ui/skeleton'
import { FaPerson } from 'react-icons/fa6'

const ScenarioCardSkeleton = () => {
    return (
        <Skeleton className='w-[432px] h-[544px] m-4 inline-block relative'>
            <Skeleton className='w-12 h-12 top-4 right-8 rounded-full absolute ' />
            <Skeleton className='p-6 m-4 w-8/12' />            
            <FaPerson className='w-72 h-72 m-auto animate-pulse rounded-md text-slate-900/10 dark:text-slate-50/10' />
            <Skeleton className='p-3 m-4 w-10/12 relative' />
            <Skeleton className='p-3 m-4  w-8/12 relative' />
            <Skeleton className='p-2 m-4 w-6/12 relative' />
        </Skeleton>
    )
}

const numbers = [1, 2, 3, 4, 5, 6, 7, 8]

const CardSkeleton = () => {
    return (

        <div className='flex justify-start flex-wrap mb-16'> 
            {
                numbers.map((key) => {
                    return <ScenarioCardSkeleton key={key} />
                })}
        </div>
    )
}

export default CardSkeleton