import React from "react";
import Main from "../Component/Main/Main";
import MaxWidth from "../Component/MaxWidth/MaxWidth";

const Offer = ({ offer, user_contract }) => {
  return (
    <Main>
      <section  className="mt-[200px] mb-[100px] ">
        <MaxWidth customClass="max-w-[1596px] bg-[#EFEFEF] rounded-[12px] py-[20px] lg:py-[20px] px-[40px]">
          <div className=" ">
            <h2 className="text-[30px] md:text-[20px] font-['TTForsBold'] mb-[20px]">
              {user_contract}
            </h2>
            <div
              className="text-[16px]"
              dangerouslySetInnerHTML={{
                __html: `${offer?.offer_text1}`,
              }}
            />
          </div>
        </MaxWidth>
      </section>
    </Main>
  );
};

export default Offer;
