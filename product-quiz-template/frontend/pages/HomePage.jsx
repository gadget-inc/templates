import {
  LegacyCard,
  Layout,
  Tabs,
  Card
} from "@shopify/polaris";
import { useCallback } from "react";
import { useState } from "react";
import { PageTemplate } from "../components/PageTemplate";
import { SetupTab } from "../components/SetupTab";
import { InstallTab } from "../components/InstallTab";

export default function HomePage() {
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );

  const tabs = [
    {
      id: 'quiz-setup',
      content: 'Setup',
      panelID: 'quiz-setup-content',
    },
    {
      id: 'quiz-install',
      content: 'Install',
      panelID: 'quiz-install-content',
    },
  ];

  const tabPanels = [
    (
      <SetupTab />
    ),
    (
      <InstallTab />
    )
  ];

  return (
    <PageTemplate>
      <Layout>
        <Layout.Section>
          <Card>
            <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} fitted>
              {tabPanels[selected]}
            </Tabs>
          </Card>
        </Layout.Section>
      </Layout>
    </PageTemplate>
  );
}
