import Image from 'next/image';

interface OTTProvider {
  id: string;
  name: string;
  logo: string;
  networkId: string;
}

interface OTTProviderRowProps {
  providers: OTTProvider[];
  onSelect: (providerId: string) => void;
}

export function OTTProviderRow({ providers, onSelect }: OTTProviderRowProps) {
  return (
    <section className="py-6">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-6 px-4 md:px-12 lg:px-16">
        Streaming Services
      </h2>
      
      <div className="flex gap-4 md:gap-6 overflow-x-auto py-2 md:py-4 pb-4 md:pb-8 px-4 md:px-12 lg:px-16 no-scrollbar">
        {providers.map(p => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className="flex-shrink-0 group flex flex-col items-center gap-2"
          >
            <div className="w-16 h-16 md:w-28 md:h-28 rounded-full overflow-hidden bg-white border-2 border-gray-800 group-hover:border-[#e50914] group-hover:scale-110 transition-all duration-300 shadow-lg">
              <Image 
                src={p.logo} 
                alt={p.name} 
                width={112} 
                height={112} 
                className="object-contain w-full h-full p-2 md:p-3" 
              />
            </div>
            <span className="text-[10px] md:text-xs text-gray-400 group-hover:text-white font-medium transition-colors">
              {p.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

