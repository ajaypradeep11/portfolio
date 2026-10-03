import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/mdx";
import { getPosts } from "@/app/utils/utils";
import { Button, Column, Heading, SmartLink } from "@/once-ui/components";
import { absoluteUrl } from "@/app/resources";
import { getLiveDemoByWorkSlug } from "@/app/resources/liveDemos";
import { person, work } from "@/app/resources/content";
import { formatDate } from "@/app/utils/formatDate";
import ScrollToHash from "@/components/ScrollToHash";
import { createMetadata, createOgImageUrl, toAbsoluteUrl } from "@/app/utils/metadata";
import { LiveDemoFrame } from "@/components/work/LiveDemoFrame";
import { ClinicVoiceDemo } from "@/components/work/ClinicVoiceDemo";
import { ProjectScreenshot } from "@/components/work/ProjectScreenshot";
import styles from "@/components/work/ProjectStudy.module.scss";

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

  const screenshots = post.metadata.screenshots.length
    ? post.metadata.screenshots
    : post.metadata.images.map((src, index) => ({
        src,
        title: `${post.metadata.title} — Screen ${index + 1}`,
        description: post.metadata.summary,
      }));
  const liveDemo = getLiveDemoByWorkSlug(post.slug);
  const isClinicVoiceDemo = post.slug === "clinic-booking-voice-assistant";
  const postImage =
    toAbsoluteUrl(post.metadata.image || post.metadata.images[0]) ||
    createOgImageUrl(post.metadata.title);

  return (
    <Column as="section" fillWidth maxWidth="xl" className={styles.study}>
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
      <Button href="/work" variant="tertiary" weight="default" size="s" prefixIcon="chevronLeft">
        All projects
      </Button>
      <header className={styles.header}>
        <div className={styles.intro}>
          <span className={styles.kicker}>Software project · {post.metadata.ongoing ? "Ongoing" : "Case study"}</span>
          <Heading as="h1" variant="display-strong-s">{post.metadata.title}</Heading>
          <p className={styles.summary}>{post.metadata.summary}</p>
        </div>
        <dl className={styles.facts}>
          {post.metadata.team.length > 0 && (
            <div>
              <dt>Role & team</dt>
              <dd>{post.metadata.team.map((member) => (
                <div key={member.name}>{member.name} · {member.role}</div>
              ))}</dd>
            </div>
          )}
          {post.metadata.publishedAt && (
            <div><dt>Published</dt><dd>{formatDate(post.metadata.publishedAt)}</dd></div>
          )}
          {post.metadata.link && (
            <div><dt>Explore</dt><dd><SmartLink href={post.metadata.link} suffixIcon="arrowUpRightFromSquare">View project</SmartLink></dd></div>
          )}
        </dl>
      </header>
      {!isClinicVoiceDemo && screenshots.length > 0 && (
        <div className={styles.gallery}>
          {screenshots.map((screenshot, index) => (
            <ProjectScreenshot key={screenshot.src} {...screenshot} index={index} />
          ))}
        </div>
      )}
      {(isClinicVoiceDemo || liveDemo) && (
        <section className={styles.demo} aria-label="Live project demo">
          <Heading as="h2" variant="heading-strong-xl">Try the live demo</Heading>
          {isClinicVoiceDemo ? <ClinicVoiceDemo /> : liveDemo && (
            <LiveDemoFrame
              title={liveDemo.title}
              description={liveDemo.description}
              src={liveDemo.src}
              standaloneHref={liveDemo.standalonePath}
              frameHeight={liveDemo.frameHeight}
              fallbackImage={post.metadata.image || post.metadata.images[0] || liveDemo.fallbackImage}
              fallbackAlt={post.metadata.title}
            />
          )}
        </section>
      )}
      {screenshots.length ? (
        <details className={styles.notes}>
          <summary>Engineering notes & project details</summary>
          <article className={styles.notesBody}><CustomMDX source={post.content} /></article>
        </details>
      ) : (
        <article className={styles.notesBody}><CustomMDX source={post.content} /></article>
      )}
      <ScrollToHash />
    </Column>
  );
}
