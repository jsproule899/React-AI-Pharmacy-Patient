import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { FaPlus } from 'react-icons/fa6'
import { Link } from 'react-router'

const CardSkeleton = () => {
    return (
        <div className="flex-grow flex-wrap bg-stone-50 dark:bg-stone-900 ">
            <div className='relative p-4'>
                <Link to="/scenarios/add" className='absolute m-4 left-0 top-0'>
                    <Button>
                        Create New
                        <FaPlus />
                    </Button>
                </Link>

            </div>
            <div className='flex justify-start flex-wrap m-4'>
                <Skeleton className='w-[432px] h-[492px] m-4' />
                <Skeleton className='w-[432px] h-[492px] m-4' />
                <Skeleton className='w-[432px] h-[492px] m-4' />
                <Skeleton className='w-[432px] h-[492px] m-4' />
                <Skeleton className='w-[432px] h-[492px] m-4' />
                <Skeleton className='w-[432px] h-[492px] m-4' />
                <Skeleton className='w-[432px] h-[492px] m-4' />
                <Skeleton className='w-[432px] h-[492px] m-4' />
            </div>
        </div>
    )
}

export default CardSkeleton