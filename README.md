# r00t_R3b3lz CTF Platform

A Next.js application for showcasing CTF write-ups and team information for the r00t_R3b3lz team.

## Getting Started

To get started, take a look at `src/app/page.tsx`.

### Development

```bash
npm run dev
```

### Handling Browser Extension Hydration Issues

This application includes several safeguards to prevent hydration errors caused by browser extensions (particularly Dark Reader):

1. **suppressHydrationWarning**: Added to elements with inline styles that may be modified by extensions
2. **ClientOnly component**: Use `@/components/client-only` for client-only rendering when needed
3. **Extension detection hook**: Use `@/hooks/use-browser-extension-detection` to detect and handle extension presence

If you encounter hydration warnings in development, they are likely caused by browser extensions modifying the DOM. The application includes comprehensive handling for these scenarios.

## Project Structure

- `src/app/` - Next.js app router pages
- `src/components/` - React components
- `src/lib/` - Utilities and data definitions
- `src/hooks/` - Custom React hooks
