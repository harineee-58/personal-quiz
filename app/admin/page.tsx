'use client'

import { useState } from 'react'

type Letter = 'A' | 'B' | 'C' | 'D' | 'E'
type Session = { id: string; favoriteName: string; age: number | null; answers: Record<string, Letter>; primaryResult: Letter; secondaryResult: Letter | null; createdAt: string }
type Analytics = { views: number; tests: number; feedbackCount: number; resultBreakdown: { result: string; value: number }[]; recentSessions: Session[]; feedback: { id: string; answer: string; createdAt: string }[]; page: number; pageSize: number; totalSessions: number; totalPages: number }

const resultDetails: Record<Letter, { title: string; subtitle: string; lead: string; strengths: string[]; note: string; quote: string }> = {
  A: { title: 'THE SPARK', subtitle: 'Người truyền năng lượng', lead: 'Bạn là người mang năng lượng vào mọi cuộc vui.', strengths: ['Giao tiếp', 'Năng lượng', 'Linh hoạt'], note: 'Nhanh chán • Quyết định hơi vội', quote: 'Bạn không cần phải sáng cả ngày. Có những lúc bạn cũng được phép tắt đèn và nghỉ ngơi.' },
  B: { title: 'THE THINKER', subtitle: 'Người quan sát', lead: 'Bạn là người luôn có cả một thế giới đang diễn ra trong đầu.', strengths: ['Sâu sắc', 'Logic', 'Độc lập'], note: 'Nghĩ quá nhiều • Khó quyết định', quote: 'Không phải mọi thứ đều cần một câu trả lời hoàn hảo. Đôi khi cứ bắt đầu trước đã.' },
  C: { title: 'THE CONNECTOR', subtitle: 'Người kết nối', lead: 'Bạn là người khiến người khác cảm thấy được lắng nghe.', strengths: ['Đồng cảm', 'Tinh tế', 'Biết lắng nghe'], note: 'Nghĩ cho người khác quá nhiều • Khó nói “không”', quote: 'Bạn chăm sóc cảm xúc của mọi người rất tốt. Đừng quên để dành một phần sự dịu dàng đó cho chính mình.' },
  D: { title: 'THE ACHIEVER', subtitle: 'Người chinh phục', lead: 'Bạn là người đã muốn làm thì sẽ làm cho tới.', strengths: ['Quyết tâm', 'Kỷ luật', 'Đáng tin cậy'], note: 'Tự tạo áp lực • Khó cho phép bản thân nghỉ ngơi', quote: 'Bạn không cần phải lúc nào cũng tiến về phía trước. Nghỉ một chút cũng là một phần của hành trình.' },
  E: { title: 'THE EXPLORER', subtitle: 'Người khám phá', lead: 'Bạn là người không thích sống một cuộc đời được viết sẵn.', strengths: ['Sáng tạo', 'Tò mò', 'Thích nghi'], note: 'Dễ chán • Nhiều ý tưởng nhưng khó theo đến cùng', quote: 'Không cần biết con đường nào là hoàn hảo. Quan trọng là bạn vẫn còn muốn khám phá.' },
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [isLoadingPage, setIsLoadingPage] = useState(false)

  async function loadAnalytics(event: React.FormEvent) {
    event.preventDefault()
    await loadPage(1)
  }

  async function loadPage(nextPage: number) {
    setError('')
    setIsLoadingPage(true)
    try {
      const response = await fetch(`/api/admin?page=${nextPage}`, { headers: { 'x-admin-password': password } })
      if (!response.ok) { setError('Mật khẩu chưa đúng.'); return }
      setAnalytics(await response.json())
      setPage(nextPage)
    } catch {
      setError('Không thể tải dữ liệu lúc này.')
    } finally {
      setIsLoadingPage(false)
    }
  }

  if (!analytics) return <main className="admin-shell"><section className="admin-login"><p className="eyebrow">OWNER ACCESS</p><h1>Analytics của bài test</h1><p>Nhập mật khẩu để xem lượt truy cập, kết quả và câu trả lời.</p><form onSubmit={loadAnalytics} className="admin-form"><input aria-label="Mật khẩu quản trị" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mật khẩu" required /><button type="submit">Xem thống kê</button></form>{error && <p className="admin-error">{error}</p>}</section></main>

  return <main className="admin-shell"><section className="admin-content"><div className="admin-heading"><p className="eyebrow">OWNER DASHBOARD</p><h1>Những gì đang diễn ra</h1><p>Dữ liệu được cập nhật từ những lượt làm bài thật.</p></div><div className="admin-stats"><article><span>Lượt xem</span><strong>{analytics.views}</strong></article><article><span>Đã làm bài</span><strong>{analytics.tests}</strong></article><article><span>Góc nhìn</span><strong>{analytics.feedbackCount}</strong></article></div><div className="admin-grid"><section className="admin-card"><h2>Kết quả chính</h2>{analytics.resultBreakdown.map((item) => <div className="breakdown-row" key={item.result}><span>{item.result}</span><strong>{item.value}</strong></div>)}</section><section className="admin-card"><h2>Góc nhìn đã gửi</h2><div className="feedback-list">{analytics.feedback.length ? analytics.feedback.map((item) => <blockquote key={item.id}>{item.answer}<small>{new Date(item.createdAt).toLocaleString('vi-VN')}</small></blockquote>) : <p>Chưa có câu trả lời nào.</p>}</div></section></div><section className="admin-card"><h2>Lượt làm bài gần đây</h2><p className="admin-hint">Bấm vào tên để xem toàn bộ kết quả.</p><div className="session-list">{analytics.recentSessions.map((session) => <button className="session-row session-button" key={session.id} type="button" onClick={() => setSelectedSession(session)}><span>{session.favoriteName}</span><strong>{session.primaryResult}{session.secondaryResult ? ` + ${session.secondaryResult}` : ''}</strong><small>{new Date(session.createdAt).toLocaleString('vi-VN')}</small></button>)}</div><div className="pagination" aria-label="Phân trang kết quả"><button type="button" onClick={() => loadPage(page - 1)} disabled={page <= 1 || isLoadingPage}>Trang trước</button><span>Trang {page} / {analytics.totalPages} <small>({analytics.totalSessions} kết quả)</small></span><button type="button" onClick={() => loadPage(page + 1)} disabled={page >= analytics.totalPages || isLoadingPage}>Trang sau</button></div></section></section>{selectedSession && <AdminResultDetail session={selectedSession} onClose={() => setSelectedSession(null)} />}</main>
}

