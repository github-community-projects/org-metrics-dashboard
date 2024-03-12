'use client';

import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Text,
  Title
} from '@tremor/react';

import logo from '@/images/who-logo-wide.svg';
import { Box, Flash, useTheme as primerUseTheme } from '@primer/react';
import Image from 'next/image';

import { useTheme } from 'next-themes';
import data from '../data/data.json';
import Documentation from './Documentation';
import RepositoriesTable from './RepositoriesTable';

export const OrganizationSheet = () => {
  const { theme, systemTheme } = useTheme();
  const { setColorMode } = primerUseTheme();
  if (theme === 'light' || theme === 'dark' || theme === 'auto') {
    setColorMode(theme);
  }

  if (theme === 'system' && systemTheme) {
    setColorMode(systemTheme);
  }

  return (
    <main className="px-18 py-18 h-full flex flex-col">
      <Box
        className="flex"
        sx={{ flexDirection: 'row', gap: 4, alignItems: 'center', mb: 1 }}
      >
        <Image
          className="block h-8 w-auto"
          src={logo}
          height={50}
          width={150}
          alt="World Health Organization logo"
        />
        <Title>{data.orgInfo.name} Open Source Dashboard</Title>
      </Box>
      <Text>
        This project includes metrics about the Open Source repositories for the
        {data.orgInfo.name}.
      </Text>
      <Flash variant="default" className="pt-6">
        Welcome new user!
      </Flash>
      <TabGroup className="mt-6 flex-1 flex flex-col">
        <TabList>
          <Tab>Repositories</Tab>
          <Tab>Documentation</Tab>
        </TabList>
        <TabPanels className="flex-1 flex flex-col">
          <TabPanel className="flex-1">
            <RepositoriesTable />
          </TabPanel>
          <TabPanel className="flex-1">
            <Box className="prose">
              <Documentation />
            </Box>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </main>
  );
};
