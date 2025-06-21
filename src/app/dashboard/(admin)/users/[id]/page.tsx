interface UserPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserPage(props: UserPageProps) {
  const { id } = await props.params;

  return <div>{id}</div>;
}
