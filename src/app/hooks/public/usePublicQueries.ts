import { useEffect, useState } from "react";
import { publicApi } from "../../lib/api/public";

function useSimpleQuery<T>(loader: () => Promise<{ data: T }>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    loader()
      .then((res) => {
        if (mounted) setData(res.data);
      })
      .catch((e) => {
        if (mounted) setError(e instanceof Error ? e.message : "Unknown error");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error };
}

export function usePublicServicesQuery() {
  return useSimpleQuery(() => publicApi.services());
}

export function usePublicServicesConfigQuery() {
  return useSimpleQuery(() => publicApi.servicesConfig());
}

export function usePublicNoticesQuery() {
  return useSimpleQuery(() => publicApi.notices());
}

export function usePublicEventsQuery() {
  return useSimpleQuery(() => publicApi.events());
}

export function usePublicMediaDocsQuery() {
  return useSimpleQuery(() => publicApi.mediaDocs());
}

export function usePublicPhotosQuery() {
  return useSimpleQuery(() => publicApi.photos());
}

export function usePublicFaqsQuery() {
  return useSimpleQuery(() => publicApi.faqs());
}
