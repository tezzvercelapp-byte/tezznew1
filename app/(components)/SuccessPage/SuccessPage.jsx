import Image from "next/image";
import { IoMdCheckbox } from "react-icons/io";
export default function SuccessPage({ logo, payment1, payment2, payment3 }) {
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
        <IoMdCheckbox className="text-[#bbf843] md:text-[25px]" />
      </div>
      <h2 className="md:text-[20px] lg:mb-[10px]">{payment2}</h2>
      <h2 className="md:text-[20px]">{payment3}</h2>
    </main>
  );
}
