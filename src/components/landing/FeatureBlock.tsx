import Image from 'next/image';

interface FeatureBlockProps {
  title: string;
  description: string;
  image: string;
  isReversed?: boolean;
}

export function FeatureBlock({ title, description, image, isReversed }: FeatureBlockProps) {
  return (
    <div className="w-full bg-black border-t-8 border-grey-800 py-16 lg:py-24 px-8 lg:px-24">
      <div className={`max-w-7xl mx-auto flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center justify-between gap-12`}>
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 lg:mb-6 leading-tight">
            {title}
          </h2>
          <p className="text-lg md:text-2xl text-white font-medium">
            {description}
          </p>
        </div>
        
        <div className="flex-1 relative w-full aspect-[4/3]">
          <Image 
            src={image}
            alt={title}
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
