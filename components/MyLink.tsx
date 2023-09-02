import React, { ReactElement, ReactNode } from 'react'
import Link from 'next/link'

const MyLink = ({href, children}: {href: string, children: ReactNode}) => {
  return (
    <Link className='underline hover:text-primary transition-colors' href={href}>{children}</Link>
  )
}

export default MyLink
