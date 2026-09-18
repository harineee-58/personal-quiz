'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, RotateCcw, Sparkles } from 'lucide-react'

type Letter = 'A' | 'B' | 'C' | 'D' | 'E'

type Question = { number: number; text: string; options: Record<Letter, string> }

const questions: Question[] = [
  { number: 1, text: 'Khi đến một nơi hoàn toàn mới, bạn sẽ...', options: { A: 'Chủ động bắt chuyện với mọi người', B: 'Quan sát một lúc rồi mới hòa nhập', C: 'Tìm một người dễ nói chuyện để làm quen', D: 'Xem mình cần làm gì và bắt đầu luôn', E: 'Háo hức khám phá mọi thứ xung quanh' } },
  { number: 2, text: 'Khi gặp một vấn đề khó, bạn thường...', options: { A: 'Làm trước, vừa làm vừa nghĩ', B: 'Phân tích thật kỹ', C: 'Tìm người mình tin tưởng để trao đổi', D: 'Lập kế hoạch giải quyết', E: 'Nghĩ một cách hoàn toàn khác' } },
  { number: 3, text: 'Cuối tuần lý tưởng của bạn là...', options: { A: 'Đi chơi với bạn bè', B: 'Ở nhà tận hưởng thế giới riêng', C: 'Dành thời gian cho người mình yêu quý', D: 'Làm một việc giúp mình tiến bộ', E: 'Đi đâu đó chưa từng đi' } },
  { number: 4, text: 'Khi kế hoạch bất ngờ thay đổi...', options: { A: '“Không sao, chơi tới!”', B: 'Hơi khó chịu vì mình chưa chuẩn bị', C: 'Miễn mọi người vẫn ổn là được', D: 'Nhanh chóng sắp xếp lại', E: '“Biết đâu kế hoạch mới còn vui hơn!”' } },
  { number: 5, text: 'Bạn bè thường tìm đến bạn khi họ...', options: { A: 'Muốn tìm người kéo mood', B: 'Cần một lời khuyên', C: 'Cần người lắng nghe', D: 'Cần giúp giải quyết vấn đề', E: 'Cần một ý tưởng mới' } },
  { number: 6, text: 'Điều khiến bạn khó chịu nhất là...', options: { A: 'Không khí quá nhàm chán', B: 'Bị ép phải giao tiếp quá nhiều', C: 'Người khác vô tâm', D: 'Sự thiếu trách nhiệm', E: 'Cuộc sống lặp đi lặp lại' } },
  { number: 7, text: 'Nếu được cho 1 triệu để “thưởng cho bản thân”, bạn sẽ...', options: { A: 'Rủ bạn bè đi ăn/đi chơi', B: 'Mua thứ mình thích từ lâu', C: 'Mua gì đó cho người mình yêu quý', D: 'Đầu tư vào bản thân', E: 'Dùng cho một trải nghiệm mới' } },
  { number: 8, text: 'Khi stress, bạn thường...', options: { A: 'Tìm người nói chuyện', B: 'Thu mình lại', C: 'Tìm một người khiến mình thấy an toàn', D: 'Tìm cách giải quyết nguyên nhân', E: 'Làm một thứ hoàn toàn khác để đổi mood' } },
  { number: 9, text: 'Bạn muốn người khác nhớ đến mình vì...', options: { A: 'Năng lượng tích cực', B: 'Sự thông minh', C: 'Sự tử tế', D: 'Sự đáng tin cậy', E: 'Sự khác biệt' } },
  { number: 10, text: 'Câu nào giống bạn nhất?', options: { A: '“Mình sống để trải nghiệm.”', B: '“Mình thích hiểu mọi thứ thật rõ.”', C: '“Mình trân trọng những người mình yêu thương.”', D: '“Mình muốn trở thành phiên bản tốt hơn.”', E: '“Mình không thích cuộc sống quá giống nhau.”' } },
]

