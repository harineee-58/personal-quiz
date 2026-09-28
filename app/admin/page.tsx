'use client'

import { useEffect, useState } from 'react'

type Submission = { id: string; created_at: string; name: string; birth_year: string; gender: string }
type Detail = Submission & { phone: string; contact_time: string; wish: string; selected_card: string; reflection: string | null; quiz_answers: Record<string, string> }

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<{ submissions: Submission[]; visits: number } | null>(null)
  const [detail, setDetail] = useState<Detail | null>(null)

  async function load() { const response = await fetch('/api/admin/submissions'); if (response.ok) { setData(await response.json()); setLoggedIn(true) } }
  useEffect(() => { load() }, [])
  async function login(event: React.FormEvent) { event.preventDefault(); const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password }) }); if (!response.ok) return setError('Mật khẩu không đúng'); setError(''); await load() }
  async function openDetail(id: string) { const response = await fetch('/api/admin/submissions', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id }) }); if (response.ok) setDetail(await response.json()) }

  if (!loggedIn) return <main className="admin-shell"><form className="admin-login" onSubmit={login}><p className="kicker">INNER / COMPASS</p><h1>Trang quản trị</h1><label>Mật khẩu<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoFocus /></label>{error && <p className="admin-error">{error}</p>}<button className="primary-button" type="submit">Đăng nhập</button></form></main>
  return <main className="admin-shell"><div className="admin-content"><p className="kicker">INNER / COMPASS · ADMIN</p><h1>Dữ liệu người tham gia</h1><div className="admin-stats"><div><span>Số lượt truy cập</span><strong>{data?.visits ?? 0}</strong></div><div><span>Số người submit</span><strong>{data?.submissions.length ?? 0}</strong></div></div><div className="admin-table-wrap"><table><thead><tr><th>STT</th><th>Tên</th><th>Năm sinh</th><th>Giới tính</th></tr></thead><tbody>{data?.submissions.map((submission, index) => <tr key={submission.id}><td>{index + 1}</td><td><button className="admin-name" onClick={() => openDetail(submission.id)}>{submission.name}</button></td><td>{submission.birth_year}</td><td>{submission.gender}</td></tr>)}</tbody></table></div>{detail && <section className="admin-detail"><button className="secondary-button" onClick={() => setDetail(null)}>Đóng</button><h2>{detail.name}</h2><dl><dt>Lá bài đã chọn</dt><dd>{detail.selected_card}</dd><dt>Câu trả lời sau lá bài</dt><dd>{detail.reflection || 'Không nhập'}</dd>{Object.entries(detail.quiz_answers || {}).map(([key, value]) => <div key={key}><dt>Câu {Number(key) + 1}</dt><dd>{value}</dd></div>)}<dt>Năm sinh</dt><dd>{detail.birth_year}</dd><dt>Giới tính</dt><dd>{detail.gender}</dd><dt>Số điện thoại</dt><dd>{detail.phone}</dd><dt>Thời gian liên hệ</dt><dd>{detail.contact_time}</dd><dt>Mong muốn coaching</dt><dd>{detail.wish}</dd></dl></section>}</div></main>
}
