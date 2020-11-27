// ref:
// - https://umijs.org/plugins/api
import { IApi } from '@umijs/types';

export default function(api: IApi) {
  api.logger.info('use plugin package-info');

  const { qiankun } = api.userConfig;

  if (api?.paths?.cwd) {
    const packageJson = require(join(api.paths.cwd as string, 'package.json'));
    const name = packageJson.name;
    api.addHTMLHeadScripts(() => {
      return qiankun
        ? [
            {
              content: `
            if(!window.globalThis.__package_info__){
              window.globalThis.__package_info__ = {};
            }
            window.globalThis.__package_info__.${name} = ${JSON.stringify(
                packageJson,
              )}
          `,
            },
          ]
        : [
            {
              content: `
            if(!window.__package_info__){
              window.__package_info__ = {};
            }
            window.__package_info__.${name} = ${JSON.stringify(packageJson)}
          `,
            },
          ];
    });
  }
}