function AdminResultDetail({ session, onClose }: { session: Session; onClose: () => void }) {
  const result = resultDetails[session.primaryResult]
  return <div className="admin-result-overlay" role="dialog" aria-modal="true" aria-label={`Kết quả của ${session.favoriteName}`}><article className="admin-result-detail"><button className="detail-close" type="button" onClick={onClose}>Đóng</button><p className="eyebrow">KẾT QUẢ ĐẦY ĐỦ</p><h2>{result.title}</h2><p className="result-subtitle">{result.subtitle}</p><p className="detail-name">Điều yêu thích: <strong>{session.favoriteName}</strong> · Độ tuổi: <strong>{session.age ?? 'Chưa nhập'}</strong></p><p className="result-lead">{result.lead}</p><div className="result-grid"><div className="result-block"><p className="block-label">ĐIỂM MẠNH CỦA BẠN</p><div className="strength-list">{result.strengths.map((strength) => <span key={strength}>✦ {strength}</span>)}</div></div><div className="result-block note-block"><p className="block-label">BẠN CẦN CHÚ Ý</p><p>{result.note}</p></div></div><blockquote>“{result.quote}”</blockquote><div className="answer-list"><p className="block-label">CÂU TRẢ LỜI</p>{Object.entries(session.answers).map(([number, answer]) => <span key={number}>Câu {number}: <strong>{answer}</strong></span>)}</div></article></div>
}
