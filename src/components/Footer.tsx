export default function Footer() {
  return (
    <footer className="py-10 text-center dark:opacity-100 opacity-60 text-sm dark:bg-gray-900 dark:text-white">
      LifePanel © {new Date().getFullYear()}
    </footer>
  );
}
