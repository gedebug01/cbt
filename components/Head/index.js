import Head from 'next/head';

export function Heading({ title }) {
  return (
    <Head>
      <title>{title}</title>
    </Head>
  );
}
