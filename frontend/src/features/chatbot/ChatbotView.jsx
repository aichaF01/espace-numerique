import React, { useState } from 'react'
import { askAI } from '../../api/ai';

// --------------icons & styles----------------
import Icon from '../../components/ui/icon';
import { ICONS } from '../../components/ui/icons';
import { s } from '../../styles/dashboard';

function ChatbotView() {
const [messages, setMessages] = useState([
    { role:'ai', text:'Bonjour ! Je suis votre assistant pédagogique. Posez-moi vos questions sur les cours.' }
  ]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading]   = useState(false);

  const send = async () => {
    const q = question.trim();
    if (!q || loading) return;
    setMessages(m => [...m, { role:'user', text: q }]);
    setQuestion('');
    setLoading(true);
    try {
      const data = await askAI(q);
      setMessages(m => [...m, { role:'ai', text: data.answer || data.response || 'Réponse reçue.' }]);
    } catch {
      setMessages(m => [...m, { role:'ai', text: 'Erreur de connexion avec l\'assistant. Réessayez.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ ...s.card, padding:0, overflow:'hidden' }}>
      <div style={s.chatHead}>
        <div style={s.chatDot} />
        <div>
          <div style={{ fontSize:'14px', fontWeight:'600', color:'white' }}>Assistant EST Salé</div>
          <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.65)' }}>Propulsé par Llama 3 via Ollama</div>
        </div>
      </div>
      <div style={s.chatMsgs}>
        {messages.map((m, i) => (
          <div key={i} style={m.role === 'user' ? s.msgUser : s.msgAI}>{m.text}</div>
        ))}
        {loading && <div style={s.msgAI}>L'assistant réfléchit...</div>}
      </div>
      <div style={s.chatBar}>
        <input style={s.chatInp} value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Posez votre question pédagogique..." />
        <button style={s.chatSend} onClick={send}>
          <Icon d={ICONS.send} size={14} />
          Envoyer
        </button>
      </div>
    </div>
  );
}

export default ChatbotView