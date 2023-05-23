export default function Header() {
  return (
    <header className="bg-gray-600 mb-5">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between py-6 px-5 md:px-0"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <img
            width={75}
            height={75}
            src="/images/beeproger_Logo.svg"
            alt="logo"
          />
        </div>
      </nav>
    </header>
  );
}
