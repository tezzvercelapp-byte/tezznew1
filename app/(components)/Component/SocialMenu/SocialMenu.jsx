import Image from "next/image";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";

const SocialButton = ({ settings }) => {
  return (
    <div className="fixed right-[40px] lg:right-[20px] bottom-[80px] z-[200] h-[50px] w-[50px] flex flex-col justify-end items-center pb-10">
      <div className="group relative flex flex-col items-center ">
        <div className="absolute bottom-full mb-3 flex flex-col gap-3 items-center opacity-0 invisible translate-y-4 scale-90 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:scale-100">
          <a
            target="_blank"
            href={`/${settings?.telegram}`}
            className="w-[40px] h-[40px] p-[5px] bg-[#0088cc] rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform duration-200 delay-150 mb-[10px] text-[20px]"
          >
            <FaTelegramPlane />
          </a>

          <a
            target="_blank"
            href={`https://wa.me/${settings?.number}`}
            className="w-[40px] h-[40px] p-[5px] bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform duration-200 delay-75 mb-[10px] text-[20px]"
          >
            <FaWhatsapp />
          </a>
        </div>

        <button className="w-[50px] h-[50px] bg-[#C1F13D] text-black rounded-md flex items-center justify-center shadow-xl z-10 transition-transform active:scale-95">
          <Image
            width={40}
            height={40}
            alt="soclais"
            src={"/socials.svg"}
            className="p-[5px]"
          />
        </button>
      </div>
    </div>
  );
};

export default SocialButton;