const results: Record<Letter, { title: string; subtitle: string; color: string; strengths: string[]; note: string; quote: string; lead: string }> = {
  A: { title: 'THE SPARK', subtitle: 'Người truyền năng lượng', color: 'sun', lead: 'Bạn là người mang năng lượng vào mọi cuộc vui.', strengths: ['Giao tiếp', 'Năng lượng', 'Linh hoạt'], note: 'Nhanh chán • Quyết định hơi vội', quote: 'Bạn không cần phải sáng cả ngày. Có những lúc bạn cũng được phép tắt đèn và nghỉ ngơi.' },
  B: { title: 'THE THINKER', subtitle: 'Người quan sát', color: 'moon', lead: 'Bạn là người luôn có cả một thế giới đang diễn ra trong đầu.', strengths: ['Sâu sắc', 'Logic', 'Độc lập'], note: 'Nghĩ quá nhiều • Khó quyết định', quote: 'Không phải mọi thứ đều cần một câu trả lời hoàn hảo. Đôi khi cứ bắt đầu trước đã.' },
  C: { title: 'THE CONNECTOR', subtitle: 'Người kết nối', color: 'rose', lead: 'Bạn là người khiến người khác cảm thấy được lắng nghe.', strengths: ['Đồng cảm', 'Tinh tế', 'Biết lắng nghe'], note: 'Nghĩ cho người khác quá nhiều • Khó nói “không”', quote: 'Bạn chăm sóc cảm xúc của mọi người rất tốt. Đừng quên để dành một phần sự dịu dàng đó cho chính mình.' },
  D: { title: 'THE ACHIEVER', subtitle: 'Người chinh phục', color: 'fire', lead: 'Bạn là người đã muốn làm thì sẽ làm cho tới.', strengths: ['Quyết tâm', 'Kỷ luật', 'Đáng tin cậy'], note: 'Tự tạo áp lực • Khó cho phép bản thân nghỉ ngơi', quote: 'Bạn không cần phải lúc nào cũng tiến về phía trước. Nghỉ một chút cũng là một phần của hành trình.' },
  E: { title: 'THE EXPLORER', subtitle: 'Người khám phá', color: 'blue', lead: 'Bạn là người không thích sống một cuộc đời được viết sẵn.', strengths: ['Sáng tạo', 'Tò mò', 'Thích nghi'], note: 'Dễ chán • Nhiều ý tưởng nhưng khó theo đến cùng', quote: 'Không cần biết con đường nào là hoàn hảo. Quan trọng là bạn vẫn còn muốn khám phá.' },
}

const letters: Letter[] = ['A', 'B', 'C', 'D', 'E']

