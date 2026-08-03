import BouncingText from "../design-deets/BouncingText";

export default function Footer() {
  return (
    <footer className="site-footer responsive-padding relative w-full">
      <div className="page-frame-wide">
        <div className="flex w-full flex-col items-start justify-between gap-3 border-t border-[color:var(--line-color)] pt-5 sm:flex-row sm:items-center">
          <BouncingText className="type-meta text-[color:var(--text-meta)]">
            thank you for visiting :-)
          </BouncingText>
        </div>
      </div>
    </footer>
  );
}
