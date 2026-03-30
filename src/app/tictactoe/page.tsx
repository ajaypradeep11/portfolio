import { Button, Column, Text, Heading } from "@/once-ui/components";

import { getLiveDemoByStandalonePath } from "@/app/resources/liveDemos";
import { createMetadata } from "@/app/utils/metadata";
import { LiveDemoFrame } from "@/components/work/LiveDemoFrame";

const demo = getLiveDemoByStandalonePath("/tictactoe");

export async function generateMetadata() {
  return createMetadata({
    title: demo?.title || "Tic Tac Toe Live Demo",
    description:
      demo?.description ||
      "Interactive Tic Tac Toe shooter remake embedded inside the portfolio experience.",
    path: "/tictactoe",
  });
}

export default function TicTacToePage() {
  return (
    <Column maxWidth="xl" gap="l">
      <Button href={demo?.caseStudyPath || "/work/network-simulation-engine"} variant="tertiary" weight="default" size="s" prefixIcon="chevronLeft">
        Back to case study
      </Button>
      <Column maxWidth="s" gap="8">
        <Heading variant="display-strong-s">{demo?.title || "Tic Tac Toe Live Demo"}</Heading>
        <Text variant="body-default-m" onBackground="neutral-weak">
          {demo?.description ||
            "Deploy the companion demo app and set NEXT_PUBLIC_INTERACTIVE_DEMOS_URL to load it here."}
        </Text>
      </Column>
      {demo ? (
        <LiveDemoFrame
          title={demo.title}
          description={demo.description}
          src={demo.src}
          frameHeight="clamp(40rem, 86vh, 68rem)"
          fallbackImage={demo.fallbackImage}
          fallbackAlt={demo.title}
          fallbackPriority
        />
      ) : (
        <Text variant="body-default-s" onBackground="danger-weak">
          Live demo details could not be loaded.
        </Text>
      )}
    </Column>
  );
}
