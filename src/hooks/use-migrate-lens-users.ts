import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ExploreProfilesOrderByType,
  LimitType,
  useExploreProfiles,
} from '@lens-protocol/react-web';
import {
  useCreateUserMutation,
  useGetUserLazyQuery,
} from '@src/graphql/generated/hooks';


const sanitizeBio = (raw: string | undefined): string => {
  const base = (raw ?? '').replace(/\s*\n+\s*/g, ' ').trim();

  if (base.length < 10) {
    const extra = ' • watchit web3 enthusiast';
    return (base + extra).slice(0, 200);
  }
  if (base.length > 200) {
    return base.slice(0, 197).trimEnd() + '…';
  }
  return base;
};

const sanitizeUsername = (raw: string | undefined): string => {
  const base = (raw ?? '').replace(/\s*\n+\s*/g, ' ').trim();

  if (base.length > 15) {
    return base.slice(0, 14).trimEnd();
  }
  return base;
};

const mapProfile = (p: any) => {
  const md = p.metadata ?? {};
  const attrs = Array.isArray(md.attributes) ? md.attributes : [];

  return {
    address: p.ownedBy.address,
    username: sanitizeUsername(p.handle.localName),
    displayName: md.displayName,
    bio: sanitizeBio(md.bio),
    email: 'placeholder@email.com',
    profilePicture:
      md.picture?.raw?.uri ?? md.picture?.optimized?.uri ?? null,
    coverPicture:
      md.coverPicture?.raw?.uri ?? md.coverPicture?.optimized?.uri ?? null,
    socialLinks: attrs
      .filter((a) => a.key === 'link' && a.value)
      .map((a) => ({ platform: a.traitType ?? 'web', url: a.value })),
  };
};

export const useMigrateLensUsers = () => {
  const HARD_LIMIT  = 300;
  const FETCH_LIMIT = 1500;
  const DELAY_MS    = 10000;

  const { data: lensPage, hasMore, next } = useExploreProfiles({
    orderBy: ExploreProfilesOrderByType.LatestCreated,
    limit: LimitType.Fifty,
  });

  const [getUser]    = useGetUserLazyQuery({ fetchPolicy: 'network-only' });
  const [createUser] = useCreateUserMutation();

  const collected     = useRef<any[]>([]);
  const seenIds       = useRef<Set<string>>(new Set());
  const cacheExisting = useRef<Set<string>>(new Set());
  const processingRef = useRef(false);

  const [queueReady, setQueueReady] = useState(false);
  const doneRef = useRef(0);
  const [done, setDone] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (queueReady || !lensPage?.length) return;

    let added = 0;
    for (const profile of lensPage) {
      if (seenIds.current.has(profile.id)) continue;
      seenIds.current.add(profile.id);
      collected.current.push(profile);
      added += 1;
    }
    if (added) {
      console.log(`Recolectados ${collected.current.length} perfiles...`);
    }

    if (collected.current.length < FETCH_LIMIT && hasMore) {
      next();
    } else {
      setQueueReady(true);
    }
  }, [lensPage, hasMore, next, queueReady]);

  const buildQueue = useCallback(() => {
    const filtered = collected.current.filter(
      (p) =>
        p.metadata?.displayName &&
        p.metadata?.bio &&
        !p.metadata.bio.includes('###HIDDEN###'),
    );

    filtered.sort(
      (a: any, b: any) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    const seenAddr = new Set<string>();
    const unique: any[] = [];
    for (const p of filtered) {
      const addr = p.ownedBy.address;
      if (seenAddr.has(addr)) continue;
      seenAddr.add(addr);
      unique.push(p);
    }
    return unique;
  }, []);

  const processQueue = useCallback(
    async (queue: any[]) => {
      for (const p of queue) {
        if (doneRef.current >= HARD_LIMIT) break;

        const address = p.ownedBy.address;
        if (cacheExisting.current.has(address)) continue;

        try {
          console.log('process address', address);
          const { data } = await getUser({ variables: { address } });
          if (data?.getUser) {
            cacheExisting.current.add(address);
            continue;
          }

          const input = mapProfile(p);
          console.log('create user', input);
          await createUser({ variables: { input } });

          cacheExisting.current.add(address);
          setDone((prev) => {
            doneRef.current = prev + 1;
            return prev + 1;
          });

          await new Promise((r) => setTimeout(r, DELAY_MS));
        } catch (e: any) {
          setErrors((prev) => [
            ...prev,
            `${p.handle?.fullHandle ?? address}: ${e.message}`,
          ]);
        }
      }
    },
    [getUser, createUser],
  );

  useEffect(() => {
    if (queueReady && !processingRef.current) {
      processingRef.current = true;
      const queue = buildQueue();
      processQueue(queue);
    }
  }, [queueReady, buildQueue, processQueue]);

  return {
    done,
    max: HARD_LIMIT,
    collected: collected.current.length,
    errors,
    loadingBatch: processingRef.current && done < HARD_LIMIT,
    finished: done >= HARD_LIMIT,
  };
};
