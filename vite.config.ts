import { resolve } from "path";
import { warpperEnv, regExps } from "./build";
import { getPluginsList } from "./build/plugins";
import { UserConfigExport, ConfigEnv, loadEnv } from "vite";

// 当前执行node命令时文件夹的地址（工作目录）
const root: string = process.cwd();

// 路径查找
const pathResolve = (dir: string): string => {
  return resolve(__dirname, ".", dir);
};

// 设置别名
const alias: Record<string, string> = {
  "/@": pathResolve("src"),
  "@build": pathResolve("build")
};

export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  const {
    VITE_PORT,
    VITE_LEGACY,
    VITE_PUBLIC_PATH,
    VITE_PROXY_DOMAIN,
    VITE_PROXY_DOMAIN_REAL
  } = warpperEnv(loadEnv(mode, root));
  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias
    },
    css: {
      // https://github.com/vitejs/vite/issues/5833
      postcss: {
        plugins: [
          {
            postcssPlugin: "internal:charset-removal",
            AtRule: {
              charset: atRule => {
                if (atRule.name === "charset") {
                  atRule.remove();
                }
              }
            }
          }
        ]
      }
    },
    // 服务端渲染
    server: {
      // 是否开启 https
      https: false,
      // 端口号
      port: VITE_PORT,
      host: "0.0.0.0",
      // 本地跨域代理
      proxy:
        VITE_PROXY_DOMAIN_REAL.length > 0
          ? {
              [VITE_PROXY_DOMAIN]: {
                target: VITE_PROXY_DOMAIN_REAL,
                // ws: true,
                changeOrigin: true,
                rewrite: (path: string) => regExps(path, VITE_PROXY_DOMAIN)
              }
            }
          : null
    },
    plugins: getPluginsList(command, VITE_LEGACY),
    optimizeDeps: {
      include: ["pinia", "lodash-es", "@vueuse/core", "@iconify/vue"],
      exclude: ["@zougt/vite-plugin-theme-preprocessor/dist/browser-utils"]
    },
    build: {
      sourcemap: false,
      brotliSize: false,
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks: {
            "element-plus": ["element-plus"],
            "vform3-plus": ["vform3-plus"],
            echarts: ["echarts"]
          }
        }
      },
      cssCodeSplit: true // 如果设置为false，整个项目中的所有 CSS 将被提取到一个 CSS 文件中
    },
    define: {
      __INTLIFY_PROD_DEVTOOLS__: false
    }
  };
};
