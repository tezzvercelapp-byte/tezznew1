import Footer from "@/app/(components)/Component/Layout/Footer/Footer";
import Header from "@/app/(components)/Component/Layout/Header/Header";
import Main from "@/app/(components)/Component/Main/Main";
import { fetchData, fetchData2 } from "@/app/(components)/fetch/fetch";
import SuccessPage from "@/app/(components)/SuccessPage/SuccessPage";

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
      title: `${main?.settings?.title} - ${main?.translations?.payment1}`,
      description: main?.settings?.description,
      keywords: main?.settings?.keywords,
      icons: {
        icon: faviconUrl,
        apple: faviconUrl,
      },
      openGraph: {
        title: `${main?.settings?.title} - ${main?.translations?.payment1}`,
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
export default async function SuccessPageRoot({ searchParams, params }) {
  // 1. URL-dən 'up' parametrini götürürük
  const { up } = await searchParams;
  const { code } = await params;
  const { main, hiddens } = await getData(code);

  if (up) {
    try {
      // 2. Base64 string-i dekod edib JSON obyektinə çeviririk
      // Next.js Server Component-də Node.js-in 'Buffer' funksiyası işləyir
      const jsonString = Buffer.from(up, "base64").toString("utf-8");
      const jsonData = JSON.parse(jsonString);

      // 3. Webhook-a POST sorğusu göndəririk (Tələbə uyğun olaraq)
      await fetch(
        "https://payments.tezz.az/api/united-payment/webhook/success/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonData),
          cache: "no-store", // Keşlənməməsi üçün vacibdir
        }
      );
    } catch (err) {
      console.error("Success Webhook Error:", err);
    }
  }

  // 4. UI Səhifəsini render edirik
  return (
    <>
      <Header
        params_code={code}
        header_data={main?.navigation_menu}
        settings={main?.settings}
        order_now={main?.translations?.order_now}
        hiddens={hiddens}
        hidden_text={main?.translations?.header_text}
      />
      <SuccessPage
        logo={main?.settings?.logo}
        payment1={main?.translations?.payment1_frist}
        payment2={main?.translations?.payment1_second}
        payment3={main?.translations?.payment1_three}
      />
      <Main isTrue={true}>
        <Footer
          settings={main?.settings}
          params_code={code}
          header_data={main?.navigation_menu}
          text1={main?.translations?.privacy_policy}
          text2={main?.translations?.terms_and_conditions}
          desig_and_spirit={main?.translations?.desig_and_spirit}
          phone={main?.translations?.phone}
          email={main?.translations?.email}
          text3={main?.translations?.messaging_terms}
          order_now={main?.translations?.order_now}
          contact_text={main?.translations?.contact_text}
        />
      </Main>
    </>
  );
}
