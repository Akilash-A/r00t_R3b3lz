export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t">
      <div className="container mx-auto py-4 px-4 md:px-6">
        <p className="text-center text-sm text-muted-foreground">
          © {currentYear} r00t_R3b3lz. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
