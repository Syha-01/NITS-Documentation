import type { Config } from '@react-router/dev/config';
import { glob } from 'node:fs/promises';
import { createGetUrl, getSlugs } from 'fumadocs-core/source';

const getUrl = createGetUrl('/docs');

export default {
  ssr: true,
  async prerender({ getStaticPaths }) {
    const paths: string[] = [];
    for (const path of getStaticPaths()) {
      // ignore dynamic document search
      if (path === '/api/search') continue;
      paths.push(path);
    }

    for await (const entry of glob('**/*.mdx', { cwd: 'content/docs/' })) {
      const url = getUrl(getSlugs(entry));
      // prevent double slashes for the index page
      if (url.endsWith('/')) {
        paths.push(url);
      } else {
        paths.push(`${url}/`);
      }
    }

    return paths;
  },
} satisfies Config;
