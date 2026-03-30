import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/mdx";
import { getPosts } from "@/app/utils/utils";
import { AvatarGroup, Button, Column, Heading, Row, Text } from "@/once-ui/components";
import { absoluteUrl } from "@/app/resources";
import { blog, person } from "@/app/resources/content";
import { formatDate } from "@/app/utils/formatDate";
import ScrollToHash from "@/components/ScrollToHash";
import { createMetadata, createOgImageUrl, toAbsoluteUrl } from "@/app/utils/metadata";

interface BlogParams {
  params: {
    slug: string;
  };
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = getPosts(["src", "app", "blog", "posts"]);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({ params: { slug } }: BlogParams) {
  let post = getPosts(["src", "app", "blog", "posts"]).find((post) => post.slug === slug);

  if (!post) {
    return;
  }

  const { title, publishedAt: publishedTime, summary: description, image, images } = post.metadata;

  return createMetadata({
    title,
    description,
    path: `/blog/${post.slug}`,
    image: image || images[0],
    type: "article",
    publishedTime,
  });
}

export default function Blog({ params }: BlogParams) {
  let post = getPosts(["src", "app", "blog", "posts"]).find((post) => post.slug === params.slug);

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
    <Column as="section" maxWidth="xs" gap="l">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: post.metadata.title,
              datePublished: post.metadata.publishedAt,
              dateModified: post.metadata.publishedAt,
              description: post.metadata.summary,
              image: postImage,
              url: absoluteUrl(`/blog/${post.slug}`),
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
                  name: blog.title,
                  item: absoluteUrl("/blog"),
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: post.metadata.title,
                  item: absoluteUrl(`/blog/${post.slug}`),
                },
              ],
            },
          ]),
        }}
      />
      <Button href="/blog" weight="default" variant="tertiary" size="s" prefixIcon="chevronLeft">
        Posts
      </Button>
      <Heading variant="display-strong-s">{post.metadata.title}</Heading>
      <Row gap="12" vertical="center">
        {avatars.length > 0 && <AvatarGroup size="s" avatars={avatars} />}
        <Text variant="body-default-s" onBackground="neutral-weak">
          {post.metadata.publishedAt && formatDate(post.metadata.publishedAt)}
        </Text>
      </Row>
      <Column as="article" fillWidth>
        <CustomMDX source={post.content} />
      </Column>
      <ScrollToHash />
    </Column>
  );
}
