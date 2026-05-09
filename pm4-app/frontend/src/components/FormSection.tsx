import { ZrCard } from '@zurich/web-components/react/card';

interface Props {
  title: string;
  children: React.ReactNode;
  color?: string;
}

export default function FormSection({ title, children, color = '#1a3c6e' }: Props) {
  return (
    <ZrCard
      config="slim"
      style={{
        marginBottom: '20px',
        overflow: 'hidden',
        ['--z-card--bg' as any]:     '#fff',
        ['--z-card--radius' as any]: '12px',
        ['--z-card--shadow' as any]: '0 1px 3px rgba(0,0,0,.07), 0 6px 18px rgba(0,0,0,.06)',
        ['--z-card--border' as any]: '1px solid rgba(221,227,236,.7)',
      } as React.CSSProperties}
    >
      <div className="form-section-header" style={{ backgroundColor: color }}>
        <span>{title}</span>
      </div>
      <div className="form-section-body">{children}</div>
    </ZrCard>
  );
}
