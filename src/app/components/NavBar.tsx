'use client';
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function NavBar() {
    const pathname = usePathname();
  
    const links = [
      { href: '/', label: 'home' },
      { href: '/projects', label: '</>' },
      { href: '/design', label: '[: :]' },
      // { href: '/playground', label: 'playground' },
      { href: '/blog', label: 'blog' },
    ];
  
    return (
      <nav className='w-full top-0 left-0 flex flex-row justify-center z-20 p-10 fixed gap-5 md:gap-8'>
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`transition-all duration-200 backdrop-filter backdrop-blur ${
              pathname === href ? 'red' : ''
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    );
  }
  
  
  
  
  
  