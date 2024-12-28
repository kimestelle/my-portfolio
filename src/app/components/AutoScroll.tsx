interface AutoScrollProps {
  images: string[];
}

const AutoScroll = ({ images }: AutoScrollProps) => {
  return (
    <div className="relative auto-scroll-container overflow-hidden h-28 w-full relative">
      <div className="linear-overlay"/>
      <div className="auto-scroll-track">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Image ${index + 1}`}
            className="h-28 w-auto object-contain"
          />
        ))}
        {images.map((image, index) => (
          <img
            key={`duplicate-${index}`}
            src={image}
            alt={`Image duplicate ${index + 1}`}
            className="h-28 w-auto object-contain"
          />
        ))}
      </div>
    </div>
  );
};

export default AutoScroll;
