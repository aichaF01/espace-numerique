import Icon from '../ui/icon';
import { useWindowSize } from '../ui/useWindowSize';

//-----------styles----------------
import { s } from '../../styles/dashboard';


export default function Sidebar({ items, activeView, onSelect }) {
  const { isMobile } = useWindowSize();

  return (
    <aside style={s.sidebar}>
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onSelect(item.key)}
          style={{ ...s.sideItem, ...(activeView === item.key ? s.sideActive : {}) }}
        >
          <Icon d={item.icon} size={15} />
          {item.label}
        </button>
      ))}
    </aside>
  );
}

const st = {
  sidebar: {
    width: '220px', backgroundColor: '#fff',
    borderRight: '0.5px solid rgba(0,0,0,0.07)',
    padding: '16px 10px', display: 'flex',
    flexDirection: 'column', gap: '2px', flexShrink: 0,
  },
  sidebarMobile: {
    width: '100%', flexDirection: 'row',
    overflowX: 'auto', borderRight: 'none',
    borderBottom: '0.5px solid rgba(0,0,0,0.07)',
    padding: '10px 12px', gap: '6px',
    WebkitOverflowScrolling: 'touch',
  },
  item: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '9px 10px', borderRadius: '8px',
    fontSize: '13px', color: '#555', cursor: 'pointer',
    border: 'none', background: 'transparent',
    width: '100%', textAlign: 'left',
    whiteSpace: 'nowrap', flexShrink: 0,
    transition: 'background .15s, color .15s',
  },
  itemMobile: { width: 'auto', padding: '7px 12px' },
  itemActive: { backgroundColor: '#0F6E56', color: 'white' },
};