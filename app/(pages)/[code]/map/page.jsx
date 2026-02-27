import Footer from "@/app/(components)/Component/Layout/Footer/Footer";
import Header from "@/app/(components)/Component/Layout/Header/Header";
import Main from "@/app/(components)/Component/Main/Main";
import { fetchData, fetchData2 } from "@/app/(components)/fetch/fetch";
import MapComponent from "@/app/(components)/Map/Map";

import ScrollToTop from "@/app/(components)/ScrollToTop/ScrollToTop";

const getData = async (code) => {
  const main = await fetchData(code, "one_page");

  const hiddens = await fetchData2("home_sections");

  return { main, hiddens };
};

export async function generateMetadata({ params }) {
  try {
    const { code } = await params;
    const { main } = await getData(code);

    const baseUrl = `${process.env.NEXT_PUBLIC_SITE_NAME}`;
    const pictureBaseUrl = process.env.NEXT_PUBLIC_PICTURE;
    const logoUrl = `${pictureBaseUrl}/${main?.settings?.logo}`;
    const faviconUrl = `${pictureBaseUrl}/${main?.settings?.favicon}`;

    return {
      title: `${main?.settings?.title}`,
      description: main?.settings?.description,
      keywords: main?.settings?.keywords,
      icons: {
        icon: faviconUrl,
        apple: faviconUrl,
      },
      openGraph: {
        title: `${main?.settings?.title} `,
        description: main?.settings?.description,
        keywords: main?.settings?.keywords,
        url: `${baseUrl}/${code}`,
        siteName: `${baseUrl}/${code}`,
        type: "website",
        image: logoUrl,
        images: [
          {
            url: logoUrl,
            secure_url: logoUrl,
            width: 100,
            height: 60,
            type: "image/png",
            alt: main?.settings?.title,
          },
        ],
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
    return new Response("Internal Server Error", { status: 500 });
  }
}

export default async function page({ params }) {
  const { code } = await params;
  const { main, hiddens } = await getData(code);
  return (
    <>
      <MapComponent
        iam_here={main?.translations?.iam_here}
        you_are_here={main?.translations?.you_are_here}
        geo_problem={main?.translations?.geo_problem}
        looking={main?.translations?.looking}
        buy_power={main?.translations?.buy_power}
        refund_power={main?.translations?.refund_power}
        action_text={main?.translations?.action_text}
        enter_link={main?.translations?.enter_link}
        station_qr={main?.translations?.station_qr}
        available_power={main?.translations?.available_power}
        empty_slots={main?.translations?.empty_slots}
        no_information={main?.translations?.no_information}
        gis_text={main?.translations?.gis_text}
        not_found_location={main?.translations?.not_found_location}
        geo_not_found={main?.translations?.geo_not_found}
        no_wifi={main?.translations?.no_wifi}
        browser_not={main?.translations?.browser_not}
      />
    </>
  );
}
