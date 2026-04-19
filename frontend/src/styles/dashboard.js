export const s = {
  // layout
  app:      { display:'flex', flexDirection:'column', minHeight:'100vh', backgroundColor:'#f7f6f3', fontFamily:"'DM Sans', system-ui, sans-serif" },
  navbar:   { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', height:'56px', backgroundColor:'#fff', borderBottom:'0.5px solid rgba(0,0,0,0.08)', position:'sticky', top:0, zIndex:10 },
  brand:    { display:'flex', alignItems:'center', gap:'10px' },
  logoBox:  { width:'32px', height:'32px', borderRadius:'9px', backgroundColor:'#0F6E56', display:'flex', alignItems:'center', justifyContent:'center', color:'white' },
  brandTxt: { fontSize:'14px', fontWeight:'600', color:'#1a1a1a', letterSpacing:'-0.01em' },
  navRight: { display:'flex', alignItems:'center', gap:'12px' },
  body:     { display:'flex', flex:1 },

  // sidebar
  sidebar:  { width:'220px', backgroundColor:'#fff', borderRight:'0.5px solid rgba(0,0,0,0.07)', padding:'20px 12px', display:'flex', flexDirection:'column', gap:'4px' },
  sideItem: { display:'flex', alignItems:'center', gap:'10px', padding:'9px 10px', borderRadius:'8px', fontSize:'13px', color:'#555', cursor:'pointer', transition:'all .15s', border:'none', background:'transparent', width:'100%', textAlign:'left' },
  sideActive:{ backgroundColor:'#0F6E56', color:'white' },

  // content
  content:  { flex:1, padding:'28px 32px', display:'flex', flexDirection:'column', gap:'24px', overflowY:'auto' },
  pageHead: { display:'flex', alignItems:'flex-start', justifyContent:'space-between' },
  pageTitle:{ fontSize:'20px', fontWeight:'600', color:'#1a1a1a', letterSpacing:'-0.02em', margin:0 },
  pageSub:  { fontSize:'13px', color:'#888', marginTop:'3px' },

  // stats
  statsRow: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'14px' },
  statCard: { backgroundColor:'#fff', border:'0.5px solid rgba(0,0,0,0.08)', borderRadius:'12px', padding:'16px 18px' },
  statLbl:  { fontSize:'11px', color:'#999', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'.05em' },
  statVal:  { fontSize:'26px', fontWeight:'600', color:'#1a1a1a', letterSpacing:'-0.03em' },
  statHint: { fontSize:'11px', color:'#bbb', marginTop:'4px' },

  // cards
  card:     { backgroundColor:'#fff', border:'0.5px solid rgba(0,0,0,0.08)', borderRadius:'12px', padding:'20px 22px' },
  secTitle: { fontSize:'13px', fontWeight:'600', color:'#1a1a1a', marginBottom:'14px', letterSpacing:'-0.01em' },

  // cours list
  coursList:{ display:'flex', flexDirection:'column', gap:'8px' },
  coursRow: { display:'flex', alignItems:'center', gap:'14px', padding:'12px 14px', backgroundColor:'#fafaf9', borderRadius:'10px', border:'0.5px solid rgba(0,0,0,0.06)' },
  coursIcon:{ width:'36px', height:'36px', borderRadius:'8px', backgroundColor:'#E1F5EE', display:'flex', alignItems:'center', justifyContent:'center', color:'#0F6E56', flexShrink:0 },
  coursInfo:{ flex:1 },
  coursTit: { fontSize:'13px', fontWeight:'500', color:'#1a1a1a' },
  coursMeta:{ fontSize:'11px', color:'#aaa', marginTop:'2px' },

  // form
  formGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' },
  formGrp:  { display:'flex', flexDirection:'column', gap:'5px' },
  formLbl:  { fontSize:'12px', fontWeight:'500', color:'#666' },
  formInp:  { padding:'9px 11px', borderRadius:'8px', border:'0.5px solid rgba(0,0,0,0.12)', backgroundColor:'#fafaf9', fontSize:'13px', color:'#1a1a1a', outline:'none', width:'100%', boxSizing:'border-box' },
  dropZone: { border:'1.5px dashed rgba(0,0,0,0.15)', borderRadius:'10px', padding:'32px', textAlign:'center', backgroundColor:'#fafaf9', cursor:'pointer' },
  dropTxt:  { fontSize:'13px', color:'#888' },
  dropHint: { fontSize:'11px', color:'#bbb', marginTop:'4px' },

  // table
  tableWrap:{ backgroundColor:'#fff', border:'0.5px solid rgba(0,0,0,0.08)', borderRadius:'12px', overflow:'hidden' },
  tableHead:{ display:'grid', gridTemplateColumns:'1.5fr 2fr 1fr 80px', gap:'12px', padding:'10px 16px', backgroundColor:'#f7f6f3', fontSize:'11px', fontWeight:'600', color:'#999', textTransform:'uppercase', letterSpacing:'.05em' },
  tableRow: { display:'grid', gridTemplateColumns:'1.5fr 2fr 1fr 80px', gap:'12px', padding:'12px 16px', borderTop:'0.5px solid rgba(0,0,0,0.06)', fontSize:'13px', color:'#1a1a1a', alignItems:'center' },

  // badges
  badgeEtu: { display:'inline-block', padding:'2px 9px', borderRadius:'20px', fontSize:'11px', fontWeight:'500', backgroundColor:'#E1F5EE', color:'#085041' },
  badgeProf:{ display:'inline-block', padding:'2px 9px', borderRadius:'20px', fontSize:'11px', fontWeight:'500', backgroundColor:'#E6F1FB', color:'#0C447C' },
  badgeAdm: { display:'inline-block', padding:'2px 9px', borderRadius:'20px', fontSize:'11px', fontWeight:'500', backgroundColor:'#FAEEDA', color:'#633806' },

  // buttons
  btnPrimary:{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 16px', borderRadius:'8px', backgroundColor:'#0F6E56', border:'none', color:'white', fontSize:'13px', fontWeight:'500', cursor:'pointer' },
  btnOutline:{ padding:'5px 12px', borderRadius:'6px', border:'0.5px solid #0F6E56', backgroundColor:'transparent', color:'#0F6E56', fontSize:'12px', cursor:'pointer', fontWeight:'500' },
  btnDanger: { padding:'5px 10px', borderRadius:'6px', border:'0.5px solid #F09595', backgroundColor:'transparent', color:'#A32D2D', fontSize:'12px', cursor:'pointer' },
  btnLogout: { display:'flex', alignItems:'center', gap:'6px', padding:'6px 12px', borderRadius:'7px', border:'0.5px solid rgba(0,0,0,0.12)', backgroundColor:'transparent', color:'#666', fontSize:'12px', cursor:'pointer' },
  avatar:   { width:'30px', height:'30px', borderRadius:'50%', backgroundColor:'#f0ede8', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:'600', color:'#555', border:'0.5px solid rgba(0,0,0,0.1)' },

  // chat
  chatHead: { backgroundColor:'#0F6E56', padding:'16px 18px', display:'flex', alignItems:'center', gap:'10px' },
  chatDot:  { width:'8px', height:'8px', borderRadius:'50%', backgroundColor:'rgba(255,255,255,0.5)' },
  chatMsgs: { padding:'16px', display:'flex', flexDirection:'column', gap:'10px', backgroundColor:'#f7f6f3', minHeight:'220px', maxHeight:'320px', overflowY:'auto' },
  msgUser:  { alignSelf:'flex-end', maxWidth:'75%', padding:'9px 13px', borderRadius:'12px', borderBottomRightRadius:'3px', backgroundColor:'#0F6E56', color:'white', fontSize:'13px', lineHeight:1.5 },
  msgAI:    { alignSelf:'flex-start', maxWidth:'75%', padding:'9px 13px', borderRadius:'12px', borderBottomLeftRadius:'3px', backgroundColor:'#fff', color:'#1a1a1a', fontSize:'13px', lineHeight:1.5, border:'0.5px solid rgba(0,0,0,0.08)' },
  chatBar:  { display:'flex', gap:'8px', padding:'12px 16px', borderTop:'0.5px solid rgba(0,0,0,0.08)', backgroundColor:'#fff' },
  chatInp:  { flex:1, padding:'8px 11px', borderRadius:'8px', border:'0.5px solid rgba(0,0,0,0.12)', backgroundColor:'#fafaf9', fontSize:'13px', color:'#1a1a1a', outline:'none' },
  chatSend: { padding:'8px 14px', borderRadius:'8px', backgroundColor:'#0F6E56', border:'none', color:'white', fontSize:'13px', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px' },

  // upload feedback
  uploadedFile:{ display:'flex', alignItems:'center', gap:'8px', padding:'8px 12px', backgroundColor:'#E1F5EE', borderRadius:'8px', fontSize:'12px', color:'#085041', marginTop:'8px' },
};