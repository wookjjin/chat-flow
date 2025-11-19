import { Icon } from '@iconify/react';

export default function Header() {
  return (
    <header className="bg-white p-4">
      <nav className="mx-auto flex items-center justify-end">
        <div className="space-x-4">
          <div className="cursor-pointer">
            <Icon className="text-xl" icon="mdi:dots-horizontal" />
          </div>
        </div>
      </nav>
    </header>
  );
}
