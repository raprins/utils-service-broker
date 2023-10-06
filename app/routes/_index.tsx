import { OsbApiBroker } from "@raprincis/service-broker";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Broker Service" },
    { name: "description", content: "Service Broker with Ui" },
  ];
};

export const loader:LoaderFunction = ({context}) => {

  const { services } = context.broker as OsbApiBroker

  return {
    services
  }
}

export default function Index() {

  const data = useLoaderData<typeof loader>()

  return (
    <>
    {JSON.stringify(data)}
    </>
  )
}
