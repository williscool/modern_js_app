// https://github.com/Microsoft/TypeScript/issues/7071
// https://stackoverflow.com/questions/32950966/typescript-compiler-error-when-importing-json-file/32952089#32952089
declare module "*.json" {
  const value: any;
  export default value;
}

declare module "decomment";
declare module "whatwg-url";
