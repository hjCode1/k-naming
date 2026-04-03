import InputForm from "../components/InputForm";

function HomePage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      {/* 장식 요소 */}
      <div className="relative mb-8">
        <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-peach/30 blur-2xl" />
        <div className="absolute -top-4 right-0 w-16 h-16 rounded-full bg-gold/30 blur-xl" />
        <div className="relative text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-2">
            우리 아이 이름 짓기
          </h1>
          <p className="text-charcoal/55 text-base">
            사주와 오행을 분석하여 아이에게 딱 맞는 이름을 찾아보세요
          </p>
        </div>
      </div>

      {/* 입력 폼 카드 */}
      <div className="bg-white rounded-2xl shadow-sm border border-peach/20 p-6 md:p-8">
        <InputForm />
      </div>

      {/* 안내 */}
      <p className="text-center text-xs text-charcoal/35 mt-6">
        입력된 정보는 서버에 저장되지 않으며, 브라우저에서만 처리됩니다..
      </p>
    </div>
  );
}

export default HomePage;
