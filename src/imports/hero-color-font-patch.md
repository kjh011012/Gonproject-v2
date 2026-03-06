보너스) 개발 적용용 — Hero 색감/폰트 “바로 바꾸는” Tailwind 패치 예시

프롬프트에도 넣었지만, 실제 구현할 때 바로 쓰기 좋게 핵심 변경 예시를 같이 드립니다.
(“오렌지 테크톤 → 따뜻한 의료·돌봄톤”)

1) 히어로 배경 + 오버레이 추가
<div className={`relative w-full h-screen overflow-hidden bg-[#071A2B] ${className}`}>
  <canvas
    ref={canvasRef}
    className="absolute inset-0 w-full h-full object-cover touch-none"
    style={{ background: '#071A2B' }}
  />

  {/* 따뜻한 안개 오버레이 */}
  <div className="absolute inset-0 z-[5] pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-b from-[#071A2B]/20 via-[#071A2B]/55 to-[#071A2B]/85" />
    <div className="absolute -top-24 -left-24 w-[520px] h-[520px] rounded-full bg-[#F6E7D8]/10 blur-3xl" />
    <div className="absolute -bottom-32 -right-32 w-[620px] h-[620px] rounded-full bg-[#BFE9E2]/10 blur-3xl" />
    <div className="absolute top-1/3 -right-40 w-[520px] h-[520px] rounded-full bg-[#CFE8FF]/10 blur-3xl" />
  </div>

  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white font-sans">
    ...
  </div>
</div>
2) TrustBadge (오렌지 제거 + Tailwind 동적 클래스 제거)
<div className="flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-sm">
  <div className="flex gap-1">
    <span className="text-[#F6E7D8]">🫶</span>
    <span className="text-[#CFE8FF]">🏥</span>
    <span className="text-[#BFE9E2]">🤝</span>
  </div>
  <span className="text-white/90">{trustBadge.text}</span>
</div>
3) 헤드라인/서브타이틀/버튼 컬러 조정
<h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight
  bg-gradient-to-r from-[#F6E7D8] via-[#CFE8FF] to-[#BFE9E2]
  bg-clip-text text-transparent">
  {headline.line1}
</h1>

<h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight
  bg-gradient-to-r from-[#CFE8FF] via-[#BFE9E2] to-[#F6E7D8]
  bg-clip-text text-transparent">
  {headline.line2}
</h1>

<p className="text-lg md:text-xl lg:text-2xl text-white/80 font-normal leading-relaxed">
  {subtitle}
</p>

<button className="px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105
  bg-gradient-to-r from-[#BFE9E2] to-[#CFE8FF] text-[#071A2B] shadow-lg shadow-black/20">
  서비스 신청하기
</button>

<button className="px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105
  bg-white/5 hover:bg-white/10 border border-white/15 text-white backdrop-blur-sm">
  조합원 가입하기
</button>
4) 폰트(추천)

Pretendard를 기본으로 쓰려면(예시): Tailwind 설정에 fontFamily.sans로 지정

Figma에도 동일 폰트 지정(제목 800, 본문 400~500)