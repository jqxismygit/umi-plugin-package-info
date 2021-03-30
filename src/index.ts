// ref:
// - https://umijs.org/plugins/api
import { IApi } from '@umijs/types';
import { join } from 'path';

export default function(api: IApi) {
  api.logger.info('use plugin package-info');

  api.describe({
    key: 'packageAlias',
    config: {
      schema(joi) {
        return joi.string();
      },
    },
  });

  const { qiankun, packageAlias } = api.userConfig;

  if (api?.paths?.cwd) {
    const packageJson = require(join(api.paths.cwd as string, 'package.json'));
    const name = packageAlias || packageJson.name;
    api.addHTMLHeadScripts(() => {
      return qiankun
        ? [
            {
              content: `
            if(!window.globalThis.__package_info__){
              window.globalThis.__package_info__ = {};
            }
            window.globalThis.__package_info__.["${name}"] = ${JSON.stringify(
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
            window.__package_info__["${name}"] = ${JSON.stringify(packageJson)}
          `,
            },
          ];
    });
  }
}
