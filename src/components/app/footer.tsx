export default function AppFooter({ className }: { className?: string }) {
  return (
    <footer
      className={`
        border-t bg-background px-8 py-4 text-muted-foreground
        md:px-16 md:py-8
        ${className}
      `}
    >
      &copy; 2024 Design by NKUST ISLab
    </footer>
  );
}
