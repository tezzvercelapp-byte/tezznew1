import CancelPage from "@/app/(components)/CancelPage/CancelPage";
import Footer from "@/app/(components)/Component/Layout/Footer/Footer";
import Header from "@/app/(components)/Component/Layout/Header/Header";
import Main from "@/app/(components)/Component/Main/Main";
import { fetchData, fetchData2 } from "@/app/(components)/fetch/fetch";

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

export default async function PaymentCancelPage({ searchParams, params }) {
  // 1. URL-dən 'up' parametrini götürürük
  const { up } = await searchParams;
  const { code } = await params;
  const { main, hiddens } = await getData(code);

  // 2. Parametr varsa və stringdirsə işə başlayırıq
  if (up && typeof up === "string") {
    try {
      // 3. Base64 dekodlaması
      const jsonString = Buffer.from(up, "base64").toString("utf-8");
      const jsonData = JSON.parse(jsonString);

      // 4. Cancel Webhook-a POST sorğusu göndəririk
      await fetch(
        "https://payments.tezz.az/api/united-payment/webhook/cancel/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonData),
          cache: "no-store", // Keşlənməməsi üçün
        }
      );

      console.log("Cancel webhook sent successfully");
    } catch (err) {
      console.error("Payment cancel webhook error:", err);
    }
  }

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
      <CancelPage
        logo={main?.settings?.logo}
        payment1={main?.translations?.payment_error1}
        payment2={main?.translations?.payment_error2}
        payment3={main?.translations?.payment1_three}
        number={main?.settings?.number}
        contact_text={main?.translations?.contact_text}
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
