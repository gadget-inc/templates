import { useEffect } from "react";
import stripeLogo from "../assets/stripe-logo.svg";
import { useQuery } from "@gadgetinc/react";

export default function () {
  const [
    {
      data: metaData,
      fetching: fetchingMetadata,
      error: errorFetchingMetadata,
    },
  ] = useQuery({
    query: `
      query {
        gadgetMeta {
          environmentSlug
          slug
        }
      }
    `,
  });

  useEffect(() => {
    if (!fetchingMetadata && errorFetchingMetadata)
      console.error(errorFetchingMetadata);
  }, [fetchingMetadata, errorFetchingMetadata]);

  if (fetchingMetadata) return <div>Loading...</div>;

  return (
    <>
      <div className="app-link">
        <img src={stripeLogo} className="app-logo" alt="logo" />
        <span>{process.env.GADGET_PUBLIC_APP_SLUG} requires some setup</span>
      </div>
      <div>
        <p className="description">Follow the template documentation:</p>
        <a
          href={`https://docs.gadget.dev/api/${metaData.gadgetMeta.slug}/${metaData.gadgetMeta.environmentSlug}/template-setup`}
          target="_blank"
          rel="noreferrer"
          style={{ fontWeight: 500 }}
        >
          See instructions
        </a>
      </div>
    </>
  );
}
