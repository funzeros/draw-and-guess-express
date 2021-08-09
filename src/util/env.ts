import dotenv from "dotenv";

export interface ExpressEnv {
  PORT: number;
}

export function loadEnv(): ExpressEnv {
  const ret: any = {};
  const envList = [".env.local", ".env", ,];
  envList.forEach(e => {
    dotenv.config({
      path: e,
    });
  });
  for (const envName of Object.keys(process.env)) {
    let realName = (process.env as any)[envName].replace(/\\n/g, "\n");
    realName = realName === "true" ? true : realName === "false" ? false : realName;
    ret[envName] = realName;
    process.env[envName] = realName;
  }
  return ret;
}
