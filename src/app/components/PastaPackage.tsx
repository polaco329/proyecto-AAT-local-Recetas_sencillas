import './PastaPackage.css';

export function PastaPackage() {
  return (
    <div className="pasta-package" aria-hidden="true">
      <div className="pasta-package__box">
        <div className="pasta-package__label">
          <span className="pasta-package__brand">Recetas</span>
          <span className="pasta-package__type">Fideos</span>
        </div>
        <div className="pasta-package__window">
          <div className="pasta-package__noodle pasta-package__noodle--1" />
          <div className="pasta-package__noodle pasta-package__noodle--2" />
          <div className="pasta-package__noodle pasta-package__noodle--3" />
          <div className="pasta-package__noodle pasta-package__noodle--4" />
        </div>
      </div>
    </div>
  );
}
