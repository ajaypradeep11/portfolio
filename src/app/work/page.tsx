import { getPosts } from "@/app/utils/utils";
import { Column } from "@/once-ui/components";
import { Projects } from "@/components/work/Projects";
import { absoluteUrl } from "@/app/resources";
import { person, work } from "@/app/resources/content";
import { createMetadata, createOgImageUrl, toAbsoluteUrl } from "@/app/utils/metadata";

export async function generateMetadata() {
  return createMetadata({
    title: work.title,
    description: work.description,
    path: "/work",
  });
}

export default function Work() {
  let allProjects = getPosts(["src", "app", "work", "projects"]);
  const ogImage = createOgImageUrl(work.title);
  const itemListElement = allProjects.map((project, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: absoluteUrl(`/work/${project.slug}`),
    name: project.metadata.title,
  }));

  return (
    <Column maxWidth="m">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: work.title,
            description: work.description,
            url: absoluteUrl("/work"),
            image: ogImage,
            author: {
              "@type": "Person",
              name: person.name,
            },
            mainEntity: {
              "@type": "ItemList",
              itemListElement,
            },
            hasPart: allProjects.map((project) => ({
              "@type": "CreativeWork",
              name: project.metadata.title,
              headline: project.metadata.title,
              description: project.metadata.summary,
              url: absoluteUrl(`/work/${project.slug}`),
              image:
                toAbsoluteUrl(project.metadata.image || project.metadata.images[0]) ||
                createOgImageUrl(project.metadata.title),
            })),
          }),
        }}
      />
      <Projects priorityFirst />
    </Column>
  );
}
