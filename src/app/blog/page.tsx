import { Column, Flex, Heading } from "@/once-ui/components";
import { Mailchimp } from "@/components";
import { absoluteUrl } from "@/app/resources";
import { blog, person, newsletter } from "@/app/resources/content";
import { Posts } from "@/components/blog/Posts";
import { createMetadata, createOgImageUrl } from "@/app/utils/metadata";

export async function generateMetadata() {
  return createMetadata({
    title: blog.title,
    description: blog.description,
    path: "/blog",
  });
}

export default function Blog() {
  const ogImage = createOgImageUrl(blog.title);

  return (
    <Column maxWidth="l">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: blog.title,
            description: blog.description,
            url: absoluteUrl("/blog"),
            image: ogImage,
            author: {
              "@type": "Person",
              name: person.name,
              image: {
                "@type": "ImageObject",
                url: absoluteUrl(person.avatar),
              },
            },
          }),
        }}
      />
      <Heading marginBottom="l" variant="display-strong-s">
        {blog.title}
      </Heading>
      <Column fillWidth flex={1} >
        <Posts range={[1, 10]} columns="2" thumbnail />
      </Column>
      {newsletter.display && <Mailchimp newsletter={newsletter} />}
    </Column>
  );
}
