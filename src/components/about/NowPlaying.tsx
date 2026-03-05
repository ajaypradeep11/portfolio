"use client";

import { Flex } from "@/once-ui/components";
import styles from "./nowPlaying.module.scss";

interface NowPlayingProps {
  song: string;
}

export default function NowPlaying({ song }: NowPlayingProps) {
  return (
    <Flex
      vertical="center"
      horizontal="center"
      gap="8"
      fillWidth
      className={styles.container}
    >
      <div className={styles.bars}>
        <span className={styles.bar} />
        <span className={styles.bar} />
        <span className={styles.bar} />
        <span className={styles.bar} />
      </div>
      <div className={styles.marquee}>
        <span className={styles.track}>
          {song}&nbsp;&nbsp;&#9835;&nbsp;&nbsp;{song}&nbsp;&nbsp;&#9835;&nbsp;&nbsp;
        </span>
      </div>
    </Flex>
  );
}