export default function Page() {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Partial<Record<number, Letter>>>({})
  const [showResult, setShowResult] = useState(false)
  const [favoriteName, setFavoriteName] = useState('')
  const [age, setAge] = useState('')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState('')
  const [feedbackChoice, setFeedbackChoice] = useState('')
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [favoriteNameError, setFavoriteNameError] = useState('')
  const [saveError, setSaveError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    void fetch('/api/views', { method: 'POST' })
  }, [])

  const counts = useMemo(() => letters.reduce((acc, letter) => ({ ...acc, [letter]: Object.values(answers).filter((answer) => answer === letter).length }), {} as Record<Letter, number>), [answers])
  const winners = letters.filter((letter) => counts[letter] === Math.max(...letters.map((item) => counts[item])))
  const result = results[winners[0]]
  const question = questions[current]

  function choose(letter: Letter) {
    setAnswers((previous) => ({ ...previous, [question.number]: letter }))
  }

  async function next() {
    if (current < questions.length - 1) {
      setCurrent((value) => value + 1)
      return
    }

    const trimmedFavoriteName = favoriteName.trim()
    const parsedAge = Number(age)
    if (!trimmedFavoriteName) {
      setFavoriteNameError('Vui lòng nhập điều bạn yêu thích.')
      return
    }
    if (!Number.isInteger(parsedAge) || parsedAge < 1900 || parsedAge > new Date().getFullYear()) {
      setSaveError('Vui lòng nhập năm sinh hợp lệ từ 1900 đến hiện tại.')
      return
    }

    setFavoriteNameError('')
    setSaveError('')
    setShowResult(true)
    setIsSubmitting(true)

    setSaveError('')
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ favoriteName: trimmedFavoriteName, age: parsedAge, answers, primaryResult: winners[0], secondaryResult: winners[1] }),
      })
      if (!response.ok) {
        setSaveError('Không thể lưu kết quả lúc này. Bạn vẫn có thể thử lại.')
        setShowResult(false)
        return
      }
      const saved = await response.json()
      setSessionId(saved.id)
    } catch {
      setSaveError('Không thể kết nối. Bạn vui lòng thử lại nhé.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function submitFeedback() {
    const answer = feedback.trim() || feedbackChoice
    if (!answer) return
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, answer }),
    })
    if (response.ok) setFeedbackSubmitted(true)
  }

  function restart() {
    setAnswers({})
    setCurrent(0)
    setFavoriteName('')
    setAge('')
    setSessionId(null)
    setFeedback('')
    setFeedbackChoice('')
    setFeedbackSubmitted(false)
    setShowResult(false)
  }

  if (showResult) {
    return <ThankYouView restart={restart} />
  }

  const selected = answers[question.number]
  const progress = Math.round(((current + (selected ? 1 : 0)) / questions.length) * 100)

  return (
    <main className="quiz-shell">
      <header className="site-header">
        <div className="brand"><span className="brand-mark"><Sparkles size={16} /></span><span>inner / compass</span></div>
        <span className="header-note">khám phá bản thân · 2026</span>
      </header>
      <section className="quiz-layout">
        <aside className="intro-panel">
          <p className="eyebrow">PERSONALITY TEST <span>✦</span></p>
          <h1>Bạn thuộc<br /><em>kiểu người</em> nào?</h1>
          <p className="intro-copy">10 câu hỏi nhỏ. Một góc nhìn mới về chính bạn.</p>
          <div className="flower-doodle" aria-hidden="true">✾</div>
          <p className="side-tip"><strong>Tip:</strong> Đừng nghĩ quá lâu. Hãy chọn theo phản ứng đầu tiên của bạn nhé.</p>
        </aside>
        <section className="question-card" aria-live="polite">
          <div className="progress-row"><span>CÂU {String(current + 1).padStart(2, '0')} <i>/ 10</i></span><span>{progress}%</span></div>
          <div className="progress-track"><span style={{ width: `${((current + (selected ? 1 : 0)) / questions.length) * 100}%` }} /></div>
          <div className="question-heading"><span className="question-number">{String(question.number).padStart(2, '0')}</span><h2>{question.text}</h2></div>
          <div className="options" role="radiogroup" aria-label={question.text}>
            {letters.map((letter) => <button key={letter} className={`option ${selected === letter ? 'selected' : ''}`} onClick={() => choose(letter)} role="radio" aria-checked={selected === letter}><span className="option-letter">{letter}</span><span>{question.options[letter]}</span>{selected === letter && <Check size={18} className="check-icon" />}</button>)}
          </div>
          {current === questions.length - 1 && <div className="age-gate"><label htmlFor="favorite-name">Hãy ghi tên của điều bạn yêu thích ở đây (loài hoa, thú cưng, món ăn...)</label><input id="favorite-name" type="text" value={favoriteName} onChange={(event) => setFavoriteName(event.target.value)} placeholder="Ví dụ: hoa hướng dương" /><label htmlFor="age">Bạn sinh năm bao nhiêu?</label><input id="age" type="number" min="1900" max={new Date().getFullYear()} value={age} onChange={(event) => setAge(event.target.value)} placeholder="Ví dụ: 2000" />{favoriteNameError && <p className="form-error">{favoriteNameError}</p>}{saveError && <p className="form-error">{saveError}</p>}</div>}
          <div className="card-footer"><button className="back-button" onClick={() => setCurrent((value) => Math.max(0, value - 1))} disabled={current === 0}><ArrowLeft size={16} /> Quay lại</button><button type="button" className="next-button" onClick={next} disabled={isSubmitting || (current < questions.length - 1 && !selected)}>{isSubmitting ? 'Đang gửi...' : current === questions.length - 1 ? 'Gửi' : 'Tiếp theo'} <ArrowRight size={17} /></button></div>
        </section>
      </section>
      <footer className="disclaimer">Một hoạt động khám phá bản thân — không phải đánh giá tâm lý chuyên môn.</footer>
    </main>
  )
}

