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

  return (
    <Column maxWidth="m">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            headline: work.title,
            description: work.description,
            url: absoluteUrl("/work"),
            image: ogImage,
            author: {
              "@type": "Person",
              name: person.name,
            },
            hasPart: allProjects.map((project) => ({
              "@type": "CreativeWork",
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
      <Projects />
    </Column>
  );
}
