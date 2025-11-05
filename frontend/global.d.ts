declare module '*.module.css';
declare module '*.module.scss';
declare module '*.module.sass';

declare module '*.css';
declare module '*.scss';
declare module '*.sass';

// Optionally, if you use images in imports with TypeScript, add these as needed:
declare module '*.svg' {
  const content: string;
  export default content;
}
