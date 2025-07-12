import { Suspense } from 'react'
import { BarLoader } from "react-spinners"

const Layout = ({ children }) => {
    return (
        <div className='px-5'>
            
            {/*Until the API call for industryInsight completed, we can show a loading indicator using fallback */}
            <Suspense fallback={<BarLoader className='mt-4' width={"100%"} color='gray' />}>{children}</Suspense>
        </div>
    )
}

export default Layout