import Image from "next/image";
import Link from "next/link";
import { FcCancel } from "react-icons/fc";
import { FaWhatsapp } from "react-icons/fa";

export default function CancelPage({
  logo,
  payment1,
  payment2,
  payment3,
  number,
  contact_text,
}) {
  const cleanedNumber = number?.replace(/\D/g, "");
  return (
    <main className="min-h-[75vh] lg:min-h-[60vh] flex items-center text-center justify-center text-white text-[30px] flex-col lg:px-[15px]">
      <Image
        width={120}
        height={60}
        alt="tezzpower-logo"
        src={`${process.env.NEXT_PUBLIC_PICTURE}/${logo}`}
        className="mb-[30px]"
      />
      <div className="flex items-center gap-[10px] justify-center lg:mb-[10px]">
        <h2 className="md:text-[20px]">{payment1}</h2>
        <FcCancel className="text-[#bbf843] md:text-[25px]" />
      </div>
      <h2 className="md:text-[20px] lg:mb-[10px]">{payment2}</h2>
      <h2 className="md:text-[20px]">{payment3}</h2>
      <Link
        target="_blank"
        href={`https://wa.me/${cleanedNumber}`}
        className={`bg-[#bbf843] mt-[20px] font-['TTForsMedium'] rounded-[10px] lg:w-max text-[#0F1822] text-[16px] px-[36px] xl:px-[20px] py-[12px] flex h-max items-center gap-[10px]`}
      >
        <span>
          <FaWhatsapp className="text-[20px]" />
        </span>
        {contact_text}
      </Link>
    </main>
  );
}
