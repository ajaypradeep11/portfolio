import { Column, Flex, Icon, Text } from "@/once-ui/components";

interface FunFact {
  icon: string;
  color: string;
  text: string;
}

interface FunFactsProps {
  facts: FunFact[];
}

export default function FunFacts({ facts }: FunFactsProps) {
  return (
    <Column
      gap="12"
      paddingTop="8"
      fillWidth
      style={{ borderTop: "1px solid var(--neutral-alpha-weak)" }}
    >
      {facts.map((fact, i) => (
        <Flex key={i} gap="10" vertical="center">
          <Icon
            name={fact.icon}
            size="xs"
            style={{ color: fact.color, flexShrink: 0 }}
          />
          <Text variant="body-default-xs" onBackground="neutral-weak">
            {fact.text}
          </Text>
        </Flex>
      ))}
    </Column>
  );
}
