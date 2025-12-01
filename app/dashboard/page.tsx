import Link from 'next/link'
import React from 'react'

function Dashboard() {
  return (
    <div>
        <h1>Dashboard</h1>
        <Link href="/builder">form builder</Link>
    </div>
  )
}

export default Dashboard