import { useState, useRef, useEffect, useCallback } from 'react';
import bgLeaflet from "../../assets/c82d547cfc04e53233a7b029224cca847b2c9e03.png";
import '../../styles/membership-form.css';

/* ═══════════════════════════════════════════
   조합원 가입 신청서
   — 리플렛 배경 이미지 위에 HTML 폼 오버레이
   
   배경 이미지: 2289×2016
   폼 위치(Figma): left:51.5  top:682  w:1024  h:1263
   → %: left:2.25%  top:33.83%  w:44.73%  h:62.65%
   ═══════════════════════════════════════════ */

const INTEREST_LABELS: Record<string, string> = {
  visitCare: '방문진료',
  care: '돌봄',
  forestHealing: '산림치유',
  healthyMeal: '건강밥상 식생활',
  producePackage: '농임산물꾸러미',
};

const initialForm = {
  name: '',
  gender: '' as '' | '남' | '여',
  phone: '',
  email: '',
  address: '',
  interests: {
    visitCare: false,
    care: false,
    forestHealing: false,
    healthyMeal: false,
    producePackage: false,
  } as Record<string, boolean>,
  privacyConsent: false,
  memberPromise: false,
  year: '',
  month: '',
  day: '',
  applicant: '',
  signature: '',
};

export function MembershipForm() {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [hoverPopup, setHoverPopup] = useState<'name' | 'phone' | 'email' | 'address' | 'interest' | 'fund' | 'consent' | 'bottom' | null>(null);
  const [showSignPad, setShowSignPad] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const signCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  /* ── 서명 패드 캔버스 초기화 ── */
  const initSignCanvas = useCallback((canvas: HTMLCanvasElement | null) => {
    signCanvasRef.current = canvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = signCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      const t = e.touches[0];
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
  };

  const onSignStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDrawingRef.current = true;
    lastPosRef.current = getPos(e);
  };

  const onSignMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const ctx = signCanvasRef.current?.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPosRef.current = pos;
  };

  const onSignEnd = () => { isDrawingRef.current = false; };

  const clearSignCanvas = () => {
    const canvas = signCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, rect.width, rect.height);
  };

  const confirmSignature = () => {
    const canvas = signCanvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    setSignatureDataUrl(dataUrl);
    setForm((p) => ({ ...p, signature: '(서명완료)' }));
    setShowSignPad(false);
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const toggleInterest = (k: string) => () =>
    setForm((p) => ({
      ...p,
      interests: { ...p.interests, [k]: !p.interests[k] },
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { window.alert('성명을 입력해주세요.'); return; }
    if (!form.phone.trim()) { window.alert('연락처를 입력해주세요.'); return; }
    if (!form.address.trim()) { window.alert('주소를 입력해주세요.'); return; }
    if (!form.privacyConsent || !form.memberPromise) {
      window.alert('동의 항목을 모두 체크해주세요.');
      return;
    }
    const payload = {
      ...form,
      interests: Object.entries(form.interests)
        .filter(([, v]) => v)
        .map(([k]) => INTEREST_LABELS[k]),
      submittedAt: new Date().toISOString(),
    };
    try {
      setSubmitting(true);
      const url = (import.meta as any).env?.VITE_MEMBERSHIP_API_URL;
      if (!url) {
        console.log('제출 데이터:', payload);
        window.alert('가 신청이 접수되었습니다.\n(백엔드 연결 전이라 콘솔에 기록됩니다.)');
        return;
      }
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error('전송 실패');
      window.alert('가입 신청이 정상 접수되었습니다.');
      setForm(initialForm);
    } catch {
      window.alert('제출 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mf-shell">
      {/* ═══ 배경 이미지 + 폼 오버레이 컨테이너 ═══ */}
      <div className="mf-leaflet-wrap">
        {/* 배경 리플렛 이미지 */}
        <img
          src={bgLeaflet}
          alt="조합 리플렛"
          className="mf-leaflet-bg"
          draggable={false}
        />

        {/* 폼 오버레이 (좌측 패널 위) */}
        <form className="mf-form-overlay" onSubmit={handleSubmit}>
          {/* ═══ 테이블 본문 ═══ */}
          <div className="mf-body">
            {/* ── 성명 + 성별 ── */}
            <div
              className="mf-row mf-hoverable"
              onMouseEnter={() => setHoverPopup('name')}
              onMouseLeave={() => setHoverPopup(null)}
            >
              <div className="mf-label">성명</div>
              <div className="mf-field mf-field--name">
                <input
                  type="text"
                  className="mf-input"
                  value={form.name}
                  onChange={set('name')}
                  placeholder="이름을 입력해주세요"
                  autoComplete="name"
                />
                <div className="mf-gender-group">
                  <span className="mf-gender-paren">(</span>
                  <button
                    type="button"
                    className={`mf-gender-btn ${form.gender === '남' ? 'active' : ''}`}
                    onClick={() => setForm((p) => ({ ...p, gender: p.gender === '남' ? '' : '남' }))}
                  >남</button>
                  <span className="mf-gender-slash">/</span>
                  <button
                    type="button"
                    className={`mf-gender-btn ${form.gender === '여' ? 'active' : ''}`}
                    onClick={() => setForm((p) => ({ ...p, gender: p.gender === '여' ? '' : '여' }))}
                  >여</button>
                  <span className="mf-gender-paren">)</span>
                </div>
              </div>
              {hoverPopup === 'name' && (
                <div className="mf-hover-popup">
                  <div className="mf-hover-popup-title">성명</div>
                  <div className="mf-hover-popup-body">
                    <p><strong>이름</strong>을 입력하고, 성별(남/여)을 선택해주세요.</p>
                    <p>입력값: {form.name || '(미입력)'} {form.gender ? `/ ${form.gender}` : ''}</p>
                  </div>
                </div>
              )}
            </div>

            {/* ── 연락처 ── */}
            <div
              className="mf-row mf-hoverable"
              onMouseEnter={() => setHoverPopup('phone')}
              onMouseLeave={() => setHoverPopup(null)}
            >
              <div className="mf-label">연락처</div>
              <div className="mf-field">
                <input type="tel" className="mf-input" value={form.phone} onChange={set('phone')} placeholder="010-0000-0000" autoComplete="tel" inputMode="tel" />
              </div>
              {hoverPopup === 'phone' && (
                <div className="mf-hover-popup">
                  <div className="mf-hover-popup-title">연락처</div>
                  <div className="mf-hover-popup-body">
                    <p>연락 가능한 <strong>휴대전화 번호</strong>를 입력해주세요.</p>
                    <p>예시: 010-1234-5678</p>
                    <p>입력값: {form.phone || '(미입력)'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* ── 이메일 ── */}
            <div
              className="mf-row mf-hoverable"
              onMouseEnter={() => setHoverPopup('email')}
              onMouseLeave={() => setHoverPopup(null)}
            >
              <div className="mf-label">이메일</div>
              <div className="mf-field">
                <input type="email" className="mf-input" value={form.email} onChange={set('email')} placeholder="email@example.com" autoComplete="email" inputMode="email" />
              </div>
              {hoverPopup === 'email' && (
                <div className="mf-hover-popup">
                  <div className="mf-hover-popup-title">이메일</div>
                  <div className="mf-hover-popup-body">
                    <p>조합 소식 및 안내를 받으실 <strong>이메일 주소</strong>를 입력해주세요.</p>
                    <p>예시: hongildong@email.com</p>
                    <p>입력값: {form.email || '(미입력)'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* ── 주소 ── */}
            <div
              className="mf-row mf-hoverable"
              onMouseEnter={() => setHoverPopup('address')}
              onMouseLeave={() => setHoverPopup(null)}
            >
              <div className="mf-label">주소</div>
              <div className="mf-field">
                <input type="text" className="mf-input" value={form.address} onChange={set('address')} placeholder="거주지 주소를 입력해주세요" autoComplete="street-address" />
              </div>
              {hoverPopup === 'address' && (
                <div className="mf-hover-popup">
                  <div className="mf-hover-popup-title">주소</div>
                  <div className="mf-hover-popup-body">
                    <p>현재 <strong>거주지 주소</strong>를 입력해주세요.</p>
                    <p>예시: 강원특별자치도 원주시 ○○로 123</p>
                    <p>입력값: {form.address || '(미입력)'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* ── 관심분야 ── */}
            <div
              className="mf-row mf-row--interest mf-hoverable"
              onMouseEnter={() => setHoverPopup('interest')}
              onMouseLeave={() => setHoverPopup(null)}
            >
              <div className="mf-label">관심분야</div>
              <div className="mf-field mf-field--checks">
                <div className="mf-check-grid">
                  <label className="mf-check-item">
                    <input type="checkbox" checked={form.interests.visitCare} onChange={toggleInterest('visitCare')} />
                    <span className="mf-checkbox" />
                    <span>방문진료</span>
                  </label>
                  <label className="mf-check-item">
                    <input type="checkbox" checked={form.interests.care} onChange={toggleInterest('care')} />
                    <span className="mf-checkbox" />
                    <span>돌봄</span>
                  </label>
                  <label className="mf-check-item">
                    <input type="checkbox" checked={form.interests.forestHealing} onChange={toggleInterest('forestHealing')} />
                    <span className="mf-checkbox" />
                    <span>산림치유</span>
                  </label>
                  <label className="mf-check-item">
                    <input type="checkbox" checked={form.interests.healthyMeal} onChange={toggleInterest('healthyMeal')} />
                    <span className="mf-checkbox" />
                    <span>건강밥상 식생활</span>
                  </label>
                  <label className="mf-check-item">
                    <input type="checkbox" checked={form.interests.producePackage} onChange={toggleInterest('producePackage')} />
                    <span className="mf-checkbox" />
                    <span>농임산물꾸러미</span>
                  </label>
                </div>
              </div>
              {hoverPopup === 'interest' && (
                <div className="mf-hover-popup">
                  <div className="mf-hover-popup-title">관심분야</div>
                  <div className="mf-hover-popup-body">
                    <p>관심 있는 분야를 모두 선택해주세요:</p>
                    <p>{form.interests.visitCare ? '☑' : '☐'} <strong>방문진료</strong> — 의료진이 직접 방문하여 진료</p>
                    <p>{form.interests.care ? '☑' : '☐'} <strong>돌봄</strong> — 일상생활 돌봄 서비스</p>
                    <p>{form.interests.forestHealing ? '☑' : '☐'} <strong>산림치유</strong> — 자연 속 치유 프로그램</p>
                    <p>{form.interests.healthyMeal ? '☑' : '☐'} <strong>건강밥상 식생활</strong> — 건강한 식단 지원</p>
                    <p>{form.interests.producePackage ? '☑' : '☐'} <strong>농임산물꾸러미</strong> — 지역 농산물 배송</p>
                  </div>
                </div>
              )}
            </div>

            {/* ── 출자금안내 ── */}
            <div
              className="mf-section-block mf-hoverable"
              onMouseEnter={() => setHoverPopup('fund')}
              onMouseLeave={() => setHoverPopup(null)}
            >
              <div className="mf-section-title">출자금안내</div>
              <div className="mf-section-body">
                <p>* 조합비는 1구좌 5만원입니다.</p>
                <p>* <span style={{ fontWeight: 700 }}>계좌번호</span> : 산림조합 203-12-0040545</p>
                <p>* <span style={{ fontWeight: 700 }}>예금주</span> : 이재명(강원농산어촌의료복지사회적협동조합)</p>
              </div>
              {hoverPopup === 'fund' && (
                <div className="mf-hover-popup">
                  <div className="mf-hover-popup-title">출자금안내</div>
                  <div className="mf-hover-popup-body">
                    <p>• 조합비는 1구좌 <strong>5만원</strong>입니다.</p>
                    <p>• <strong>계좌번호</strong> : 산림조합 203-12-0040545</p>
                    <p>• <strong>예금주</strong> : 이재명(강원농산어촌의료복지사회적협동조합)</p>
                  </div>
                </div>
              )}
            </div>

            {/* ── 동의 체크박스 ── */}
            <div
              className="mf-consent-block mf-hoverable"
              onMouseEnter={() => setHoverPopup('consent')}
              onMouseLeave={() => setHoverPopup(null)}
            >
              <label className="mf-consent-item">
                <input type="checkbox" checked={form.privacyConsent} onChange={() => setForm((p) => ({ ...p, privacyConsent: !p.privacyConsent }))} />
                <span className="mf-checkbox" />
                <span>개인정보 보호법에 관한 법률에 의거하여 개인정보 수집 및 이용에 동의합니다.</span>
              </label>
              <label className="mf-consent-item">
                <input type="checkbox" checked={form.memberPromise} onChange={() => setForm((p) => ({ ...p, memberPromise: !p.memberPromise }))} />
                <span className="mf-checkbox" />
                <span>강원농산어촌의료복지사회적협동조합의 조합원으로서 권리와 의무를 다할 것을 약속합니다.</span>
              </label>
              {hoverPopup === 'consent' && (
                <div className="mf-hover-popup">
                  <div className="mf-hover-popup-title">동의 사항</div>
                  <div className="mf-hover-popup-body">
                    <p>☑ 개인정보 보호법에 관한 법률에 의거하여 개인정보 수집 및 이용에 동의합니다.</p>
                    <p>☑ 강원농산어촌의료복지사회적협동조합의 조합원으로서 권리와 의무를 다할 것을 약속합니다.</p>
                  </div>
                </div>
              )}
            </div>

            {/* ── 하단: QR + 날짜 + 신청인/서명 ── */}
            <div className="mf-bottom-row">
              <div
                className="mf-bottom-right mf-hoverable"
                onMouseEnter={() => setHoverPopup('bottom')}
                onMouseLeave={() => setHoverPopup(null)}
              >
                <div className="mf-date-line">
                  <span>20</span>
                  <input type="text" className="mf-date-input" value={form.year} onChange={set('year')} placeholder="__" maxLength={2} inputMode="numeric" />
                  <span>년</span>
                  <input type="text" className="mf-date-input" value={form.month} onChange={set('month')} placeholder="__" maxLength={2} inputMode="numeric" />
                  <span>월</span>
                  <input type="text" className="mf-date-input" value={form.day} onChange={set('day')} placeholder="__" maxLength={2} inputMode="numeric" />
                  <span>일</span>
                </div>
                <div className="mf-sign-line">
                  <span className="mf-sign-label">신청인</span>
                  <input type="text" className="mf-sign-input" value={form.applicant} onChange={set('applicant')} placeholder="이름" />
                  <span className="mf-sign-label">(서명)</span>
                  <button
                    type="button"
                    className="mf-sign-input mf-sign-trigger"
                    onClick={() => { setShowSignPad(true); setSignatureDataUrl(null); }}
                  >
                    {signatureDataUrl ? (
                      <img src={signatureDataUrl} alt="서명" className="mf-sign-preview" />
                    ) : (
                      <span className="mf-sign-placeholder">클릭하여 서명</span>
                    )}
                  </button>
                </div>
                {hoverPopup === 'bottom' && (
                  <div className="mf-hover-popup">
                    <div className="mf-hover-popup-title">📅 신청일자 · 신청인 서명</div>
                    <div className="mf-hover-popup-body">
                      <p><strong>신청일자:</strong> 20{form.year || '__'}년 {form.month || '__'}월 {form.day || '__'}일</p>
                      <p><strong>신청인:</strong> {form.applicant || '(미입력)'}</p>
                      <p><strong>서명:</strong> {signatureDataUrl ? '✅ 서명 완료' : '❌ 미서명'}</p>
                      <p>날짜와 이름을 입력하고, 서명란을 클릭하여 직접 서명해주세요.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ═══ 버튼 바 ═══ */}
          <div className="mf-actions">
            <button type="button" className="mf-btn mf-btn--ghost" onClick={() => setForm(initialForm)}>
              입력 초기화
            </button>
            <button type="submit" className="mf-btn mf-btn--primary" disabled={submitting}>
              {submitting ? '제출 중…' : '신청서 제출'}
            </button>
          </div>
        </form>
      </div>

      {/* ═══ 서명 패드 모달 ═══ */}
      {showSignPad && (
        <div className="mf-signpad-overlay" onClick={() => setShowSignPad(false)}>
          <div className="mf-signpad-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mf-signpad-header">
              <span className="mf-signpad-title">서명해주세요</span>
              <button type="button" className="mf-signpad-close" onClick={() => setShowSignPad(false)}>✕</button>
            </div>
            <div className="mf-signpad-canvas-wrap">
              <canvas
                ref={initSignCanvas}
                className="mf-signpad-canvas"
                onMouseDown={onSignStart}
                onMouseMove={onSignMove}
                onMouseUp={onSignEnd}
                onMouseLeave={onSignEnd}
                onTouchStart={onSignStart}
                onTouchMove={onSignMove}
                onTouchEnd={onSignEnd}
              />
              <span className="mf-signpad-hint">이 영역에 마우스로 서명하세요</span>
            </div>
            <div className="mf-signpad-actions">
              <button type="button" className="mf-btn mf-btn--ghost" onClick={clearSignCanvas}>지우기</button>
              <button type="button" className="mf-btn mf-btn--primary" onClick={confirmSignature}>확인</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
