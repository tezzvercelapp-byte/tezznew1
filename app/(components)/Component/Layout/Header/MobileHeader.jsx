import Link from "next/link";
import { IoClose } from "react-icons/io5";

// params prop'unu buraya ekledik
const MobileHeader = ({
  headerLinks,
  closeMobileMneu,
  mobileMenu,
  params,
  handleLangChange,
  currentLang,
}) => {
  return (
    <div
      ref={mobileMenu}
      className="fixed top-[-100%] h-[280px] w-full z-[1000] left-0 bg-[--bgColor] box-shdaow-1 transtion1"
    >
      <ul className="flex items-center w-full justify-center flex-col  gap-[20px] border border-[#1D2C2F] h-full">
        {headerLinks?.map((item) => {
          // === YENİ EKLENEN KISIM BAŞLANGIÇ ===
          // Eğer dil 'az' ise prefix boş olsun, değilse '/en' vb. olsun.
          const urlPrefix = params === "az" ? "" : `/${params}`;
          const fullUrl =
            item?.slug_url === "map"
              ? `https://tezz.az${urlPrefix}/${item?.slug_url}`
              : `/${urlPrefix}/${item?.slug_url}`;
          // === YENİ EKLENEN KISIM BİTİŞ ===

          return (
            <li
              key={item?.id}
              className="text-[#DFDFDF] text-[16px] font-medium w-max"
            >
              <Link
                onClick={closeMobileMneu}
                className="w-max"
                href={fullUrl} // href güncellendi
              >
                {item?.name}
              </Link>
            </li>
          );
        })}
        <div className="flex items-center gap-4 text-[16px] font-semibold ">
          <span
            onClick={() => handleLangChange("en")}
            className={`cursor-pointer hover:text-[#bbf843] transition-all ${
              currentLang === "en"
                ? "text-[#bbf843]" // Active style
                : "text-[#DFDFDF]" // Inactive style
            }`}
          >
            ENG
          </span>
          <span className="w-[1px] h-[32px] flex bg-[#243140]"></span>
          <span
            onClick={() => handleLangChange("az")}
            className={`cursor-pointer hover:text-[#bbf843] transition-all ${
              currentLang === "az"
                ? "text-[#bbf843]" // Active style
                : "text-[#DFDFDF]" // Inactive style
            }`}
          >
            AZ
          </span>
        </div>
      </ul>

      <span
        onClick={closeMobileMneu}
        className="absolute top-[20px] right-[30px] text-[#bbf843] text-[25px] cursor-pointer"
      >
        <IoClose />
      </span>
    </div>
  );
};

export default MobileHeader;
