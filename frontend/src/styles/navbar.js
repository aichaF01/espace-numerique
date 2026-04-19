export const st = {
  navbar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 24px', height: '56px',
    backgroundColor: '#fff',
    borderBottom: '0.5px solid rgba(0,0,0,0.08)',
    position: 'sticky', top: 0, zIndex: 100,
  },

  // brand
  brand: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoBox:  { width:'32px', height:'32px', borderRadius:'9px', backgroundColor:'#0F6E56', display:'flex', alignItems:'center', justifyContent:'center', color:'white' },
  brandTxt: {
    fontSize: '14px', fontWeight: '600',
    color: '#1a1a1a', letterSpacing: '-0.01em',
  },

  // trigger button
  triggerBtn: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '5px 10px', borderRadius: '8px',
    border: '0.5px solid rgba(0,0,0,0.1)',
    backgroundColor: 'transparent', cursor: 'pointer',
    transition: 'background .15s',
  },
  avatar: {
    width: '30px', height: '30px', borderRadius: '50%',
    backgroundColor: '#f0ede8', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: '11px', fontWeight: '600', color: '#555',
    border: '0.5px solid rgba(0,0,0,0.1)', flexShrink: 0,
  },
  triggerName: {
    fontSize: '13px', fontWeight: '500', color: '#333',
  },

  // dropdown panel
  dropdown: {
    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
    minWidth: '230px', backgroundColor: '#fff',
    border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.09)',
    overflow: 'hidden', zIndex: 200,
  },

  // dropdown header
  dropHead: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '16px',
  },
  avatarLg: {
    width: '40px', height: '40px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '16px', fontWeight: '600', flexShrink: 0,
  },
  dropName: {
    fontSize: '13px', fontWeight: '600',
    color: '#1a1a1a', marginBottom: '5px',
  },
  rolePill: {
    display: 'inline-block', padding: '2px 8px',
    borderRadius: '20px', fontSize: '11px', fontWeight: '500',
  },

  // separator
  sep: { height: '0.5px', backgroundColor: 'rgba(0,0,0,0.07)' },

  // dropdown items
  dropItem: {
    display: 'flex', alignItems: 'center', gap: '10px',
    width: '100%', padding: '11px 16px',
    border: 'none', backgroundColor: 'transparent',
    fontSize: '13px', color: '#444',
    cursor: 'pointer', textAlign: 'left',
    transition: 'background .12s',
  },
};