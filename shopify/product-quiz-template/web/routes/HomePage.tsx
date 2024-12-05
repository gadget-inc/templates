import { Layout, Tabs, Card } from "@shopify/polaris";
import { useCallback } from "react";
import { useState } from "react";
import { InstallTab, QuizzesTab, PageTemplate } from "../components";

export default () => {
  const [selected, setSelected] = useState<number>(0);

  const handleTabChange = useCallback(
    (selectedTabIndex: number) => setSelected(selectedTabIndex),
    []
  );

  const tabs = [
    {
      id: "quiz-setup",
      content: "Quizzes",
      panelID: "quiz-setup-content",
    },
    {
      id: "quiz-install",
      content: "Install",
      panelID: "quiz-install-content",
    },
  ];

  const tabPanels = [<QuizzesTab />, <InstallTab />];

  return (
    <PageTemplate>
      <Layout>
        <Layout.Section>
          <Card>
            <Tabs
              tabs={tabs}
              selected={selected}
              onSelect={handleTabChange}
              fitted
            >
              {tabPanels[selected]}
            </Tabs>
          </Card>
        </Layout.Section>
      </Layout>
    </PageTemplate>
  );
};
