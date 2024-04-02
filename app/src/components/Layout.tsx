import { useLocalStorage } from 'usehooks-ts';

import { Box, Flash, IconButton, TabNav, Text } from '@primer/react';
import Image from 'next/image';

import { useIsSSR } from '@/hooks/useIsSSR';
import { XIcon } from '@primer/octicons-react';
import { useRouter } from 'next/router';
import { FC, PropsWithChildren } from 'react';
import data from '../data/data.json';

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const [showBanner, setShowBanner] = useLocalStorage('show-banner', false);
  const isSSR = useIsSSR();

  return (
    <main className="px-18 py-18 h-full flex flex-col">
      <Box className="flex flex-row items-center gap-6">
        <Image
          className="block h-8 w-auto"
          src="/images/logo.svg"
          height={50}
          width={150}
          alt="World Health Organization logo"
        />
        <Text as="h1" className="font-semibold text-xl">
          {data.orgInfo.name} Open Source Dashboard
        </Text>
      </Box>
      <Box className="mt-2">
        <Text as="h2" className="text-sm">
          This project includes metrics about the Open Source repositories for
          the {data.orgInfo.name}.
        </Text>
      </Box>
      {!isSSR && showBanner && (
        <Box className="mt-6">
          <Flash
            variant="default"
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text>
              Open Source Health Metrics for{' '}
              <Text className="font-semibold">{data.orgInfo.name}</Text>. Visit
              the Documentation page to learn more about how these metrics are
              calculated.
            </Text>
            <Box>
              <IconButton
                onClick={() => setShowBanner(false)}
                variant="invisible"
                icon={XIcon}
                aria-label="Dismiss"
                sx={{ svg: { margin: '0', color: 'fg.muted' } }}
              />
            </Box>
          </Flash>
        </Box>
      )}
      <TabNav aria-label="Main" className="mt-8">
        <TabNav.Link
          href="/"
          selected={!router.pathname.includes('documentation')}
        >
          Repositories
        </TabNav.Link>
        <TabNav.Link
          href="/documentation"
          selected={router.pathname.includes('documentation')}
        >
          Documentation
        </TabNav.Link>
      </TabNav>
      <Box className="flex-1 mt-2">{children}</Box>
    </main>
  );
};
