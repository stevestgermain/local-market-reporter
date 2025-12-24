// Fixed: Removed reference to vite/client to resolve "Cannot find type definition" error.
// Added process.env type definition for TypeScript support.

declare var process: {
  env: {
    API_KEY: string;
    [key: string]: string | undefined;
  }
};
