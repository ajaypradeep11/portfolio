import { getPosts } from "@/app/utils/utils";
import { Column } from "@/once-ui/components";
import { ProjectCard } from "@/components";

interface ProjectsProps {
  range?: [number, number?];
  priorityFirst?: boolean;
  homepagePreview?: boolean;
}

export function Projects({ range, priorityFirst = false, homepagePreview = false }: ProjectsProps) {
  let allProjects = getPosts(["src", "app", "work", "projects"]);

  const dateSortedProjects = allProjects.sort((a, b) => {
    return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
  });

  const positionedProjects = dateSortedProjects
    .filter((project) => project.metadata.featuredPosition !== undefined)
    .sort((a, b) => a.metadata.featuredPosition! - b.metadata.featuredPosition!);
  const sortedProjects = dateSortedProjects.filter(
    (project) => project.metadata.featuredPosition === undefined,
  );

  positionedProjects.forEach((project) => {
    const index = Math.max(
      0,
      Math.min(project.metadata.featuredPosition! - 1, sortedProjects.length),
    );
    sortedProjects.splice(index, 0, project);
  });

  const displayedProjects = range
    ? sortedProjects.slice(range[0] - 1, range[1] ?? sortedProjects.length)
    : sortedProjects;

  return (
    <Column fillWidth gap="xl" marginBottom="40" paddingX="l">
      {displayedProjects.map((post, index) => (
        <ProjectCard
          priority={priorityFirst && index === 0}
          key={post.slug}
          href={`/work/${post.slug}`}
          images={
            homepagePreview && post.metadata.homepageImages?.length
              ? post.metadata.homepageImages
              : post.metadata.images
          }
          title={post.metadata.title}
          description={post.metadata.summary}
          content={post.content}
          avatars={post.metadata.team?.map((member) => ({ src: member.avatar })) || []}
          link={post.metadata.link || ""}
          ongoing={post.metadata.ongoing}
        />
      ))}
    </Column>
  );
}
