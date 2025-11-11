"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NavBar = () => {
    const pathName = usePathname();
    const linkStyle = (path: string) => `px-3 py-2 rounded ${pathName === path ? 'bg-blue-300 text-white' : 'text-gray-700 hover:bg-gray-100'}`
  return (
    <nav className="flex gap-2 bg-white p-3 shadow mb-6">
      
      <Link href="/notes" className={linkStyle("/notes")}>Notes</Link>
      <Link href="/notes/add" className={linkStyle("/notes/add")}>Add</Link>
    </nav>
  )
}

export default NavBar