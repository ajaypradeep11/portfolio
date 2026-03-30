import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/mdx";
import { getPosts } from "@/app/utils/utils";
import { AvatarGroup, Button, Carousel, Column, Flex, Heading, Text } from "@/once-ui/components";
import { absoluteUrl } from "@/app/resources";
import { person, work } from "@/app/resources/content";
import { formatDate } from "@/app/utils/formatDate";
import ScrollToHash from "@/components/ScrollToHash";
import { createMetadata, createOgImageUrl, toAbsoluteUrl } from "@/app/utils/metadata";

interface WorkParams {
  params: {
    slug: string;
  };
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = getPosts(["src", "app", "work", "projects"]);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({ params: { slug } }: WorkParams) {
  let post = getPosts(["src", "app", "work", "projects"]).find((post) => post.slug === slug);

  if (!post) {
    return;
  }

  const { title, publishedAt: publishedTime, summary: description, image, images } = post.metadata;

  return createMetadata({
    title,
    description,
    path: `/work/${post.slug}`,
    image: image || images[0],
    type: "article",
    publishedTime,
  });
}

export default function Project({ params }: WorkParams) {
  let post = getPosts(["src", "app", "work", "projects"]).find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  const avatars =
    post.metadata.team?.map((person) => ({
      src: person.avatar,
    })) || [];
  const postImage =
    toAbsoluteUrl(post.metadata.image || post.metadata.images[0]) ||
    createOgImageUrl(post.metadata.title);

  return (
    <Column as="section" maxWidth="xl" horizontal="center" gap="l">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "CreativeWork",
              headline: post.metadata.title,
              datePublished: post.metadata.publishedAt,
              dateModified: post.metadata.publishedAt,
              description: post.metadata.summary,
              image: postImage,
              url: absoluteUrl(`/work/${post.slug}`),
              author: {
                "@type": "Person",
                name: person.name,
              },
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: absoluteUrl("/"),
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: work.title,
                  item: absoluteUrl("/work"),
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: post.metadata.title,
                  item: absoluteUrl(`/work/${post.slug}`),
                },
              ],
            },
          ]),
        }}
      />
      <Column maxWidth="xs" gap="16">
        <Button href="/work" variant="tertiary" weight="default" size="s" prefixIcon="chevronLeft">
          Projects
        </Button>
        <Flex gap="m" vertical="center">
          <Heading variant="display-strong-s">{post.metadata.title}</Heading>
          {post.metadata.ongoing && (
            <Flex
              vertical="center"
              gap="8"
              paddingX="12"
              paddingY="4"
              radius="l"
              fitWidth
              style={{
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "var(--success-border-strong)",
                backgroundColor: "var(--success-background-strong)",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: "var(--success-solid-strong)",
                  animation: "pulse 2s ease-in-out infinite",
                  flexShrink: 0,
                }}
              />
              <Text variant="label-default-s" onBackground="success-strong">
                Ongoing
              </Text>
            </Flex>
          )}
        </Flex>
      </Column>
      {post.metadata.images.length > 0 && (
        <Carousel
          indicator="thumbnail"
          aspectRatio="16 / 9"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 92vw, 1100px"
          images={post.metadata.images.map((src: string) => ({
            src,
            alt: post.metadata.title,
          }))}
        />
      )}
      <Column style={{ margin: "auto" }} as="article" maxWidth="xs">
        <Flex gap="12" marginBottom="24" vertical="center">
          {post.metadata.team && <AvatarGroup reverse avatars={avatars} size="m" />}
          <Text variant="body-default-s" onBackground="neutral-weak">
            {post.metadata.publishedAt && formatDate(post.metadata.publishedAt)}
          </Text>
        </Flex>
        <CustomMDX source={post.content} />
      </Column>
      <ScrollToHash />
    </Column>
  );
}
