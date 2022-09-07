import Link from "next/link";

type NavItemProps = { href: string; title: string };
export function NavItem({ href, title }: NavItemProps) {
  return (
    <li className="font-sans font-semibold text-lg">
      <Link href={href}>{title}</Link>
    </li>
  );
}
