import BouncingText from "../design-deets/BouncingText";

export default function Footer() {
  return (
    <footer className="relative w-full flex flex-col items-start responsive-padding">
      <div className='w-full bg-invert flex flex-col items-start justify-between'>
        <BouncingText>thank you for visiting :-)</BouncingText>
        <span><a href="mailto:kestelle@sas.upenn.edu">kestelle@sas.upenn.edu</a></span>
      </div>
      <span className='select-none'>.✦*~</span>
    </footer>
  );
}