function ThankYouView({ restart }: { restart: () => void }) {
  return <main className="result-shell thank-you-shell">
    <header className="site-header"><div className="brand"><span className="brand-mark"><Sparkles size={16} /></span><span>inner / compass</span></div><button className="restart-button" onClick={restart}><RotateCcw size={15} /> Làm lại</button></header>
    <section className="thank-you-content"><p className="eyebrow">INNER / COMPASS <span>✦</span></p><div className="thank-you-card"><h1>Cảm ơn bạn đã kiên nhẫn yêu thương bản thân và dành thời gian nhìn lại bản thân.</h1><p>Vui lòng inbox mình để nhận kết quả nhé! ^^</p></div></section>
  </main>
}

function ResultView({ result, winners, counts, restart, feedback, setFeedback, feedbackChoice, setFeedbackChoice, feedbackSubmitted, submitFeedback }: { result: (typeof results)[Letter]; winners: Letter[]; counts: Record<Letter, number>; restart: () => void; feedback: string; setFeedback: (value: string) => void; feedbackChoice: string; setFeedbackChoice: (value: string) => void; feedbackSubmitted: boolean; submitFeedback: () => void }) {
  return <main className={`result-shell result-${result.color}`}>
    <header className="site-header"><div className="brand"><span className="brand-mark"><Sparkles size={16} /></span><span>inner / compass</span></div><button className="restart-button" onClick={restart}><RotateCcw size={15} /> Làm lại</button></header>
    <section className="result-content">
      <p className="eyebrow">KẾT QUẢ CỦA BẠN <span>✦</span></p>
      <div className="result-orbit"><span className="orbit-dot" /><span className="result-letter">{winners.join(' × ')}</span></div>
      <h1>{result.title}</h1><p className="result-subtitle">{result.subtitle}</p>
      <p className="result-lead">{result.lead}</p>
      {winners.length > 1 && <p className="tie-note">Bạn có tính cách kết hợp — hai nguồn năng lượng cùng nổi trội.</p>}
      <div className="result-grid"><div className="result-block"><p className="block-label">ĐIỂM MẠNH CỦA BẠN</p><div className="strength-list">{result.strengths.map((strength) => <span key={strength}>✦ {strength}</span>)}</div></div><div className="result-block note-block"><p className="block-label">BẠN CẦN CHÚ Ý</p><p>{result.note}</p></div></div>
      <blockquote>“{result.quote}”</blockquote>
      <div className="reflection"><div><p className="block-label">ĐỂ LẠI MỘT GÓC NHÌN</p><h2>Kết quả này giống bạn bao nhiêu?</h2></div><div className="percent-pills">{['0–30%', '31–60%', '61–80%', '81–100%'].map((choice) => <button key={choice} className={feedbackChoice === choice ? 'selected' : ''} onClick={() => setFeedbackChoice(choice)}>{choice}</button>)}</div><textarea value={feedback} onChange={(event) => setFeedback(event.target.value)} placeholder="Điều gì trong kết quả khiến bạn bất ngờ nhất?" aria-label="Điều gì trong kết quả khiến bạn bất ngờ nhất?" /><button className="feedback-submit" type="button" onClick={submitFeedback} disabled={!feedbackChoice && !feedback.trim()}>Gửi góc nhìn</button>{feedbackSubmitted && <div className="after-submit"><p>“Trong đời này nhiều khi cơ hội chỉ đến một lần, nếu như chúng ta bỏ qua, thì sẽ là mất đi mãi mãi.”</p><strong>Bạn đã sẵn sàng để học yêu chính bản thân mình chưa?</strong><span>Contact cho mình để mình cùng lắng nghe câu chuyện của bạn nhé!</span></div>}</div>
      <div className="score-strip">{letters.map((letter) => <span key={letter}><b>{letter}</b>{counts[letter]}</span>)}</div>
    </section><footer className="disclaimer">Cảm ơn bạn đã dành một chút thời gian để lắng nghe chính mình.</footer>
  </main>
}
